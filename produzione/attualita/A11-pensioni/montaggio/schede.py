# A11 v1 (09/11/2026): «La pensione si rimpicciolisce» — formato SchedeC. Spunto: Mik Cosentino Dffjzvbo_a1.
# Fatti: ../../FATTI-A11-A13.md (INPS 16,4 mln pensionati 2025; ISTAT 24,3 mln occupati set 2026; Eurostat PIL reale
# 2000-2025 Italia +12,4% vs EA20 +35,9%; RGS picco 17,1% nel 2041-43; ISTAT 109.000 italiani cancellati per l'estero 2025).
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Sedici", "tit", {"sopra": "PENSIONATI IN ITALIA", "righe": ["16,4", "*MILIONI"], "grande": True}),
    ("Ventiquattro", "tit", {"sopra": "OCCUPATI", "righe": ["24,3", "MILIONI"], "grande": True}),
    ("divisione", "tit", {"sopra": "LAVORATORI PER PENSIONATO", "righe": ["*1,5"], "grande": True}),
    ("dicono", "via", {"testo": "NON AVRAI LA PENSIONE", "nuovo": "FALSO", "parola_b": "vero"}),
    ("peggio", "tit", {"righe": ["È !PEGGIO"], "grande": True}),
    ("1996", "giornale", {"testata": "LEGGE 335/1995 · RIFORMA DINI", "titolo": "Dal 1996 la pensione si calcola sui contributi versati", "nota": "sistema contributivo"}),
    ("versi", "tit", {"righe": ["SI CALCOLA SU", "QUELLO CHE *VERSI"]}),
    ("cresce", "tit", {"righe": ["E CRESCE CON", "L'*ECONOMIA"]}),
    ("2000", "tit", {"sopra": "PIL REALE 2000 → 2025", "righe": ["ITALIA !+12%", "AREA EURO *+36%"], "grande": True}),
    ("Tre", "tit", {"righe": ["TRE VOLTE", "!TANTO"]}),
    ("sparisce", "via", {"testo": "SPARISCE", "nuovo": "SI RIMPICCIOLISCE", "parola_b": "rimpicciolisce"}),
    ("Piano", "pieno", {}),
    ("Intanto", "tit", {"sopra": "SPESA PENSIONI SUL PIL", "righe": ["OGGI ~15%", "!17% NEL 2041"], "grande": True}),
    ("Ragioneria", "giornale", {"testata": "RAGIONERIA GENERALE DELLO STATO", "titolo": "Spesa pensionistica al 17,1% del PIL tra il 2041 e il 2043", "nota": "previsioni di medio-lungo periodo"}),
    ("centonovemila", "tit", {"sopra": "TRASFERITI ALL'ESTERO NEL 2025", "righe": ["109.000", "*ITALIANI"], "grande": True}),
    ("resta", "tit", {"righe": ["CHI RESTA,", "!PAGA"], "grande": True}),
    ("domanda", "via", {"testo": "AVRÒ LA PENSIONE?", "nuovo": "QUANTO CRESCONO I MIEI SOLDI?", "parola_b": "quanto"}),
    ("decidi", "tit", {"righe": ["L'ITALIA NON", "LA !DECIDI"]}),
    ("risparmi", "tit", {"righe": ["I TUOI RISPARMI", "*SÌ"], "grande": True}),
    ("Lasciarli", "tit", {"righe": ["FERMI SUL CONTO", "È UNA !SCELTA"]}),
    ("scommettere", "tit", {"sopra": "STAI SCOMMETTENDO SUL", "righe": ["!+12%"], "grande": True}),
    ("sedici", "tit", {"righe": ["16,4 MILIONI", "TI DICONO", "QUANTO *VALE"]}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a11pens-schede.ts"), "A11PENS")
