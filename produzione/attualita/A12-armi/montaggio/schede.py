# A12 v1 (09/11/2026): «Col senno di poi» — formato SchedeC. Spunto: Amedeo Iasci Dfe8sZmqPe0.
# Prezzi Yahoo Finance, chiusure 24/02/2022 → 06/11/2026, dividendi esclusi: Rheinmetall 100,05→812,70 €; Leonardo 6,68→48,07 €;
# Lockheed 395,71→567,08 $; L3Harris 228,47→259,89 $; Zoom max 559 → 89,88; Peloton max 162,72 → 5,61; Rheinmetall -19% 04-06/11.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Diecimila", "tit", {"sopra": "24 FEBBRAIO 2022", "righe": ["10.000 €", "*RHEINMETALL"], "grande": True}),
    ("Oggi", "tit", {"sopra": "OGGI", "righe": ["*81.000 €"], "grande": True}),
    ("Leonardo", "tit", {"sopra": "LEONARDO", "righe": ["*72.000 €"], "grande": True}),
    ("bastava", "tit", {"righe": ["«BASTAVA", "PENSARCI»"]}),
    ("casa", "tit", {"righe": ["UNA *CASA", "SENZA LAVORARE"]}),
    ("nessuno", "tit", {"righe": ["NESSUNO TI DICE", "*TRE COSE"], "grande": True}),
    ("Lockheed", "tit", {"sopra": "1 · STESSA GUERRA: LOCKHEED", "righe": ["10.000 $", "→ *14.000"], "grande": True}),
    ("L3Harris", "tit", {"sopra": "L3HARRIS", "righe": ["10.000 $", "→ *11.000"], "grande": True}),
    ("Risultati", "lista", {"voci": [["Risultati", "RHEINMETALL ×8,1"], ["completamente", "LEONARDO ×7,2"], ["diversi", "LOCKHEED ×1,4 · L3HARRIS ×1,1"]]}),
    ("Secondo", "tit", {"sopra": "2 · NEL 2020", "righe": ["ERA *OVVIO"]}),
    ("Zoom", "tit", {"sopra": "DAL MASSIMO", "righe": ["ZOOM !-84%", "PELOTON !-97%"], "grande": True}),
    ("Erano", "timbro", {"testo": "OVVIE. PRIMA."}),
    ("Terzo", "tit", {"sopra": "3 · QUESTA SETTIMANA", "righe": ["RHEINMETALL", "!-19% IN 2 GIORNI"], "grande": True}),
    ("tardi", "tit", {"righe": ["CHI È ENTRATO", "!TARDI"]}),
    ("senno", "tit", {"sopra": "SI CHIAMA", "righe": ["SENNO", "DI *POI"], "grande": True}),
    ("backtest", "tit", {"righe": ["IL BACKTEST", "PIÙ *FACILE", "DEL MONDO"]}),
    ("scegli", "via", {"testo": "ERA OVVIO", "nuovo": "L'HAI SCELTO DOPO", "parola_b": "finta"}),
    ("quale", "lista", {"voci": [["quale", "QUALE DELLE QUATTRO?"], ["uscire", "QUANDO USCIRE?"], ["tenuto", "TENERE QUASI 5 ANNI?"]]}),
    ("Quindi", "pieno", {}),
    ("quanti", "tit", {"righe": ["QUANTI ALTRI", "ERANO *OVVI?"]}),
    ("Perché", "tit", {"righe": ["COL SENNO DI POI", "LI COMPRAVAMO", "*TUTTI"], "grande": True}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a12armi-schede.ts"), "A12ARMI")
