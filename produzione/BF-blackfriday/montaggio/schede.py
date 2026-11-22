# BF1 «3 giorni gratis» (22/11/2026) — sponsorizzata Black Friday Higgsfield, copia del reel DgDfpJusokh con C. Formato SchedeC.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Tre", "tit", {"sopra": "HIGGSFIELD DENTRO CLAUDE", "righe": ["3 GIORNI", "*GRATIS"], "grande": True}),
    ("Ecco", "tit", {"sopra": "IN QUEI 3 GIORNI", "righe": ["*4 COSE", "DA FARE"], "grande": True}),
    ("Numero", "tit", {"sopra": "01", "righe": ["FATTI", "IL *SITO"], "grande": True}),
    ("Scegli", "tit", {"sopra": "SCEGLI", "righe": ["*5 SITI", "CHE TI PIACCIONO"]}),
    ("Claude#1", "tit", {"sopra": "CLAUDE LO RIFÀ", "righe": ["CON QUELLO", "*STILE"]}),
    ("Sui", "video", {"src": "bf1black/sito.mp4", "inizio": 0.0, "etichetta": "IL MIO · FATTO CON CLAUDE"}),
    ("Numero", "tit", {"sopra": "02", "righe": ["IL TUO *REEL", "LO MONTA CLAUDE"]}),
    ("Taglia", "video", {"src": "bf1black/shorts.mp4", "inizio": 4.0, "etichetta": "SHORTS STUDIO", "fy": 0.3}),
    ("Ti", "tit", {"sopra": "TI BASTA SCRIVERE", "righe": ["*/SHORTS-STUDIO"]}),
    ("Numero", "tit", {"sopra": "03", "righe": ["SCENA", "DA *FILM"], "grande": True}),
    ("con", "video", {"src": "bf1black/sd1.mp4", "inizio": 0.0, "etichetta": "4K · SEEDANCE 2.5"}),
    ("E", "tit", {"sopra": "04", "righe": ["SPOT", "STILE *GTA"], "grande": True}),
    ("spot", "video", {"src": "bf1black/gta.mp4", "inizio": 0.0, "etichetta": "STILE GTA", "fy": 0.45}),
    ("Questi", "tit", {"sopra": "I COMANDI CHE HO USATO", "righe": ["*/SHORTS-STUDIO", "SEEDANCE 2.5"]}),
    ("Per", "video", {"src": "bf1black/conn.mp4", "inizio": 0.0, "zoom": 1.5, "fx": 0.45, "fy": 0.25, "etichetta": "CONNETTORE"}),
    ("Se", "tit", {"sopra": "SE SEI NUOVO", "righe": ["3 GIORNI", "*GRATIS"], "grande": True}),
    ("E", "tit", {"sopra": "L'OFFERTA", "righe": ["*BLACK FRIDAY"]}),
    ("commenta", "tit", {"sopra": "COMMENTA", "righe": ["*BLACK FRIDAY"]}),
    ("mando.", "pieno", {}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "remotion-c", "src", "bf1black-schede.ts"), "BF1BLACK")
