"use client";

import { Conciergerie } from "@/types";

interface ConciergerieDetailProps {
  conciergerie: Conciergerie;
  onClose: () => void;
}

const statutColors: Record<Conciergerie["statut"], string> = {
  actif: "bg-green-100 text-green-700",
  inactif: "bg-red-100 text-red-700",
  en_attente: "bg-yellow-100 text-yellow-700",
};

const statutLabels: Record<Conciergerie["statut"], string> = {
  actif: "Actif",
  inactif: "Inactif",
  en_attente: "En attente",
};

const categorieLabels: Record<string, string> = {
  leader_national: "Leader national",
  conciergerie_locale: "Conciergerie locale",
  conciergerie_regionale: "Conciergerie régionale",
  plateforme: "Plateforme",
};

export function ConciergerieDetail({ conciergerie: c, onClose }: ConciergerieDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">{c.nom}</h2>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statutColors[c.statut]}`}>
                {statutLabels[c.statut]}
              </span>
              {c.note > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                  ★ {c.note.toFixed(1)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {c.categorie && (
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  {categorieLabels[c.categorie] || c.categorie.replace(/_/g, " ")}
                </span>
              )}
              {c.siteWeb && (
                <>
                  <span className="text-gray-300">·</span>
                  <a
                    href={c.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    {c.siteWeb.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </a>
                </>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 ml-4 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Description */}
          {c.description && (
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-lg p-4">{c.description}</p>
          )}

          {/* Dirigeant & Équipe fondatrice */}
          <Section title="Dirigeant & Équipe fondatrice">
            {c.responsable ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {c.responsable.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{c.responsable}</p>
                    {c.titreFondateur && c.titreFondateur !== "Non trouve" && (
                      <p className="text-sm text-gray-500">{c.titreFondateur}</p>
                    )}
                    {c.linkedin && (
                      <a
                        href={c.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 mt-0.5"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Profil LinkedIn
                      </a>
                    )}
                  </div>
                </div>
                {c.cofondateurs && c.cofondateurs.length > 0 && (
                  <div className="ml-15 pl-4 border-l-2 border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Co-fondateurs</p>
                    <div className="flex flex-wrap gap-2">
                      {c.cofondateurs.map((cf) => (
                        <span key={cf} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-medium">
                            {cf.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                          {cf}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {c.noteFondateur && (
                  <p className="text-xs text-gray-400 italic ml-15 pl-4 border-l-2 border-gray-100">{c.noteFondateur}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Non renseigné</p>
            )}
          </Section>

          {/* Chiffres clés */}
          <Section title="Chiffres clés">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Lots gérés" value={c.biensEnGestion > 0 ? c.biensEnGestion.toLocaleString("fr-FR") : "—"} color="blue" />
              <StatCard label="Occupés" value={c.biensOccupes > 0 ? c.biensOccupes.toLocaleString("fr-FR") : "—"} color="green" />
              <StatCard label="Taux occ." value={c.tauxOccupation > 0 ? `${c.tauxOccupation}%` : "—"} color="emerald" />
              <StatCard label="Revenu/mois" value={c.revenuMensuel > 0 ? `${c.revenuMensuel.toLocaleString("fr-FR")} €` : "—"} color="purple" />
            </div>
            {c.commission && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-gray-500">Commission :</span>
                <span className="font-medium text-gray-900 bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{c.commission}</span>
              </div>
            )}
          </Section>

          {/* Localisation */}
          <Section title="Localisation">
            <div className="flex flex-wrap gap-1.5">
              {c.ville.split(", ").map((v) => (
                <span key={v} className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {v}
                </span>
              ))}
            </div>
          </Section>

          {/* Contact */}
          <Section title="Contact">
            <div className="space-y-2.5">
              {c.siteWeb && (
                <ContactRow
                  icon={<GlobeIcon />}
                  label={c.siteWeb.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  href={c.siteWeb}
                />
              )}
              {c.linkedin && (
                <ContactRow
                  icon={<LinkedInIcon />}
                  label="Profil LinkedIn du dirigeant"
                  href={c.linkedin}
                />
              )}
              {c.email && (
                <ContactRow
                  icon={<MailIcon />}
                  label={c.email}
                  href={`mailto:${c.email}`}
                />
              )}
              {c.telephone && (
                <ContactRow
                  icon={<PhoneIcon />}
                  label={c.telephone}
                  href={`tel:${c.telephone}`}
                />
              )}
              {!c.siteWeb && !c.email && !c.telephone && !c.linkedin && (
                <p className="text-sm text-gray-400 italic">Aucun contact renseigné</p>
              )}
            </div>
          </Section>

          {/* Services */}
          {c.services && c.services.length > 0 && (
            <Section title="Services proposés">
              <div className="flex flex-wrap gap-2">
                {c.services.map((s) => (
                  <span
                    key={s}
                    className="inline-flex px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Infos complémentaires */}
          <Section title="Informations">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow label="Date d'ajout" value={c.dateCreation} />
              <InfoRow label="ID" value={c.id.slice(0, 8) + "..."} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  emerald: "bg-emerald-50 text-emerald-700",
  purple: "bg-purple-50 text-purple-700",
};

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`rounded-lg p-3 text-center ${colorMap[color] || "bg-gray-50 text-gray-700"}`}>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  );
}

function ContactRow({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
    >
      {icon}
      <span className="hover:underline">{label}</span>
    </a>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
