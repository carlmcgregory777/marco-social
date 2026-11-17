# A22 «L'euro in più che ti costa un bonus» (17/11/2026) — formato SchedeC, stessa pipeline di A20. Fatti e fonti in FATTI-A22.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Famiglia", "tit", {"sopra": "FAMIGLIA DI 4 PERSONE", "righe": ["ISEE *9.797 €"], "grande": True}),
    ("Un", "tit", {"sopra": "SOPRA LA SOGLIA", "righe": ["*+1 €"], "grande": True}),
    ("perde", "tit", {"sopra": "BONUS LUCE", "righe": ["PERDE", "*186 € L'ANNO"]}),
    ("La", "giornale", {"testata": "ARERA · DELIBERA 2/2026", "titolo": "Soglia ISEE per i bonus sociali: 9.796 euro", "nota": "in vigore dal 1° gennaio 2026"}),
    ("Dentro", "tit", {"sopra": "ISEE SOTTO LA SOGLIA", "righe": ["LUCE, GAS, ACQUA", "*SCONTO AUTOMATICO"]}),
    ("Fuori", "vs", {"a": ["9.796 €", "LO SCONTO C'È"], "b": ["9.797 €", "ZERO"], "parola_b": "zero", "ko_b": True}),
    ("Si", "tit", {"sopra": "SI CHIAMA", "righe": ["EFFETTO", "*SCALINO"], "grande": True}),
    ("L'Assegno", "vs", {"a": ["ASSEGNO UNICO", "A SCIVOLO"], "b": ["BONUS LUCE", "A SCALINO"], "parola_b": "Qui", "ko_b": True}),
    ("ogni", "tit", {"sopra": "OGNI SOGLIA CREA", "righe": ["QUALCUNO", "*UN EURO PIÙ IN LÀ"]}),
    ("Non", "via", {"testo": "COLPA DELLA FAMIGLIA", "nuovo": "LA REGOLA", "parola_b": "regola"}),
    ("Per", "tit", {"sopra": "PER ME", "righe": ["CERTI BONUS", "*A SCIVOLO"]}),
    ("sparire", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a22bonus-schede.ts"), "A22BONUS")
