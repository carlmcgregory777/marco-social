# A18 (13/11/2026): «Il conto che non torna» — formato SchedeC. Spunto: reel di Alessandro Colli Dfra5ThAedA (13/11/2026).
# Fatti e fonti in A18-nuovo/FATTI-A18.md:
# - ADI, nucleo 2 genitori + 3 figli (uno sotto i 3 anni), reddito zero, in affitto: soglia 6.500 € × scala 1,80 = 11.700 € + affitto
#   fino a 3.640 € = 15.340 €/anno ≈ 1.278 €/mese (tetto massimo, non media). Detto «circa milleduecento».
# - Assegno Unico 3 figli con ISEE minimo: ≈ 713 € certi dall'INPS (≈ 812 con la maggiorazione da confermare): detto «oltre settecento».
# - Franchigia ADI sui redditi da nuovo lavoro: 3.000 € lordi l'anno (DL 48/2023, scheda INPS); oltre, l'assegno scende.
# - Straordinari feriali: IRPEF ordinaria; solo notturni/festivi al 15% (L. 199/2025): detto «straordinari normali».
# - «Aliquota marginale»: definizione, nessuna cifra di studio citata (quelle UPB/OCSE per questa famiglia non trovate).
# Scartati dallo spunto: le parolacce, «più non fai niente più lo Stato ti premia» (attacco alle persone), il totale «29.000 €»
# (somma di massimi, il nido è un rimborso), lo scenario del lavoro nero a 1.200 € (ipotesi, non dato).
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Due", "tit", {"righe": ["2 GENITORI · 3 FIGLI", "*REDDITO ZERO"]}),
    ("l'Assegno", "giornale", {"testata": "INPS · Assegno di inclusione 2026", "titolo": "Fino a 6.500 € l'anno per la scala di equivalenza, più fino a 3.640 € per l'affitto", "nota": "importo massimo, con reddito zero"}),
    ("milleduecento", "tit", {"righe": ["CIRCA *1.200 €", "AL MESE"], "grande": True}),
    ("Più", "tit", {"sopra": "+ ASSEGNO UNICO", "righe": ["OLTRE *700 €", "AL MESE"]}),
    ("Poi", "tit", {"sopra": "POI UNO DEI DUE", "righe": ["TROVA *LAVORO"]}),
    ("tremila", "timbro", {"primo": "3.000 €", "secondo": "POI SCENDE", "parola_b": "scendere"}),
    ("conti", "lista", {"voci": [["Stipendio", "+ STIPENDIO"], ["perde", "− SUSSIDIO PERSO"], ["benzina", "− BENZINA"]]}),
    ("resta", "tit", {"righe": ["E SE RESTA", "!POCO?"], "grande": True}),
    ("finanza", "tit", {"sopra": "IN FINANZA SI CHIAMA", "righe": ["ALIQUOTA", "*MARGINALE"]}),
    ("Se", "vs", {"a": ["GUADAGNI", "+1 €"], "b": ["PERDI", "−1 € di sussidio"], "parola_b": "perdi", "ko_b": True}),
    ("tassa", "tit", {"righe": ["UNA TASSA", "VICINA AL *100%"], "grande": True}),
    ("chi", "tit", {"sopra": "CHI LAVORA GIÀ", "righe": ["STRAORDINARI", "CON *IRPEF PIENA"]}),
    ("problema", "tit", {"sopra": "IL PROBLEMA NON È", "righe": ["CHI FA *DUE CONTI"]}),
    ("sistema", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a18conti-schede.ts"), "A18CONTI")
