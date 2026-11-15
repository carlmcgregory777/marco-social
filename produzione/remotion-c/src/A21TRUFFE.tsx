// Attualità di C #21 «Io te lo dico. Loro no» (15/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A21TRUFFE, PAROLE_A21TRUFFE } from "./a21truffe-parole";
import { FINE_VOCE, SCHEDE } from "./a21truffe-schede";

const EP: EpisodioC = {
  cartella: "a21truffe",
  numero: 21,
  parole: PAROLE_A21TRUFFE,
  chiave: CHIAVE_A21TRUFFE,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Se non è su Consob", "*è una truffa"], nota: "controlla prima di versare" },
};

export const DURATA_A21TRUFFE = durataEpisodio(EP);
export const A21TRUFFE: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA21TRUFFE: React.FC = () => <CoverSchedeC cartella="a21truffe" />;
