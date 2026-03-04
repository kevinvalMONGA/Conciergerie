"use client";

import { useRef } from "react";
import * as XLSX from "xlsx";
import { Conciergerie } from "@/types";

interface ExcelImportProps {
  onImport: (data: Conciergerie[]) => void;
}

export function ExcelImport({ onImport }: ExcelImportProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const imported: Conciergerie[] = rows.map((row) => ({
        id: crypto.randomUUID(),
        nom: String(row["nom"] || row["Nom"] || row["name"] || row["Name"] || ""),
        responsable: String(row["responsable"] || row["Responsable"] || row["contact"] || ""),
        email: String(row["email"] || row["Email"] || row["mail"] || ""),
        telephone: String(row["telephone"] || row["Téléphone"] || row["tel"] || row["Tel"] || ""),
        ville: String(row["ville"] || row["Ville"] || row["city"] || ""),
        biensEnGestion: Number(row["biensEnGestion"] || row["Biens"] || row["biens"] || 0),
        biensOccupes: Number(row["biensOccupes"] || row["Occupés"] || row["occupes"] || 0),
        revenuMensuel: Number(row["revenuMensuel"] || row["Revenu"] || row["revenu"] || 0),
        tauxOccupation: 0,
        note: Number(row["note"] || row["Note"] || 0),
        statut: parseStatut(row["statut"] || row["Statut"]),
        dateCreation: String(row["dateCreation"] || new Date().toISOString().split("T")[0]),
      }));

      // Calculer le taux d'occupation
      imported.forEach((c) => {
        c.tauxOccupation =
          c.biensEnGestion > 0
            ? Math.round((c.biensOccupes / c.biensEnGestion) * 100)
            : 0;
      });

      onImport(imported);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Importer Excel
      </button>
    </>
  );
}

function parseStatut(val: unknown): Conciergerie["statut"] {
  const s = String(val || "actif").toLowerCase().trim();
  if (s.includes("inactif")) return "inactif";
  if (s.includes("attente")) return "en_attente";
  return "actif";
}
