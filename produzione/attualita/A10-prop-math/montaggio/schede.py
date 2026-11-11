# A10 v1 (08/11/2026): «Lo screenshot lo fa chi vince» — formato SchedeC, schede agganciate alle parole.
# Spunto: reel di Vaga FX https://www.instagram.com/reel/DfaOoEEgLlp/ (moneta, 10.000 trader, survivorship bias).
# Fatto verificato: Finance Magnates (esclusiva su dati FPFX Tech): su ~300.000 conti prop solo il 7% ha avuto
# almeno un pagamento. Il resto è aritmetica (10.000 / 2^5 ≈ 313).
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

MONETA = [["mese 0", 10000], ["mese 1", 5000], ["mese 2", 2500], ["mese 3", 1250], ["mese 4", 625], ["mese 5", 313]]
FONTE = "aritmetica: ogni mese testa o croce"

SCHEDE = [
    ("Diecimila", "tit", {"sopra": "TUTTI CON UN CONTO FINANZIATO", "righe": ["10.000", "*TRADER"], "grande": True}),
    ("nessuno", "tit", {"righe": ["NESSUNO SA", "FARE !NIENTE"]}),
    ("moneta", "vs", {"a": ["TESTA", "pagato"], "b": ["CROCE", "conto perso"], "parola_b": "croce", "ko_b": True}),
    ("adesso", "tit", {"righe": ["COME NASCONO", "CENTINAIA DI", "*CAMPIONI"]}),
    ("Primo", "grafico", {"titolo": "TRADER PAGATI OGNI MESE DI FILA", "punti": MONETA, "fonte": FONTE,
        "segni": [{"parola": "Cinquemila", "i": 1, "testo": "5.000", "col": "giallo", "su": True},
                  {"parola": "Duemilacinquecento", "i": 2, "testo": "2.500", "col": "giallo", "su": True},
                  {"parola": "milleduecentocinquanta", "i": 3, "testo": "1.250", "col": "giallo", "su": True},
                  {"parola": "seicentoventicinque", "i": 4, "testo": "625", "col": "giallo", "su": True}],
        "grosso": {"parola": "quinto", "testo": "313"}}),
    ("Trecento#2", "tit", {"sopra": "PAGATI 5 MESI DI FILA", "righe": ["313", "*PERSONE"], "grande": True}),
    ("Senza", "tit", {"righe": ["ZERO", "!VANTAGGIO"]}),
    ("Fortuna", "timbro", {"testo": "FORTUNA PURA"}),
    ("sono", "tit", {"righe": ["SONO LORO", "NEL TUO *FEED"]}),
    ("Certificati", "lista", {"voci": [["Certificati", "CERTIFICATI DI PAGAMENTO"], ["conti", "CONTI APPROVATI"], ["cifre", "CIFRE CON TANTI ZERI"]]}),
    ("migliori", "tit", {"righe": ["I MIGLIORI", "RISULTATI DI *SEMPRE"]}),
    ("nessuno", "tit", {"righe": ["E NESSUNO", "SA FARE !NIENTE"], "grande": True}),
    ("altri", "tit", {"sopra": "E GLI ALTRI?", "righe": ["!9.687", "CONTI PERSI"], "grande": True}),
    ("nessuno", "tit", {"righe": ["NESSUNO FA LO", "SCREENSHOT DI UN", "!CONTO PERSO"]}),
    ("chiama", "tit", {"sopra": "SI CHIAMA", "righe": ["SURVIVORSHIP", "*BIAS"], "grande": True}),
    ("vedi", "via", {"testo": "BRAVURA", "nuovo": "SOPRAVVISSUTI", "parola_b": "bravura"}),
    ("non", "pieno", {}),
    ("studio", "giornale", {"testata": "FINANCE MAGNATES", "titolo": "Solo il 7% di 300.000 conti prop ha ottenuto un pagamento", "nota": "dati di una società che fornisce la tecnologia a dieci prop firm"}),
    ("sette", "tit", {"sopra": "ALMENO UN PAGAMENTO", "righe": ["SOLO IL", "*7%"], "grande": True}),
    ("Sette", "tit", {"righe": ["7 SU 100", "!93 NIENTE"]}),
    ("parte", "tit", {"righe": ["LA PARTE", "!SCOMODA"]}),
    ("trappola", "tit", {"righe": ["FUNZIONA", "ANCHE SU *DI TE"]}),
    ("quando", "tit", {"righe": ["ANCHE QUANDO", "TI !PAGANO"]}),
    ("fai", "tit", {"sopra": "STASERA", "righe": ["FAI QUESTO", "*CONTO"], "grande": True}),
    ("somma", "vs", {"a": ["PAGAMENTI", "ricevuti"], "b": ["CHALLENGE", "pagate"], "parola_b": "toglile", "ko_b": True}),
    ("numero", "tit", {"sopra": "QUEL NUMERO È LA VERITÀ", "righe": ["SE È NEGATIVO,", "HAI !PERSO"]}),
    ("screenshot", "via", {"testo": "LO SCREENSHOT", "nuovo": "NON TI DICE NIENTE", "parola_b": "no"}),
    ("lavoro", "tit", {"righe": ["IO LAVORO CON", "DEI *SISTEMI"]}),
    ("mille", "tit", {"sopra": "UNA MONETA SI GIUDICA SU", "righe": ["1.000 LANCI,", "!NON 5"], "grande": True}),
    ("Perché", "tit", {"righe": ["UNO SCREENSHOT", "NON TI FA MAI", "*VEDERE"]}),
    ("challenge", "tit", {"righe": ["LE CHALLENGE", "!PAGATE PRIMA"], "grande": True}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a10prop-schede.ts"), "A10PROP")
