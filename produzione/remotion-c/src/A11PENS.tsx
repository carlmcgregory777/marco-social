// Attualità di C #11 «La pensione si rimpicciolisce» — v1 (09/11/2026). Spunto: reel Mik Cosentino Dffjzvbo_a1. Fatti: INPS, ISTAT, Eurostat, RGS (FATTI-A11-A13.md).
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A11PENS, PAROLE_A11PENS } from "./a11pens-parole";
import { FINE_VOCE, SCHEDE } from "./a11pens-schede";

const EP: EpisodioC = {
  cartella: "a11pens",
  numero: 11,
  parole: PAROLE_A11PENS,
  chiave: CHIAVE_A11PENS,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["La tua pensione", "cresce", "con l'*Italia"], nota: "e l'Italia sta ferma" },
};

export const DURATA_A11PENS = durataEpisodio(EP);
export const A11PENS: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA11PENS: React.FC = () => <CoverSchedeC cartella="a11pens" />;
