# A8 v2 (08/11/2026): schede del formato SchedeC agganciate alle parole di voce.wav.
# Dati del grafico: chiusure mensili S&P 500 da Yahoo Finance (^GSPC), spx-mensile.json,
# 2013-01 → 2026-11-06 (7.376,86). Fatti in copione.md.
import json, os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SPX = json.load(open(os.path.join(QUI, "spx-mensile.json")))
ULT = len(SPX) - 1
i_mese = lambda m: next(k for k, p in enumerate(SPX) if p[0].startswith(m))
FONTE = "S&P 500 · CHIUSURE MENSILI · YAHOO FINANCE"

SCHEDE = [
    ("Il", "tit", {"righe": ["IL MERCATO", "È !CROLLATO"]}),
    ("Giovedì", "tit", {"sopra": "GIOVEDÌ 5 NOVEMBRE · S&P 500", "righe": ["!−4,4%", "IN UN GIORNO"], "grande": True}),
    ("Hai", "tit", {"righe": ["HAI PERSO SOLDI.", "SEI !PREOCCUPATO"]}),
    ("qualcuno", "tit", {"sopra": "STANOTTE", "righe": ["QUALCUNO CI HA", "FATTO I *SOLDI"]}),
    ("complotto", "via", {"testo": "UN COMPLOTTO", "nuovo": "UN MESTIERE", "parola_b": "mestiere"}),
    ("Guarda", "grafico", {"titolo": "S&P 500 · DAL 2013 A OGGI", "punti": SPX, "fonte": FONTE,
        "segni": [{"parola": "2013", "i": 0, "testo": "2013", "col": "giallo", "su": True},
                  {"parola": "oggi", "i": ULT, "testo": "OGGI", "col": "giallo", "su": True}][::-1],
        "grosso": {"parola": "quattro", "testo": "×4"}}),
    ("record", "tit", {"sopra": "DAL RECORD DEL 6 OTTOBRE", "righe": ["SOLO", "*−5,6%"], "grande": True}),
    ("Un", "tit", {"righe": ["UN RECORD DI", "*UN MESE FA"]}),
    ("l'ansia", "tit", {"righe": ["E TU IN ANSIA", "PER UNA SETTIMANA", "!STORTA"]}),
    ("domanda", "tit", {"righe": ["LA DOMANDA", "*VERA"]}),
    ("chi", "tit", {"sopra": "A FARTI GUARDARE IL GRAFICO OGNI GIORNO", "righe": ["CHI HA", "*INTERESSE?"]}),
    ("giornaliero", "via", {"testo": "IL GRAFICO DI OGGI", "nuovo": "ZERO", "parola_b": "Zero"}),
    ("paura", "tit", {"righe": ["TI FA !PAURA.", "E LA PAURA *VENDE"]}),
    ("abbonamenti", "lista", {"voci": [["abbonamenti", "ABBONAMENTI"], ["corsi", "CORSI"], ["segnali", "SEGNALI"], ["consulenze", "CONSULENZE"]]}),
    ("prodotto", "tit", {"righe": ["LA PAURA È", "IL *PRODOTTO"]}),
    ("sa", "tit", {"righe": ["SA CHE TU LA", "*COMPRERAI"]}),
    ("rosso", "tit", {"righe": ["TI MOSTRANO", "IL !ROSSO"]}),
    ("apri", "tit", {"righe": ["E TU APRI IL", "*PORTAFOGLIO"]}),
    ("investire", "via", {"testo": "PER INVESTIRE", "nuovo": "PER CALMARTI", "parola_b": "comprare"}),
    ("Ecco", "pieno", {}),
    ("comprato", "tit", {"righe": ["COMPRATO", "NEL *2013"], "grande": True}),
    ("zero", "tit", {"righe": ["ZERO", "*OPERAZIONI"]}),
    ("guadagno", "grafico", {"titolo": "COMPRATO NEL 2013 · MAI VENDUTO", "punti": SPX, "fonte": FONTE, "subito": True,
        "segni": [{"parola": "2020", "i": i_mese("2020-03"), "testo": "2020", "col": "rosso"},
                  {"parola": "2022", "i": i_mese("2022-09"), "testo": "2022", "col": "rosso"},
                  {"parola": "giovedì", "i": ULT, "testo": "GIOVEDÌ", "col": "rosso", "su": True}]}),
    ("bravo", "via", {"testo": "SEI BRAVO", "nuovo": "NON HAI VENDUTO", "parola_b": "venduto"}),
    ("chiama", "tit", {"righe": ["TI CHIAMA PER", "IL !CROLLO"]}),
    ("2013", "tit", {"righe": ["E NEL 2013", "*DOV'ERI?"]}),
    ("spaventa", "vs", {"a": ["OGGI", "ti spaventa"], "b": ["13 ANNI FA", "silenzio"], "parola_b": "tredici"}),
    ("proteggendo", "via", {"testo": "TI PROTEGGE", "nuovo": "TI VENDE", "parola_b": "vendendo"}),
    ("grafico", "tit", {"righe": ["IL GRAFICO", "DI *IERI"]}),
    ("Mai", "tit", {"righe": ["MAI QUELLO", "DI !13 ANNI"]}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a8mercato-schede.ts"), "A8MERCATO")
