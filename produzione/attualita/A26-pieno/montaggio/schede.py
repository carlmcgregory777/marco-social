# A26 «Il pieno da 50 €: quanti vanno allo Stato?» (17/11/2026) — formato SchedeC, stessa pipeline di A20. Fatti e fonti in FATTI-A26.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Pieno", "tit", {"sopra": "PIENO DI BENZINA", "righe": ["*50 €"], "grande": True}),
    ("venticinque", "tit", {"sopra": "A 1,96 € AL LITRO", "righe": ["*25,5 LITRI"], "grande": True}),
    ("Più", "tit", {"sopra": "ALLO STATO", "righe": ["PIÙ DI", "*26 €"], "grande": True}),
    ("L'accisa", "tit", {"sopra": "ACCISA", "righe": ["*0,67 € AL LITRO"]}),
    ("diciassette", "tit", {"sopra": "NEL TUO PIENO", "righe": ["ACCISA", "*17 €"], "grande": True}),
    ("L'IVA", "tit", {"sopra": "IVA 22%", "righe": ["ALTRI", "*9 €"], "grande": True}),
    ("Ma", "vs", {"a": ["IVA SUL", "CARBURANTE"], "b": ["IVA", "SULL'ACCISA"], "parola_b": "anche", "ko_b": True}),
    ("tassa", "tit", {"sopra": "TASSA SULLA TASSA", "righe": ["QUASI", "*4 € A PIENO"], "grande": True}),
    ("Il", "tit", {"sopra": "FINO AL 23 NOVEMBRE", "righe": ["GASOLIO", "*-4 CENT"]}),
    ("Sulla", "tit", {"sopra": "SULLA BENZINA", "righe": ["*NIENTE"], "grande": True}),
    ("Più", "tit", {"sopra": "ALLA POMPA", "righe": ["PIÙ DELLA METÀ", "*NON È CARBURANTE"]}),
    ("Per", "tit", {"sopra": "PER ME", "righe": ["LA TASSA SULLA TASSA", "*SI POTEVA TOGLIERE"]}),
    ("togliere", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a26pieno-schede.ts"), "A26PIENO")
