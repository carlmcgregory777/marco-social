# A14 v1 (10/11/2026): «La clip è vera. La notizia è falsa.» — formato SchedeC. Spunto: Mik Cosentino Dfjft3gI_8S.
# Fatti: incontro 17/04/2026 a Leopoli, stretta di mano di ~10 s tagliata dalla clip (Facta 21/04, Ukrinform 24/04, Lead Stories 24/10,
# IBTimes UK 23/10: Corte svedese «wrong and ugly», post RT del 22/10 con 3,7 mln di visualizzazioni su X).
# Mercati: AP hackerato 23/04/2013, ~136 mld $ di S&P 500 in 3 minuti (Reuters); titolo falso sui dazi 07/04/2025, +2,4 trilioni $ in 10 minuti.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    # apertura: la clip come è girata sui social (stesso titolo), a tutto schermo
    ("Zelensky", "video", {"src": "a14taglio/fonte.mp4", "inizio": 13.2, "tutto": True, "falso": True, "righe": ["Zelensky sputa sul piede", "del Re svedese dopo aver", "rifiutato stretta di mano"], "credito": "video: Suspilne · 17/04/2026"}),
    ("Più", "tit", {"sopra": "SOLO SU X", "righe": ["*3,7 MILIONI", "DI VISUALIZZAZIONI"], "grande": True}),
    ("video", "vs", {"a": ["IL VIDEO", "è vero"], "b": ["LA NOTIZIA", "è falsa"], "parola_b": "notizia", "ko_b": True}),
    ("Leopoli,", "video", {"src": "a14taglio/fonte.mp4", "inizio": 2.0, "etichetta": "LEOPOLI · 17 APRILE 2026", "credito": "video: Suspilne · 17/04/2026"}),
    ("si", "video", {"src": "a14taglio/fonte.mp4", "inizio": 16.6, "etichetta": "IL VIDEO INTERO", "timbro": "10 SECONDI", "parola_b": "dieci", "credito": "video: Suspilne · 17/04/2026"}),
    ("Chi", "video", {"src": "a14taglio/fonte.mp4", "inizio": 15.5, "ferma": 1.7, "etichetta": "LA CLIP VIRALE", "rosso": True, "timbro": "TAGLIATA QUI", "parola_b": "tagliata", "credito": "video: Suspilne · 17/04/2026"}),
    ("dello", "tit", {"sopra": "LO SPUTO?", "righe": ["NESSUNA", "*PROVA"], "grande": True}),
    ("verificato", "giornale", {"testata": "FACTA · LEAD STORIES", "titolo": "«È un contenuto manipolato»: la clip si ferma prima della stretta di mano", "nota": "Corte reale svedese: «sbagliata e brutta»"}),
    ("rilanciarla,", "tit", {"sopra": "RILANCIATA A OTTOBRE DA", "righe": ["TV DI STATO", "!RUSSA"]}),
    ("Ecco", "pieno", {}),
    ("Non", "via", {"testo": "INVENTARE UN VIDEO", "nuovo": "DECIDERE DOVE FINISCE", "parola_b": "Basta"}),
    ("sai", "tit", {"righe": ["FUNZIONA MEGLIO", "SUI TUOI *SOLDI"], "grande": True}),
    ("Aprile", "giornale", {"testata": "23 APRILE 2013", "titolo": "Tweet falso: «Esplosione alla Casa Bianca»", "nota": "account dell'Associated Press violato"}),
    ("tre", "tit", {"sopra": "IN 3 MINUTI · S&P 500", "righe": ["!−136 MILIARDI", "DI DOLLARI"], "grande": True}),
    ("Aprile", "giornale", {"testata": "7 APRILE 2025", "titolo": "Titolo falso: «Pausa di 90 giorni sui dazi»", "nota": "smentito dalla Casa Bianca"}),
    ("dieci", "tit", {"sopra": "IN 10 MINUTI", "righe": ["*+2.400 MILIARDI"], "grande": True}),
    ("Poi", "tit", {"sopra": "POI LA SMENTITA", "righe": ["E DI NUOVO", "!GIÙ"], "grande": True}),
    ("chi", "tit", {"righe": ["CHI TI VENDE", "UN CORSO FA LO", "STESSO *TAGLIO"]}),
    ("mostra", "lista", {"voci": [["mese", "IL MESE BUONO"], ["screenshot", "LO SCREENSHOT DEL PRELIEVO"], ["grafico", "IL GRAFICO DAL PUNTO GIUSTO"]]}),
    ("Tutto", "vs", {"a": ["TUTTO", "vero"], "b": ["TUTTO", "tagliato"], "parola_b": "tutto", "ko_b": True}),
    ("Quindi", "pieno", {}),
    ("non", "via", {"testo": "È VERO?", "nuovo": "DOVE L'HANNO TAGLIATO?", "parola_b": "Chiediti"}),
    ("Perché", "tit", {"righe": ["UNA CLIP VERA", "PUÒ RACCONTARE", "UNA !BUGIA"]}),
    ("Basta", "video", {"src": "a14taglio/fonte.mp4", "inizio": 15.9, "ferma": 1.3, "etichetta": "LA CLIP VIRALE", "rosso": True, "timbro": "STOP", "parola_b": "prima", "credito": "video: Suspilne · 17/04/2026"}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a14taglio-schede.ts"), "A14TAGLIO")
