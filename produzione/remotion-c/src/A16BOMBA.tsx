// Attualità di C #16 «Svegliato quando?» (11/11/2026). Spunto: reel the_jashi_project DfmkMfGqaAg. Fatti: Ministero/ANSA, Sky TG24, QN, TIKR/Yahoo Finance.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A16BOMBA, PAROLE_A16BOMBA } from "./a16bomba-parole";
import { FINE_VOCE, SCHEDE } from "./a16bomba-schede";

const EP: EpisodioC = {
  cartella: "a16bomba",
  numero: 16,
  parole: PAROLE_A16BOMBA,
  chiave: CHIAVE_A16BOMBA,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Svegliato", "*quando?"], nota: "-17% in 5 giorni" },
};

export const DURATA_A16BOMBA = durataEpisodio(EP);
export const A16BOMBA: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA16BOMBA: React.FC = () => <CoverSchedeC cartella="a16bomba" />;
