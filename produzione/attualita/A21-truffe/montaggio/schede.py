# A21 (15/11/2026): «Io te lo dico. Loro no» — formato SchedeC. Fatti e fonti in A21-truffe/FATTI-A21.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Cinque", "video", {"src": "a21truffe/tru1.mp4", "inizio": 0.0, "zoom": 2.6, "fy": 0.0, "tutto": True, "righe": ["TRADING ONLINE", "*SITI OSCURATI"], "credito": "video: Il Sole 24 ORE · 03/04/2025"}),
    ("siti", "giornale", {"testata": "CONSOB · 5 NOVEMBRE 2026", "titolo": "Oscurati altri 17 siti di investimenti abusivi", "nota": "7 servizi di investimento · 10 cripto"}),
    ("2019", "timbro", {"primo": "1.878", "secondo": "260 CRIPTO", "parola_b": "duecentosessanta"}),
    ("agganciano", "lista", {"voci": [["clone", "SITI CLONE"], ["email", "EMAIL FALSE"], ["profili", "PROFILI FINTI DI VIP"], ["video", "VIDEO E VOCI CON L'IA"]]}),
    ("Dati", "video", {"src": "a21truffe/tru2.mp4", "inizio": 0.0, "zoom": 2.6, "fy": 0.0, "tutto": True, "righe": ["POLIZIA POSTALE", "*GEN-AGO 2025"], "credito": "video: Il Sole 24 ORE · 03/04/2025"}),
    ("falso", "tit", {"righe": ["FALSO TRADING", "*MENO DI 1 CASO SU 3"]}),
    ("prende", "timbro", {"primo": "8 € SU 10", "secondo": "116 MILIONI", "parola_b": "centosedici"}),
    ("Ah", "tit", {"sopra": "PICCOLO DETTAGLIO", "righe": ["ANCH'IO SONO", "*FATTO CON L'IA"], "grande": True}),
    ("differenza", "vs", {"a": ["IO", "TE LO DICO"], "b": ["LORO", "NO"], "parola_b": "Loro", "ko_b": True}),
    ("Prima", "video", {"src": "a21truffe/tru3.mp4", "inizio": 0.0, "zoom": 2.6, "fy": 0.0, "vel": 0.75, "tutto": True, "righe": ["CERCA IL NOME", "SU *CONSOB.IT"], "credito": "video: euronews · 10/09/2026"}),
    ("Se", "via", {"testo": "OCCASIONE", "nuovo": "TRUFFA", "parola_b": "truffa"}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a21truffe-schede.ts"), "A21TRUFFE")
