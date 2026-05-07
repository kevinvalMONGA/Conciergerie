/**
 * Conciergerie MAOS dispatcher — read-only access to scraped + structured
 * conciergerie data. HMAC-protected via X-MAOS-Signature.
 *
 * No DB here — Conciergerie is a static-data Next.js app. We import the
 * TS data + JSON files directly and serve filtered slices to MAOS.
 *
 * Two ops:
 *   conciergerie_search — match name/city across both data sources
 *   conciergerie_stats  — aggregates by city / category / size
 */

import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { conciergeries } from '@/data/conciergeries'
import scrapedData from '@/data/scraped-conciergeries.json'

export const dynamic = 'force-dynamic'

const MAX_AGE_MS = 5 * 60 * 1000

interface ScrapedConciergerie {
  nom: string
  siteWeb?: string
  villes?: string[]
  telephone?: string
  email?: string
  services?: string[]
  note?: number
  categorie?: string
  description?: string
}

interface SearchOp { op: 'conciergerie_search'; query?: string; ville?: string; categorie?: string; limit?: number }
interface StatsOp { op: 'conciergerie_stats' }
type Op = SearchOp | StatsOp

function verifyHmac(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MAOS_SHARED_SECRET
  if (!secret) return false
  const sig = req.headers.get('x-maos-signature') ?? ''
  const ts = req.headers.get('x-maos-timestamp') ?? ''
  if (!sig || !ts) return false
  const tsNum = Number(ts)
  if (!Number.isFinite(tsNum) || Math.abs(Date.now() - tsNum) > MAX_AGE_MS) return false
  const expected = createHmac('sha256', secret).update(ts + '.').update(rawBody).digest('hex')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

function search(b: SearchOp) {
  const q = b.query?.trim().toLowerCase() ?? ''
  const ville = b.ville?.trim().toLowerCase() ?? ''
  const cat = b.categorie?.trim().toLowerCase() ?? ''
  const limit = Math.max(1, Math.min(50, b.limit ?? 20))

  const matches = (scrapedData as ScrapedConciergerie[]).filter((c) => {
    if (q && !c.nom.toLowerCase().includes(q)) return false
    if (ville && !(c.villes ?? []).some((v) => v.toLowerCase().includes(ville))) return false
    if (cat && !(c.categorie ?? '').toLowerCase().includes(cat)) return false
    return true
  })
  // Also include matching structured CRM data (typically smaller, used for
  // gestion-locative leads with revenue/occupation signal).
  const crmMatches = conciergeries.filter((c) => {
    if (q && !c.nom.toLowerCase().includes(q)) return false
    if (ville && !c.ville.toLowerCase().includes(ville)) return false
    return true
  })

  return {
    query: b.query ?? '',
    ville: b.ville ?? 'all',
    categorie: b.categorie ?? 'all',
    scrapedTotal: matches.length,
    crmTotal: crmMatches.length,
    scraped: matches.slice(0, limit).map((c) => ({
      nom: c.nom,
      siteWeb: c.siteWeb,
      villes: c.villes ?? [],
      services: c.services ?? [],
      note: c.note,
      categorie: c.categorie,
      description: c.description,
    })),
    crm: crmMatches.slice(0, limit).map((c) => ({
      id: c.id,
      nom: c.nom,
      ville: c.ville,
      biensEnGestion: c.biensEnGestion,
      tauxOccupation: c.tauxOccupation,
      revenuMensuel: c.revenuMensuel,
      note: c.note,
      statut: c.statut,
    })),
  }
}

function stats() {
  const scraped = scrapedData as ScrapedConciergerie[]
  const byCategory: Record<string, number> = {}
  const cityCount: Record<string, number> = {}
  for (const c of scraped) {
    const cat = c.categorie ?? 'unknown'
    byCategory[cat] = (byCategory[cat] ?? 0) + 1
    for (const v of c.villes ?? []) {
      cityCount[v] = (cityCount[v] ?? 0) + 1
    }
  }
  const topCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([city, count]) => ({ city, count }))

  // CRM aggregates (smaller dataset)
  const crm = conciergeries
  const totalBiens = crm.reduce((s, c) => s + c.biensEnGestion, 0)
  const totalRevenu = crm.reduce((s, c) => s + c.revenuMensuel, 0)
  const avgOccup = crm.length
    ? Math.round(crm.reduce((s, c) => s + c.tauxOccupation, 0) / crm.length)
    : 0

  return {
    scraped: {
      total: scraped.length,
      byCategory: Object.entries(byCategory).map(([categorie, count]) => ({ categorie, count })),
      topCities,
    },
    crm: {
      total: crm.length,
      totalBiensEnGestion: totalBiens,
      totalRevenuMensuel: totalRevenu,
      avgTauxOccupation: avgOccup,
      byVille: Object.entries(
        crm.reduce<Record<string, number>>((acc, c) => {
          acc[c.ville] = (acc[c.ville] ?? 0) + 1
          return acc
        }, {})
      ).map(([ville, count]) => ({ ville, count })),
    },
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  if (!verifyHmac(req, rawBody)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }
  let body: Op
  try {
    body = JSON.parse(rawBody) as Op
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  switch (body.op) {
    case 'conciergerie_search':
      return NextResponse.json(search(body))
    case 'conciergerie_stats':
      return NextResponse.json(stats())
    default: {
      const op = (body as { op?: string }).op
      return NextResponse.json({ error: `unknown op: ${op}` }, { status: 400 })
    }
  }
}
