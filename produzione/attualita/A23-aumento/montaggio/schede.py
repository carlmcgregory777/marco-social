# A23 «100 € di aumento: quanti ne vedi?» (17/11/2026) — formato SchedeC, stessa pipeline di A20. Fatti e fonti in FATTI-A23.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Operaio", "tit", {"sopra": "AL MESE", "righe": ["OPERAIO", "*1.800 € NETTI"]}),
    ("cento", "tit", {"sopra": "IL CAPO GLI DÀ", "righe": ["*+100 € LORDI"], "grande": True}),
    ("Quanti", "vs", {"a": ["LORDI", "100 €"], "b": ["IN BUSTA", "CIRCA 56 €"], "parola_b": "cinquantasei"}),
    ("perde", "lista", {"voci": [["perde", "−44 € PERSI"], ["nove", "9 € CONTRIBUTI"], ["Irpef", "IRPEF"], ["addizionali", "ADDIZIONALI"]]}),
    ("siccome", "vs", {"a": ["REDDITO", "SALE"], "b": ["DETRAZIONI", "SCENDONO"], "parola_b": "detrazioni", "ko_b": True}),
    ("Si", "tit", {"sopra": "SI CHIAMA", "righe": ["ALIQUOTA", "MARGINALE", "*EFFETTIVA"]}),
    ("quanto", "tit", {"sopra": "QUANTO TI TOGLIE IL FISCO", "righe": ["DELL'EURO IN PIÙ", "*DETRAZIONI COMPRESE"]}),
    ("Qui", "tit", {"sopra": "ALIQUOTA MARGINALE EFFETTIVA", "righe": ["OLTRE IL", "*40%"], "grande": True}),
    ("Quest'anno", "vs", {"a": ["2° SCAGLIONE", "ERA 35%"], "b": ["2° SCAGLIONE", "ORA 33%"], "parola_b": "al"}),
    ("Per", "tit", {"sopra": "PER LUI", "righe": ["MENO DI", "*9 € L'ANNO"], "grande": True}),
    ("Un", "vs", {"a": ["AUMENTO", "100 €"], "b": ["IN BUSTA", "100 €"], "parola_b": "non", "diverso": True}),
    ("Per", "tit", {"sopra": "PER ME", "righe": ["UN SISTEMA CHE", "*FRENA"]}),
    ("guadagnare", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a23aumento-schede.ts"), "A23AUMENTO")
