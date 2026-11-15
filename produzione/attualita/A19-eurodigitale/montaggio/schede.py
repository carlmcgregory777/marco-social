# A19 (15/11/2026): «Chi guarda già i tuoi pagamenti» — formato SchedeC. Fatti e fonti in A19-eurodigitale/FATTI-A19.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Mercoledì", "video", {"src": "a19euro/euro3.mp4", "inizio": 0.0, "tutto": True, "righe": ["BRUXELLES", "*18 NOVEMBRE"], "credito": "video: euronews · 24/04/2024"}),
    ("sull'euro", "tit", {"sopra": "SI TORNA A TRATTARE", "righe": ["EURO", "*DIGITALE"], "grande": True}),
    ("panico", "video", {"src": "a19euro/euro2.mp4", "inizio": 0.0, "vel": 0.9, "tutto": True, "righe": ["«TI SPENGONO", "*I SOLDI»"], "credito": "video: Banca d'Italia · 19/05/2025"}),
    ("fatti", "via", {"testo": "È GIÀ LEGGE", "nuovo": "NON ANCORA", "parola_b": "legge"}),
    ("luglio", "giornale", {"testata": "PARLAMENTO EUROPEO · 9 LUGLIO 2026", "titolo": "Sì al mandato per trattare sull'euro digitale: 416 voti a favore", "nota": "non è la legge: è il via ai negoziati"}),
    ("tetto", "tit", {"sopra": "TETTO IN DISCUSSIONE", "righe": ["FINO A *3.000 €", "A TESTA"], "grande": True}),
    ("oltre", "tit", {"sopra": "OLTRE IL TETTO", "righe": ["SUL TUO", "*CONTO IN BANCA"]}),
    ("nero", "giornale", {"testata": "BCE · DOMANDE FREQUENTI", "titolo": "L'euro digitale non sarà mai moneta programmabile", "nota": "e il contante resta"}),
    ("Ma", "tit", {"sopra": "LA PARTE CHE", "righe": ["NESSUNO", "*TI DICE"], "grande": True}),
    ("due", "timbro", {"primo": "2 SU 3", "secondo": "NON EUROPEI", "parola_b": "circuiti"}),
    ("Ogni", "lista", {"voci": [["dove", "DOVE COMPRI"], ["quanto", "QUANTO SPENDI"]]}),
    ("Solo", "tit", {"sopra": "SOLO CHE NON STA", "righe": ["A *FRANCOFORTE"], "grande": True}),
    ("domanda", "tit", {"sopra": "LA DOMANDA NON È SE", "righe": ["MA *CHI", "TI GUARDA GIÀ"], "grande": True}),
    ("chi", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a19euro-schede.ts"), "A19EURO")
