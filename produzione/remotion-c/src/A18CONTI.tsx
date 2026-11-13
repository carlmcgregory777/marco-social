// Attualità di C #18 «Il conto che non torna» (13/11/2026). Spunto: reel di Alessandro Colli Dfra5ThAedA. Fatti: INPS, DL 48/2023, L. 199/2025 (A18-nuovo/FATTI-A18.md).
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A18CONTI, PAROLE_A18CONTI } from "./a18conti-parole";
import { FINE_VOCE, SCHEDE } from "./a18conti-schede";

const EP: EpisodioC = {
  cartella: "a18conti",
  numero: 18,
  parole: PAROLE_A18CONTI,
  chiave: CHIAVE_A18CONTI,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Lavorare in regola", "*conviene ancora?"], nota: "il conto che non torna" },
};

export const DURATA_A18CONTI = durataEpisodio(EP);
export const A18CONTI: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA18CONTI: React.FC = () => <CoverSchedeC cartella="a18conti" />;
