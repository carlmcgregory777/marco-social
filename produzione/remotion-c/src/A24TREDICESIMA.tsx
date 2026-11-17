// Attualità di C #24 «La tredicesima più leggera del previsto» (17/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A24TREDICESIMA, PAROLE_A24TREDICESIMA } from "./a24tredicesima-parole";
import { FINE_VOCE, SCHEDE } from "./a24tredicesima-schede";

const EP: EpisodioC = {
  cartella: "a24tredicesima",
  numero: 24,
  parole: PAROLE_A24TREDICESIMA,
  chiave: CHIAVE_A24TREDICESIMA,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["La tredicesima", "*pesa meno"], nota: "a Natale lo sconto Irpef non c'è" },
};

export const DURATA_A24TREDICESIMA = durataEpisodio(EP);
export const A24TREDICESIMA: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA24TREDICESIMA: React.FC = () => <CoverSchedeC cartella="a24tredicesima" />;
