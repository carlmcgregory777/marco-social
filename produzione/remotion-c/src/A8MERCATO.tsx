// Attualità di C #8 «La paura è il prodotto» — v2 (08/11/2026), formato SchedeC (come A6 v5).
// La v1 è in attualita/A8-mercato/lavoro/A8MERCATO-v1.tsx.txt.
// Fatti verificati l'08/11/2026 (copione.md): S&P 500 −4,36% giovedì 5/11, chiusura 6/11 a 7.376,86,
// −5,65% dal record del 6/10 (7.818,93); fine 2013 a 1.848,36 (≈ ×4). Grafico = chiusure mensili vere.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A8MERCATO, PAROLE_A8MERCATO } from "./a8mercato-parole";
import { FINE_VOCE, SCHEDE } from "./a8mercato-schede";

const EP: EpisodioC = {
  cartella: "a8mercato",
  numero: 8,
  parole: PAROLE_A8MERCATO,
  chiave: CHIAVE_A8MERCATO,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["La paura", "è il", "*prodotto"], nota: "guarda il grafico di 13 anni" },
};

export const DURATA_A8 = durataEpisodio(EP);
export const A8MERCATO: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA8MERCATO: React.FC = () => <CoverSchedeC cartella="a8mercato" />;
