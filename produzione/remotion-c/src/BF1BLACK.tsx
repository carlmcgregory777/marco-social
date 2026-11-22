// BF1 «3 giorni gratis» (22/11/2026): sponsorizzata Black Friday Higgsfield, C nel set studio, labiale Pruna P-Video 1080p.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_BF1BLACK, PAROLE_BF1BLACK } from "./bf1black-parole";
import { FINE_VOCE, SCHEDE } from "./bf1black-schede";

const EP: EpisodioC = {
  cartella: "bf1black",
  numero: 1,
  parole: PAROLE_BF1BLACK,
  chiave: CHIAVE_BF1BLACK,
  schede: SCHEDE,
  fine: FINE_VOCE,
  etichetta: "HIGGSFIELD · BLACK FRIDAY",
  finale: { righe: ["Commenta", "*BLACK FRIDAY"], nota: "ti mando il link in DM", avviso: "#ad · link affiliato Higgsfield" },
};

export const DURATA_BF1BLACK = durataEpisodio(EP);
export const BF1BLACK: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverBF1BLACK: React.FC = () => <CoverSchedeC cartella="bf1black" />;
