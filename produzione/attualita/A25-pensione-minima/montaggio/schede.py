# A25 «20 anni di contributi contro zero» (17/11/2026) — formato SchedeC, stessa pipeline di A20. Fatti e fonti in FATTI-A25.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Vent'anni", "tit", {"sopra": "20 ANNI DI CONTRIBUTI", "righe": ["PENSIONE", "*AL MINIMO"]}),
    ("seicentoundici", "tit", {"sopra": "AL MESE", "righe": ["*611,85 €"], "grande": True}),
    ("Zero", "tit", {"sopra": "ZERO CONTRIBUTI · ASSEGNO SOCIALE", "righe": ["*546,24 €", "AL MESE"], "grande": True}),
    ("Sessantasei", "tit", {"sopra": "LA DIFFERENZA", "righe": ["*66 €", "AL MESE"], "grande": True}),
    ("Sono", "tit", {"sopra": "PER VENT'ANNI DI LAVORO", "righe": ["MENO DI", "*900 € L'ANNO"]}),
    ("Si", "tit", {"sopra": "SI CHIAMA", "righe": ["INTEGRAZIONE", "*AL MINIMO"]}),
    ("Stato", "giornale", {"testata": "INPS · CIRCOLARE 153 · 19/12/2025", "titolo": "Trattamento minimo 2026: 611,85 euro al mese", "nota": "13 mensilità · 7.954,05 € l'anno"}),
    ("Ma", "vs", {"a": ["MINIMO", "611,85 €"], "b": ["SOCIALE", "546,24 €"], "parola_b": "quasi"}),
    ("Attenzione", "tit", {"sopra": "L'ASSEGNO SOCIALE", "righe": ["SERVE A CHI", "*NON HA NIENTE"]}),
    ("Il", "via", {"testo": "COLPA DI CHI LO PRENDE", "nuovo": "DEL SISTEMA", "parola_b": "sistema"}),
    ("vent'anni", "tit", {"sopra": "20 ANNI DI CONTRIBUTI", "righe": ["VALGONO", "*66 €"], "grande": True}),
    ("Per", "tit", {"sopra": "PER ME", "righe": ["CHI HA VERSATO", "*UNA DIFFERENZA VERA"]}),
    ("vedere", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a25pensione-schede.ts"), "A25PENSIONE")
