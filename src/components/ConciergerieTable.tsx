"use client";

import { Conciergerie } from "@/types";
import { useState } from "react";

interface ConciergerieTableProps {
  data: Conciergerie[];
  onDelete?: (id: string) => void;
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

export function ConciergerieTable({ data, onDelete }: ConciergerieTableProps) {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState<string>("tous");

  const filtered = data.filter((c) => {
    const searchLower = search.toLowerCase();
    const matchSearch =
      c.nom.toLowerCase().includes(searchLower) ||
      c.ville.toLowerCase().includes(searchLower) ||
      c.responsable.toLowerCase().includes(searchLower) ||
      (c.description?.toLowerCase().includes(searchLower) ?? false);
    const matchStatut = statutFilter === "tous" || c.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Rechercher par nom, ville, responsable..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="tous">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
          <option value="en_attente">En attente</option>
        </select>
        <span className="text-sm text-gray-400">{filtered.length} résultats</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conciergerie
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ville(s)
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lots
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Occupation
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenu/mois
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              {onDelete && (
                <th className="w-12 px-3 py-3" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{c.nom}</p>
                      {c.siteWeb && (
                        <a
                          href={c.siteWeb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-600"
                          title={c.siteWeb}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                    {c.responsable && (
                      <p className="text-sm text-gray-500">
                        {c.responsable}
                        {c.linkedin && (
                          <a
                            href={c.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center ml-1.5 text-blue-400 hover:text-blue-600"
                            title="LinkedIn"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                      </p>
                    )}
                    {c.description && (
                      <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{c.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px]">
                  <span className="line-clamp-2">{c.ville}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {c.biensEnGestion > 0 ? (
                    <>
                      <span className="font-semibold text-gray-900">{c.biensEnGestion}</span>
                      <span className="text-sm text-gray-400 ml-1">
                        ({c.biensOccupes} occ.)
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-300">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {c.tauxOccupation > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${c.tauxOccupation}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{c.tauxOccupation}%</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-300">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">
                  {c.revenuMensuel > 0
                    ? `${c.revenuMensuel.toLocaleString("fr-FR")} €`
                    : <span className="text-gray-300">—</span>
                  }
                </td>
                <td className="px-6 py-4 text-center">
                  {c.note > 0 ? (
                    <span className="text-sm font-medium text-yellow-600">
                      {c.note.toFixed(1)} ★
                    </span>
                  ) : (
                    <span className="text-sm text-gray-300">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statutColors[c.statut]
                    }`}
                  >
                    {statutLabels[c.statut]}
                  </span>
                </td>
                {onDelete && (
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => onDelete(c.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          Aucune conciergerie trouvée
        </div>
      )}
    </div>
  );
}
