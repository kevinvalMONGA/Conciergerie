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

export function ConciergerieDetail({ conciergerie: c, onClose }: ConciergerieDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{c.nom}</h2>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statutColors[c.statut]}`}>
                {statutLabels[c.statut]}
              </span>
            </div>
            {c.categorie && (
              <span className="text-xs text-gray-400 uppercase tracking-wider">{c.categorie.replace(/_/g, " ")}</span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Description */}
          {c.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{c.description}</p>
          )}

          {/* Dirigeant */}
          <Section title="Dirigeant">
            {c.responsable ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  {c.responsable.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{c.responsable}</p>
                  {c.linkedin && (
                    <a
                      href={c.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Voir le profil LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Non renseigné</p>
            )}
          </Section>

          {/* Chiffres clés */}
          <Section title="Chiffres clés">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Lots gérés" value={c.biensEnGestion > 0 ? c.biensEnGestion.toString() : "—"} />
              <Stat label="Occupés" value={c.biensOccupes > 0 ? c.biensOccupes.toString() : "—"} />
              <Stat label="Taux occ." value={c.tauxOccupation > 0 ? `${c.tauxOccupation}%` : "—"} />
              <Stat label="Revenu/mois" value={c.revenuMensuel > 0 ? `${c.revenuMensuel.toLocaleString("fr-FR")} €` : "—"} />
            </div>
            {c.note > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-semibold text-gray-900">{c.note.toFixed(1)}</span>
                <span className="text-sm text-gray-400">/ 5</span>
              </div>
            )}
          </Section>

          {/* Localisation */}
          <Section title="Localisation">
            <p className="text-sm text-gray-700">{c.ville || "Non renseignée"}</p>
          </Section>

          {/* Contact */}
          {(c.email || c.telephone || c.siteWeb) && (
            <Section title="Contact">
              <div className="space-y-2">
                {c.siteWeb && (
                  <ContactRow
                    icon={<GlobeIcon />}
                    label={c.siteWeb.replace(/^https?:\/\/(www\.)?/, "")}
                    href={c.siteWeb}
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
              </div>
            </Section>
          )}

          {/* Services */}
          {c.services && c.services.length > 0 && (
            <Section title="Services">
              <div className="flex flex-wrap gap-2">
                {c.services.map((s) => (
                  <span
                    key={s}
                    className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function ContactRow({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
    >
      {icon}
      {label}
    </a>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
