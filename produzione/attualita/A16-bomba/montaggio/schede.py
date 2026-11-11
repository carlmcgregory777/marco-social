# A16 (11/11/2026): «Svegliato quando?» — formato SchedeC. Spunto: the_jashi_project DfmkMfGqaAg (allarmi bomba → «l'opportunità è la cybersecurity»).
# Filmati: Il Messaggero (Genzano, youtu.be/jRWlkIsU-9E) e Riviera24 (Sanremo, youtu.be/6AxoYUcA928), 11/11/2026.
# Fatti: mail a circa 6mila scuole (Ministero via ANSA 11/11); firma «Mikhail Andropov», stessa delle minacce agli aerei (Il Messaggero,
# Policy Maker: la firma NON prova che l'autore sia lo stesso, per questo nel copione si dice «lo stesso nome»); evacuazioni a Genova, Potenza,
# Sanremo (Sky TG24, Adnkronos); «nessun pericolo concreto» (fonti di governo / Valditara); frigoriferi dei supermercati hackerati nella notte
# 1-2/11 in più paesi europei, fino a 50 gradi (Sky TG24 04/11, Open 02/11, Il Giornale); CrowdStrike +114% e Palo Alto +99% da inizio anno
# al 30/10 (Yahoo Finance); -17% entrambe nella settimana chiusa il 05/11 (TIKR / Yahoo Finance). Il calo NON è causato dagli attacchi
# (vendite sul software dopo le elezioni di metà mandato): il copione li accosta nel tempo, non dice che uno causa l'altro.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

CR_M = "video: Il Messaggero · Genzano, 11/11/2026"
CR_R = "video: Riviera24 · Sanremo, 11/11/2026"

SCHEDE = [
    # apertura: il filmato vero a tutto schermo
    ("Una", "video", {"src": "a16bomba/vigili.mp4", "inizio": 0.1, "tutto": True, "righe": ["UNA MAIL.", "*6.000 SCUOLE"], "credito": CR_R}),
    ("C'è", "video", {"src": "a16bomba/studenti.mp4", "inizio": 0.2, "tutto": True, "righe": ["«C'È UNA", "!BOMBA»"], "credito": CR_M}),
    ("stesso", "giornale", {"testata": "IL MESSAGGERO · 11/11/2026", "titolo": "Allarmi bomba nelle scuole, chi è Mikhail Andropov (lo stesso delle minacce aeree)", "nota": "la firma non prova che l'autore sia lo stesso"}),
    ("Evacuazioni", "video", {"src": "a16bomba/carabinieri.mp4", "inizio": 0.2, "etichetta": "EVACUAZIONI DA GENOVA A POTENZA", "credito": CR_R}),
    ("governo", "tit", {"sopra": "IL GOVERNO", "righe": ["«NESSUN PERICOLO", "*CONCRETO»"]}),
    ("frigoriferi", "giornale", {"testata": "SKY TG24", "titolo": "Attacco hacker ai supermercati: frigoriferi fino a 50 gradi", "nota": "notte tra l'1 e il 2 novembre 2026"}),
    ("Fino", "tit", {"righe": ["FINO A", "!50 GRADI"], "grande": True}),
    ("Tonnellate", "tit", {"righe": ["TONNELLATE DI CIBO", "!BUTTATE"]}),
    ("social", "tit", {"sopra": "E SUI SOCIAL", "righe": ["«È L'*OPPORTUNITÀ»"], "grande": True}),
    ("Chi", "tit", {"righe": ["«CHI SI SVEGLIA", "FA I *SOLDI»"]}),
    ("Peccato", "tit", {"righe": ["SI SONO SVEGLIATI", "TUTTI !PRIMA DI TE"]}),
    ("CrowdStrike", "tit", {"sopra": "DA INIZIO ANNO · AL 30 OTTOBRE", "righe": ["CROWDSTRIKE *+114%", "PALO ALTO *+99%"]}),
    ("Poi", "vs", {"a": ["DA INIZIO ANNO", "quasi raddoppiate"], "b": ["LA SETTIMANA DEGLI ATTACCHI", "-17% in 5 giorni"], "parola_b": "meno", "ko_b": True}),
    ("Gli", "tit", {"righe": ["GLI HACKER", "*ATTACCAVANO"], "grande": True}),
    ("azioni", "tit", {"righe": ["CHI TI DIFENDE", "!SCENDEVA"], "grande": True}),
    ("Perché", "pieno", {}),
    ("prezzata", "tit", {"sopra": "LA NOTIZIA DI OGGI", "righe": ["È NEL PREZZO", "*DI IERI"], "grande": True}),
    ("Instagram", "tit", {"righe": ["SE È SU INSTAGRAM", "NON È PIÙ !UN'OCCASIONE"]}),
    ("l'uscita", "tit", {"sopra": "È L'USCITA", "righe": ["PER CHI ERA", "*ENTRATO PRIMA"]}),
    ("Quindi", "pieno", {}),
    ("Svegliato", "tit", {"righe": ["SVEGLIATO", "!QUANDO?"], "grande": True}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a16bomba-schede.ts"), "A16BOMBA")
