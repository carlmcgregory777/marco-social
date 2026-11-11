// Attualità di C #15 «Arrabbiati con il numero giusto» — v1 (10/11/2026). Spunto: reel Mik Cosentino DfjdE5tIMGs. Fatti: Istat, CGIA, ANSA, Soldionline.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A15BOLLETTE, PAROLE_A15BOLLETTE } from "./a15bollette-parole";
import { FINE_VOCE, SCHEDE } from "./a15bollette-schede";

const EP: EpisodioC = {
  cartella: "a15bollette",
  numero: 15,
  parole: PAROLE_A15BOLLETTE,
  chiave: CHIAVE_A15BOLLETTE,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Arrabbiati", "col numero", "*giusto"], nota: "inflazione +5,4%" },
};

export const DURATA_A15BOLLETTE = durataEpisodio(EP);
export const A15BOLLETTE: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA15BOLLETTE: React.FC = () => <CoverSchedeC cartella="a15bollette" />;
