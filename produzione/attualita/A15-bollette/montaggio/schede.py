# A15 v1 (10/11/2026): «Arrabbiati con il numero giusto» — formato SchedeC. Spunto: Mik Cosentino DfjdE5tIMGs (corteo di Torino 07/11/2026).
# Filmati: video ANSA ripreso da Tag24 (youtu.be/YNWpwFhIsZA, 08/11/2026). Il primo montaggio usava alanews (filigrana in mezzo): scartato da Marco.
# Dal reel di Mik NON sono stati ripresi i punti non verificati (annuncio in arabo, Appendino, 4.000/3.000, barricate del 7/11).
# Fatti: corteo p.za Castello → p.za Crispi, bollette bruciate in c.so San Maurizio, cori «Meloni dimettiti» (ANSA, Quotidiano Piemontese, Il Fatto);
# Istat 30/10/2026 provvisorio: NIC +5,4% (set. +4,2%), energetici +31,4%; CGIA 30/10: sciopero generale fino a ~1 mld €;
# spread 116 pb (apertura 02/11, QuiFinanza) → 107,4 pb (chiusura 06/11, Soldionline); governo Meloni più longevo della Repubblica (Pagella Politica).
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    # apertura: il filmato vero a tutto schermo
    ("Sabato", "video", {"src": "a15bollette/fuoco.mp4", "inizio": 0.1, "tutto": True, "righe": ["TORINO, SABATO", "BRUCIANO LE !BOLLETTE"], "credito": "video: ANSA · 07/11/2026"}),
    ("Migliaia", "video", {"src": "a15bollette/folla.mp4", "inizio": 0.3, "tutto": True, "righe": ["*MIGLIAIA", "IN CORTEO"], "credito": "video: ANSA · 07/11/2026"}),
    ("gridare:", "video", {"src": "a15bollette/striscione.mp4", "inizio": 0.3, "tutto": True, "righe": ["«MELONI", "!DIMETTITI»"], "credito": "video: ANSA · 07/11/2026"}),
    ("social", "vs", {"a": ["TIFOSERIA", "uno"], "b": ["TIFOSERIA", "due"], "parola_b": "due"}),
    ("Io", "tit", {"righe": ["IO TI DO", "I *NUMERI"], "grande": True}),
    ("Perché", "tit", {"righe": ["TI FREGANO", "!TUTTI E DUE"], "grande": True}),
    ("Primo", "tit", {"sopra": "NUMERO 1 · INFLAZIONE DI OTTOBRE", "righe": ["!+5,4%"], "grande": True}),
    ("settembre", "via", {"testo": "SETTEMBRE: +4,2%", "nuovo": "OTTOBRE: +5,4%", "parola_b": "due"}),
    ("Energia:", "tit", {"sopra": "ENERGIA · IN UN ANNO", "righe": ["!+31%"], "grande": True}),
    ("Lo", "tit", {"sopra": "ISTAT · 30/10/2026 · DATI PROVVISORI", "righe": ["LO DICE L'ISTAT", "NON UN *MEGAFONO"]}),
    ("Secondo", "tit", {"sopra": "NUMERO 2", "righe": ["SCIOPERO GENERALE", "*30 OTTOBRE"]}),
    ("Secondo", "giornale", {"testata": "CGIA DI MESTRE", "titolo": "Una giornata di sciopero generale può costare fino a 1 miliardo di euro", "nota": "stima del 30/10/2026"}),
    ("tua", "vs", {"a": ["COSTO", "fino a 1 miliardo"], "b": ["LA TUA BOLLETTA", "uguale a prima"], "parola_b": "Uguale", "ko_b": True}),
    ("Terzo", "tit", {"sopra": "NUMERO 3", "righe": ["QUELLO CHE NON", "TI DICE *NESSUNO"]}),
    ("Mentre", "video", {"src": "a15bollette/piazza.mp4", "inizio": 0.3, "etichetta": "PIAZZE PIENE · SPREAD GIÙ", "credito": "video: ANSA · 07/11/2026"}),
    ("Da", "via", {"testo": "2 NOV: 116 PUNTI", "nuovo": "6 NOV: 107 PUNTI", "parola_b": "centosette"}),
    ("mercati", "tit", {"sopra": "I MERCATI", "righe": ["LA PIAZZA", "NON LA *TEMONO"], "grande": True}),
    ("E#1", "pieno", {}),
    ("governa", "tit", {"sopra": "CHI GOVERNA", "righe": ["«IL PIÙ LONGEVO»", "CON I PREZZI AL !5%"]}),
    ("sfila", "tit", {"sopra": "CHI SFILA", "righe": ["«BASTA FARLO", "!CADERE»"]}),
    ("Ma", "video", {"src": "a15bollette/pila.mp4", "inizio": 0.5, "etichetta": "UN CORTEO NON ABBASSA UNA BOLLETTA", "rosso": True, "credito": "video: ANSA · 07/11/2026"}),
    ("governo", "tit", {"sopra": "E SE IL GOVERNO CADE?", "righe": ["IL POTERE", "D'ACQUISTO", "!NON TORNA"]}),
    ("Fai", "tit", {"righe": ["FAI TU", "IL *CONTO"], "grande": True}),
    ("Diecimila", "via", {"testo": "OGGI: 10.000 €", "nuovo": "TRA UN ANNO: ~9.500 €", "parola_b": "comprano"}),
    ("Senza", "tit", {"righe": ["E NESSUNO TI HA", "TOCCATO *NIENTE"]}),
    ("Quella", "tit", {"sopra": "LA VERA MANIFESTAZIONE", "righe": ["*SILENZIOSA.", "OGNI GIORNO."], "grande": True}),
    ("Sul", "tit", {"righe": ["SUL TUO", "!CONTO"], "grande": True}),
    ("Quindi", "pieno", {}),
    ("Ma", "tit", {"righe": ["ARRABBIATI.", "MA CON IL", "*NUMERO GIUSTO"]}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a15bollette-schede.ts"), "A15BOLLETTE")
