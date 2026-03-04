export interface Conciergerie {
  id: string;
  nom: string;
  responsable: string;
  email: string;
  telephone: string;
  ville: string;
  biensEnGestion: number;
  biensOccupes: number;
  revenuMensuel: number;
  tauxOccupation: number;
  note: number;
  statut: "actif" | "inactif" | "en_attente";
  dateCreation: string;
  siteWeb?: string;
  services?: string[];
  categorie?: string;
  description?: string;
  linkedin?: string;
}
