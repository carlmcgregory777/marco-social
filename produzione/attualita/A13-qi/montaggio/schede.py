# A13 v1 (09/11/2026): «Un titolo non è una prova» — formato SchedeC. Spunto: Mik Cosentino DfZMOGkIpsc.
# Fatti: QI 276 (scala SD24) attribuito da World Mind Sports Council / World Memory Championships, contestato (Vice, Korea Herald
# 18/07/2024); Guinness chiude la categoria nel 1990; kalām = al-Ghazali (XI sec.), W. L. Craig; Kakhbod et al. «Finfluencers» (SFI 23-30).
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("L'uomo", "tit", {"sopra": "L'UOMO CON IL QI PIÙ ALTO", "righe": ["«DIO ESISTE,", "LO DIMOSTRO CON", "LA *MATEMATICA»"], "grande": True}),
    ("Milioni", "tit", {"righe": ["MILIONI DI", "*VISUALIZZAZIONI"]}),
    ("convinto", "tit", {"righe": ["COME TI HANNO", "*CONVINTO"]}),
    ("trucco", "tit", {"righe": ["LO STESSO TRUCCO", "DEI CORSI DI !TRADING"]}),
    ("titolo", "tit", {"sopra": "PEZZO 1", "righe": ["IL *TITOLO"], "grande": True}),
    ("duecentosettantasei", "tit", {"sopra": "QI ATTRIBUITO", "righe": ["*276"], "grande": True}),
    ("indipendente", "via", {"testo": "TEST INDIPENDENTE", "nuovo": "CAMPIONATI DI MEMORIA", "parola_b": "memoria"}),
    ("Guinness", "giornale", {"testata": "GUINNESS WORLD RECORDS", "titolo": "Record del QI più alto: categoria chiusa nel 1990", "nota": "a quei livelli i test non sono affidabili"}),
    ("linea", "lista", {"voci": [["linea", "UNA LINEA HA UN PRIMO PUNTO"], ["dall'infinito", "DALL'INFINITO NON ARRIVI"], ["Uno", "1 × 1 = 1"]]}),
    ("semplice", "tit", {"righe": ["OGNI PASSO", "SUONA *SEMPLICE"]}),
    ("smetti", "tit", {"righe": ["SMETTI DI", "!CONTROLLARE"], "grande": True}),
    ("quella", "via", {"testo": "MATEMATICA", "nuovo": "FILOSOFIA", "parola_b": "filosofico"}),
    ("al-Ghazali", "tit", {"sopra": "ARGOMENTO KALĀM", "righe": ["AL-GHAZALI", "*XI SECOLO"]}),
    ("dimostrazione", "vs", {"a": ["DIMOSTRAZIONE", "chiude la discussione"], "b": ["QUESTA", "non l'ha chiusa"], "parola_b": "Questa", "ko_b": True}),
    ("trading", "tit", {"righe": ["NEL *TRADING", "UGUALE"], "grande": True}),
    ("grosso", "lista", {"voci": [["banchiere", "EX BANCHIERE"], ["genio", "GENIO"], ["milionario", "MILIONARIO"]]}),
    ("compri", "tit", {"righe": ["E TU", "!COMPRI"], "grande": True}),
    ("studio", "giornale", {"testata": "SWISS FINANCE INSTITUTE", "titolo": "Finfluencers: più della metà dà consigli che rendono meno del mercato", "nota": "Kakhbod, Kazempour, Livdan, Schürhoff · dati StockTwits"}),
    ("follower", "tit", {"sopra": "CHI HA PIÙ FOLLOWER?", "righe": ["I !PEGGIORI"], "grande": True}),
    ("Quindi", "pieno", {}),
    ("intelligente", "via", {"testo": "QUANTO È INTELLIGENTE?", "nuovo": "DOV'È LA PROVA?", "parola_b": "prova"}),
    ("numeri", "tit", {"righe": ["I NUMERI.", "*VERIFICABILI."], "grande": True}),
    ("Perché", "tit", {"righe": ["UN TITOLO", "NON DIMOSTRA", "!NIENTE"], "grande": True}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a13qi-schede.ts"), "A13QI")
