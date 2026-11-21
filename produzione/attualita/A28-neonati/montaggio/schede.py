# A28 «1.800 € a tuo figlio» (22/11/2026) — formato SchedeC come A26. Apertura con la frase vera del servizio Rai. Fatti in FATTI-A28.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Per", "video", {"src": "a28neonati/clip1.mp4", "inizio": 0.0, "vel": 1.1, "tutto": True, "righe": ["NEONATI", "*100 € L'ANNO"], "credito": "video: Rai · 1mattina News · 29/10/2026"}),
    ("Cento#2", "tit", {"sopra": "PER 18 ANNI", "righe": ["*1.800 €"], "grande": True}),
    ("Ma", "tit", {"sopra": "SOLO CHI NASCE", "righe": ["DAL *2027"], "grande": True}),
    ("Se", "vs", {"a": ["NATO IL", "1° GENNAIO 2027"], "b": ["NATO IL", "31 DICEMBRE 2026"], "parola_b": "trentuno", "ko_b": True}),
    ("zero.", "tit", {"sopra": "UN GIORNO PRIMA", "righe": ["*0 €"], "grande": True}),
    ("manovra", "tit", {"sopra": "SE LA MANOVRA PASSA", "righe": ["LO APRE L'INPS", "*SENZA ISEE"]}),
    ("I", "tit", {"sopra": "FINO A 18 ANNI", "righe": ["*BLOCCATI"], "grande": True}),
    ("nonni", "tit", {"sopra": "I NONNI", "righe": ["POSSONO", "*AGGIUNGERE"]}),
    ("Ed", "tit", {"sopra": "QUI LAVORA", "righe": ["L'INTERESSE", "*COMPOSTO"]}),
    ("tre", "tit", {"sopra": "AL 3% L'ANNO", "righe": ["*2.341 €"], "grande": True}),
    ("Con", "tit", {"sopra": "+10 € AL MESE DEI NONNI", "righe": ["*5.151 €"], "grande": True}),
    ("Per", "tit", {"sopra": "PER ME", "righe": ["UN BUON", "*INIZIO"]}),
    ("Ma", "tit", {"sopra": "PER UN GIORNO", "righe": ["CHI È GIÀ NATO", "*RESTA FUORI"]}),
    ("fuori.", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a28neonati-schede.ts"), "A28NEONATI")
