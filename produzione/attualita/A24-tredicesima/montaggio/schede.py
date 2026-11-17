# A24 «La tredicesima più leggera del previsto» (17/11/2026) — formato SchedeC, stessa pipeline di A20. Fatti e fonti in FATTI-A24.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Impiegata", "tit", {"sopra": "IMPIEGATA", "righe": ["2.000 € LORDI", "*AL MESE"]}),
    ("Una", "tit", {"sopra": "BUSTA NORMALE", "righe": ["CIRCA", "*1.590 € NETTI"]}),
    ("La", "tit", {"sopra": "TREDICESIMA", "righe": ["CIRCA", "*1.400 €"], "grande": True}),
    ("Quasi", "tit", {"sopra": "PER UNA MENSILITÀ UGUALE", "righe": ["QUASI", "*200 € IN MENO"]}),
    ("Il", "tit", {"sopra": "IL MOTIVO", "righe": ["DETRAZIONE", "*DA LAVORO", "DIPENDENTE"]}),
    ("uno", "lista", {"voci": [["uno", "SCONTO SULL'IRPEF"], ["ogni", "OGNI MESE"], ["dodici", "SU 12 BUSTE"]]}),
    ("Sulla", "vs", {"a": ["12 BUSTE", "CON SCONTO"], "b": ["TREDICESIMA", "ZERO SCONTO"], "parola_b": "tredicesima", "ko_b": True}),
    ("L'Irpef", "tit", {"sopra": "L'IRPEF", "righe": ["LA PAGHI", "*TUTTA"], "grande": True}),
    ("svista", "tit", {"righe": ["NON È UNA SVISTA", "*È LA REGOLA"]}),
    ("fine", "tit", {"sopra": "A FINE ANNO", "righe": ["C'È IL", "*CONGUAGLIO"]}),
    ("Natale", "tit", {"sopra": "A NATALE", "righe": ["SPESE TUTTE", "*INSIEME"]}),
    ("arriva", "tit", {"sopra": "TI ARRIVA", "righe": ["MENO DI QUELLO", "*CHE ASPETTAVI"]}),
    ("Per", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a24tredicesima-schede.ts"), "A24TREDICESIMA")
