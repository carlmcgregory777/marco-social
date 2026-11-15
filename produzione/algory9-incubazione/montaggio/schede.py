# Dentro Algory #9 (15/11/2026): «Prima il 25%, poi tutto» — formato SchedeC, tutto a schermo intero con le
# schermate di Algory dal reel di Vaga (DfuxnIMAR1n), ritagliate da montaggio/clip.py. Fatti in FATTI-AL9.md.
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "script"))
from schede_lib import genera

CR = "immagini: Algory"
# zoom 1: le clip sono verticali (VideoTutto di default ingrandisce 1,92 pensando a filmati 16:9)
def v(src, righe, vel=1.0, fy=0.5):
    return {"src": f"al9incub/{src}.mp4", "inizio": 0.0, "vel": vel, "tutto": True, "righe": righe, "credito": CR, "zoom": 1, "fy": fy}

SCHEDE = [
    ("Per", "pieno", {}),  # gancio: C col dito alzato (set/C-cover.png, Higgsfield gpt_image_2_6)
    ("A", "video", v("tester", ["A MANO,", "CANDELA PER *CANDELA"], 0.75)),
    ("Poi", "video", v("ventaglio", ["TESTATE A", "*MIGLIAIA"], 0.7)),
    ("quasi", "video", v("fades", ["QUASI TUTTE", "*NON REGGONO"], 0.75)),
    ("anche", "video", v("bagliore", ["E QUELLA", "*BUONA?"])),
    ("di", "video", v("nuvola", ["DOPO 1-2 ANNI", "*SI SPEGNE"], 0.8)),
    ("Quindi", "video", v("multi", ["NON PUNTO SU", "*UNA SOLA"])),
    ("Sul", "video", v("nuvola40", ["CONTO DA 100.000 $", "*19 BOT"], 0.95)),
    ("E", "video", v("gener", ["RISCHIO PIENO?", "*NON SUBITO"], 0.7)),
    ("Ogni", "video", v("quarto", ["BOT NUOVO:", "*25% DEL RISCHIO"], 1.0, 0.4)),
    ("Una", "video", v("radar10", ["~10 TRADE VERI", "CHE *PASSANO"], 0.9)),
    ("Sale", "video", v("verdi", ["SALE AL", "*50%"])),
    ("Una", "video", v("passaporto", ["~30 TRADE:", "RISCHIO *PIENO"])),
    ("E", "video", v("ruota", ["SI SPEGNE?", "*FUORI"])),
    ("Ne", "video", v("radarv", ["NE ENTRA", "*UNO NUOVO"])),
    ("Il", "video", v("vault", ["IL SOFTWARE:", "*ALGORY"])),
    ("Link", "video", v("radar", ["LINK IN BIO", "CODICE *STANGA20"], 0.75)),
    ("e", "video", v("pulsanti", ["SI PARTE", "*GRATIS"])),
    ("Non", "video", v("tabella", ["NON È UN CONSIGLIO", "FINANZIARIO"], 0.8)),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "remotion-c", "src", "al9incub-schede.ts"), "AL9INCUB")
