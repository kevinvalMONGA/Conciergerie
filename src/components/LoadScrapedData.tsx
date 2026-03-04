"use client";

import { Conciergerie } from "@/types";
import scrapedData from "@/data/scraped-conciergeries.json";
import lotsV1 from "@/data/lots-par-agence.json";
import lotsV2 from "@/data/lots-par-agence-v2.json";
import fondateursData from "@/data/fondateurs.json";

interface LoadScrapedDataProps {
  onLoad: (data: Conciergerie[]) => void;
}

interface ScrapedEntry {
  nom: string;
  siteWeb?: string;
  villes: string[];
  telephone?: string;
  email?: string;
  services?: string[];
  note?: number;
  categorie?: string;
  description?: string;
  commission?: string;
  fondateur?: string;
  biensEstimes?: number;
}

type LotsRecord = Record<string, { lots: number }>;
const allLots: LotsRecord = { ...(lotsV2 as LotsRecord), ...(lotsV1 as LotsRecord) };

type FondateursRecord = Record<string, { fondateur: string; linkedin?: string | null }>;
const allFondateurs = fondateursData as FondateursRecord;

export function convertScrapedData(): Conciergerie[] {
  return (scrapedData as ScrapedEntry[])
    .filter((entry) => entry.categorie !== "plateforme")
    .map((entry) => ({
      id: crypto.randomUUID(),
      nom: entry.nom,
      responsable: allFondateurs[entry.nom]?.fondateur || entry.fondateur || "",
      email: entry.email || "",
      telephone: entry.telephone || "",
      ville: entry.villes?.join(", ") || "",
      biensEnGestion: allLots[entry.nom]?.lots || entry.biensEstimes || 0,
      biensOccupes: 0,
      revenuMensuel: 0,
      tauxOccupation: 0,
      note: entry.note || 0,
      statut: "actif" as const,
      dateCreation: new Date().toISOString().split("T")[0],
      siteWeb: entry.siteWeb || "",
      services: entry.services || [],
      categorie: entry.categorie || "",
      description: entry.description || "",
      linkedin: allFondateurs[entry.nom]?.linkedin || undefined,
    }));
}

export function LoadScrapedData({ onLoad }: LoadScrapedDataProps) {
  const handleLoad = () => {
    onLoad(convertScrapedData());
  };

  return (
    <button
      onClick={handleLoad}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Charger 96 agences scrapées
    </button>
  );
}
