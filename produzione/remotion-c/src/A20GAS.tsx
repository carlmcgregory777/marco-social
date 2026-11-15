// Attualità di C #20 «Il petrolio scende. Per chi?» (15/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A20GAS, PAROLE_A20GAS } from "./a20gas-parole";
import { FINE_VOCE, SCHEDE } from "./a20gas-schede";

const EP: EpisodioC = {
  cartella: "a20gas",
  numero: 20,
  parole: PAROLE_A20GAS,
  chiave: CHIAVE_A20GAS,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Il petrolio scende.", "*Per chi?"], nota: "il gasolio segue la raffinazione" },
};

export const DURATA_A20GAS = durataEpisodio(EP);
export const A20GAS: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA20GAS: React.FC = () => <CoverSchedeC cartella="a20gas" />;
