# A27 «Il taglio delle tasse che non ti arriva» (22/11/2026) — formato SchedeC come A26/A28. Apertura con la frase vera del servizio Rai. Fatti in FATTI-A27.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Il", "video", {"src": "a27irpef/clip1.mp4", "inizio": 0.0, "vel": 1.1, "tutto": True, "righe": ["TAGLIO TASSE", "*500 € L'ANNO"], "credito": "video: Rai · 1mattina News · 29/10/2026"}),
    ("Cinquecento#2", "tit", {"sopra": "RISPARMIO MASSIMO", "righe": ["*500 €"], "grande": True}),
    ("Ma", "tit", {"sopra": "MA SOLO SE GUADAGNI", "righe": ["ALMENO", "*55.000 €"]}),
    ("Sotto", "tit", {"sopra": "SOTTO I 50.000 €", "righe": ["*0 €"], "grande": True}),
    ("reddito", "tit", {"sopra": "REDDITO MEDIO DICHIARATO", "righe": ["*25.820 €"], "grande": True}),
    ("Tre", "tit", {"sopra": "3 CONTRIBUENTI SU 4", "righe": ["SOTTO", "*35.000 €"]}),
    ("Lo", "tit", {"sopra": "LO SCONTO VALE SOLO", "righe": ["TRA 50.000", "*E 55.000 €"]}),
    ("dieci", "tit", {"sopra": "DAL 43% AL 33%", "righe": ["-10 PUNTI", "*SU 5.000 €"]}),
    ("Si", "tit", {"sopra": "SI CHIAMA", "righe": ["ALIQUOTA", "*MARGINALE"]}),
    ("governo", "tit", {"sopra": "PER IL GOVERNO", "righe": ["*CETO MEDIO"]}),
    ("Per", "tit", {"sopra": "PER ME", "righe": ["IL CETO MEDIO VERO", "*NON VEDE UN EURO"]}),
    ("euro.", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a27irpef-schede.ts"), "A27IRPEF")
