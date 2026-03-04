"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { ConciergerieTable } from "@/components/ConciergerieTable";
import { AddConciergerieModal } from "@/components/AddConciergerieModal";
import { ExcelImport } from "@/components/ExcelImport";
import { LoadScrapedData, convertScrapedData } from "@/components/LoadScrapedData";
import { Conciergerie } from "@/types";

const STORAGE_KEY = "conciergeries-data";

export default function DashboardPage() {
  const [data, setData] = useState<Conciergerie[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData(convertScrapedData());
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, loaded]);

  const handleAdd = (c: Conciergerie) => {
    setData((prev) => [...prev, c]);
  };

  const handleImport = (imported: Conciergerie[]) => {
    setData((prev) => [...prev, ...imported]);
  };

  const handleLoadScraped = (scraped: Conciergerie[]) => {
    setData(scraped);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((c) => c.id !== id));
  };

  const totalBiens = data.reduce((sum, c) => sum + c.biensEnGestion, 0);
  const totalOccupes = data.reduce((sum, c) => sum + c.biensOccupes, 0);
  const totalRevenu = data.reduce((sum, c) => sum + c.revenuMensuel, 0);
  const actifs = data.filter((c) => c.statut === "actif");
  const tauxMoyen =
    actifs.length > 0
      ? Math.round(actifs.reduce((sum, c) => sum + c.tauxOccupation, 0) / actifs.length)
      : 0;

  if (!loaded) return null;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conciergerie</h1>
              <p className="text-sm text-gray-500 mt-1">
                Tableau de bord — {data.length} conciergeries
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <LoadScrapedData onLoad={handleLoadScraped} />
              <ExcelImport onImport={handleImport} />
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </button>
              {actifs.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {actifs.length} actives
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Conciergeries"
            value={data.length}
            subtitle={`${actifs.length} actives`}
          />
          <StatCard
            label="Biens en gestion"
            value={totalBiens}
            subtitle={`${totalOccupes} occupés`}
            color="text-blue-600"
          />
          <StatCard
            label="Taux d'occupation moyen"
            value={`${tauxMoyen}%`}
            subtitle="Conciergeries actives"
            color="text-emerald-600"
          />
          <StatCard
            label="Revenu mensuel total"
            value={`${totalRevenu.toLocaleString("fr-FR")} €`}
            subtitle="Toutes conciergeries"
            color="text-purple-600"
          />
        </div>

        {data.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune conciergerie</h3>
            <p className="mt-2 text-sm text-gray-500">
              Ajoutez votre première conciergerie ou importez un fichier Excel.
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <LoadScrapedData onLoad={handleLoadScraped} />
              <ExcelImport onImport={handleImport} />
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Ajouter manuellement
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Liste des conciergeries
            </h2>
            <ConciergerieTable data={data} onDelete={handleDelete} />
          </div>
        )}
      </main>

      <AddConciergerieModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
