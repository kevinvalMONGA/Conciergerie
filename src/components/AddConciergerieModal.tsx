"use client";

import { useState } from "react";
import { Conciergerie } from "@/types";

interface AddConciergerieModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (conciergerie: Conciergerie) => void;
}

const emptyForm = {
  nom: "",
  responsable: "",
  email: "",
  telephone: "",
  ville: "",
  biensEnGestion: 0,
  biensOccupes: 0,
  revenuMensuel: 0,
  tauxOccupation: 0,
  note: 0,
  statut: "actif" as const,
};

export function AddConciergerieModal({ open, onClose, onAdd }: AddConciergerieModalProps) {
  const [form, setForm] = useState(emptyForm);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tauxOccupation =
      form.biensEnGestion > 0
        ? Math.round((form.biensOccupes / form.biensEnGestion) * 100)
        : 0;
    onAdd({
      ...form,
      id: crypto.randomUUID(),
      tauxOccupation,
      dateCreation: new Date().toISOString().split("T")[0],
    });
    setForm(emptyForm);
    onClose();
  };

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Ajouter une conciergerie
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la conciergerie *
              </label>
              <input
                required
                type="text"
                value={form.nom}
                onChange={(e) => update("nom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Conciergerie Parisienne"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable *
              </label>
              <input
                required
                type="text"
                value={form.responsable}
                onChange={(e) => update("responsable", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du responsable"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville *
              </label>
              <input
                required
                type="text"
                value={form.ville}
                onChange={(e) => update("ville", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paris"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.fr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => update("telephone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="01 23 45 67 89"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biens en gestion
              </label>
              <input
                type="number"
                min={0}
                value={form.biensEnGestion}
                onChange={(e) => update("biensEnGestion", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biens occupés
              </label>
              <input
                type="number"
                min={0}
                value={form.biensOccupes}
                onChange={(e) => update("biensOccupes", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Revenu mensuel (€)
              </label>
              <input
                type="number"
                min={0}
                value={form.revenuMensuel}
                onChange={(e) => update("revenuMensuel", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note (/5)
              </label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.note}
                onChange={(e) => update("note", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={form.statut}
                onChange={(e) => update("statut", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="actif">Actif</option>
                <option value="en_attente">En attente</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
