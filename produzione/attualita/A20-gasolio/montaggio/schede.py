# A20 (15/11/2026): «Il petrolio scende. Per chi?» — formato SchedeC. Fatti e fonti in A20-gasolio/FATTI-A20.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Fine", "video", {"src": "a20gas/gas2.mp4", "inizio": 0.0, "vel": 0.85, "tutto": True, "righe": ["BRENT A FINE OTTOBRE", "*117 $"], "credito": "video: RaiNews · 07/10/2026"}),
    ("Oggi", "tit", {"sopra": "OGGI", "righe": ["CIRCA *90 $"], "grande": True}),
    ("gasolio", "vs", {"a": ["PETROLIO", "QUASI −25%"], "b": ["GASOLIO", "POCHI CENTESIMI"], "parola_b": "pochi", "ko_b": True}),
    ("attenzione", "tit", {"sopra": "E DENTRO C'È GIÀ", "righe": ["LO SCONTO", "*SULLE ACCISE"]}),
    ("governo", "giornale", {"testata": "DECRETO DEL 9 NOVEMBRE 2026", "titolo": "Accisa sul gasolio giù di 4 centesimi dal 10 al 23 novembre", "nota": "4,88 centesimi con l'Iva · solo gasolio"}),
    ("decreto", "via", {"testo": "PREZZO GIÙ PER LEGGE", "nuovo": "NESSUN OBBLIGO", "parola_b": "obbliga"}),
    ("differenza", "tit", {"righe": ["DOVE FINISCE", "*LA DIFFERENZA?"], "grande": True}),
    ("Segue", "tit", {"sopra": "SEGUE IL", "righe": ["MARGINE DI", "*RAFFINAZIONE"]}),
    ("ottobre", "vs", {"a": ["OTTOBRE", "CIRCA 90 $"], "b": ["DI SOLITO", "20-40 $"], "parola_b": "solito"}),
    ("Risultato", "tit", {"sopra": "AL SELF, OGGI", "righe": ["DIESEL *+20 CENT", "SULLA BENZINA"], "grande": True}),
    ("Quindi", "tit", {"sopra": "IL PETROLIO SCENDE", "righe": ["SCENDE", "*PER CHI?"], "grande": True}),
    ("chiediti", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a20gas-schede.ts"), "A20GAS")
