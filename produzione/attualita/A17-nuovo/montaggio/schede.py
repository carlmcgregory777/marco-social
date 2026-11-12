# A17 (12/11/2026): «Quanto paghi per non sapere» — formato SchedeC. Spunto: Mik Cosentino DfonBfKo__H (manuale Laterza «Trame del tempo 3»).
# Filmati: Tg1 «Riapre la scuola, sempre più cara» (youtu.be/aGoF5bvGHZA, 02/09/2026).
# Fatti: pag. 666 di «Trame del tempo 3» (Laterza): il governo Meloni «si distingue nell'attuazione di misure chiaramente liberticide»
# (ANSA 10/11/2026; Il Giornale 09/11 scrive «dichiaratamente», per questo nel copione c'è la versione ANSA); interrogazione di FdI
# (ANSA 10/11); Valditara: «credo che sia nell'interesse stesso dell'editore... ritirare» e «non vi è alcuna valutazione governativa sul
# rigore scientifico dei libri adottati» (ANSA 10/11); Alessandro Laterza: un ministro non può chiederlo, «a prescindere da questo o quel
# libro» (ANSA 10/11); caso già nato nel giugno 2025 (Il Giornale). Spesa: libri + 4 dizionari prima superiore 805,15 € (Federconsumatori,
# a.s. 2026/27); libri nuovi 800 milioni (Antitrust, cartello Tg1 02/09/2026). Scartati: «i prof scelgono da una lista di manuali
# identici», «costerebbe meno di un convegno» (di Mik, non verificati) e tutte le parolacce.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

CR_T = "video: Tg1 · 02/09/2026"

SCHEDE = [
    # apertura: il filmato vero a tutto schermo
    ("Pagina", "video", {"src": "a17libro/libro.mp4", "inizio": 0.0, "tutto": True, "zoom": 2.6, "fy": 0.0, "righe": ["PAGINA 666", "*DI STORIA"], "credito": CR_T}),
    ("C'è", "video", {"src": "a17libro/lista.mp4", "inizio": 0.0, "tutto": True, "zoom": 2.6, "fy": 0.0, "righe": ["«MISURE", "!LIBERTICIDE»"], "credito": CR_T}),
    ("Fratelli", "giornale", {"testata": "ANSA · 10/11/2026", "titolo": "Il caso del testo di storia, Valditara: «Va ritirato». Laterza: «Un ministro non può chiederlo»", "nota": "«Trame del tempo 3», Laterza"}),
    ("Laterza", "tit", {"sopra": "LATERZA", "righe": ["«UN MINISTRO NON", "PUÒ *CHIEDERLO»"]}),
    ("tutti", "tit", {"righe": ["«!CENSURA!»", "«!PROPAGANDA!»"], "grande": True}),
    ("frase", "tit", {"sopra": "LA FRASE PIÙ GRAVE", "righe": ["L'HA DETTA", "*IL MINISTRO"]}),
    ("nessuna", "giornale", {"testata": "VALDITARA · ANSA, 10/11/2026", "titolo": "«Non vi è alcuna valutazione governativa sul rigore scientifico dei libri adottati»", "nota": "il controllo spetta a editori e docenti"}),
    ("chi", "tit", {"sopra": "CHI CONTROLLA", "righe": ["COSA STUDIA", "*TUO FIGLIO?"]}),
    ("Nessuno.", "tit", {"righe": ["!NESSUNO.", "E PAGHI *TU."], "grande": True}),
    ("Ottocentocinque", "video", {"src": "a17libro/pila.mp4", "inizio": 0.0, "etichetta": "805 € · SOLO I LIBRI DELLA PRIMA SUPERIORE", "credito": CR_T}),
    ("tutta", "video", {"src": "a17libro/bancarella.mp4", "inizio": 0.0, "etichetta": "800 MILIONI DI LIBRI NUOVI (ANTITRUST)", "credito": CR_T}),
    ("Destra", "vs", {"a": ["LORO", "litigano su 1 pagina"], "b": ["TU", "paghi le altre 665"], "parola_b": "altre", "ko_b": True}),
    ("domanda", "tit", {"sopra": "LA DOMANDA NON È", "righe": ["CHI HA *RAGIONE"]}),
    ("quanto", "tit", {"righe": ["QUANTO !PAGHI", "PER NON *SAPERE?"], "grande": True}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a17libro-schede.ts"), "A17LIBRO")
