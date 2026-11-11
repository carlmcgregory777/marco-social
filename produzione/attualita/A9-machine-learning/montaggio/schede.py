# A9 v2 (08/11/2026): schede del formato SchedeC agganciate alle parole di voce.wav.
# Fatto verificato: SEC, 18/03/2024, prime azioni per «AI washing» contro due consulenti
# d'investimento (Delphia e Global Predictions), 400.000 $ di multe in tutto (sec.gov 2024-36).
import os, sys
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "..", "..", "script"))
from schede_lib import genera

SCHEDE = [
    ("Machine", "lista", {"voci": [["Machine", "MACHINE LEARNING"], ["Intelligenza", "INTELLIGENZA ARTIFICIALE"], ["Algoritmo", "ALGORITMO PREDITTIVO"]]}),
    ("Tre", "tit", {"sopra": "TRE PAROLE", "righe": ["ATTACCATE SU", "*TUTTO"]}),
    ("farlo", "tit", {"righe": ["PER FARLO", "COSTARE !DI PIÙ"]}),
    ("2024", "giornale", {"testata": "SEC · 18 MARZO 2024", "titolo": "Due società di investimento multate per «AI washing»", "nota": "l'autorità della Borsa americana"}),
    ("multato", "tit", {"sopra": "400.000 $ DI MULTE", "righe": ["DUE SOCIETÀ", "!MULTATE"]}),
    ("dicevano", "tit", {"righe": ["«USIAMO", "L'*IA»"]}),
    ("Non", "tit", {"righe": ["NON ERA", "!VERO"], "grande": True}),
    ("smettiamo", "via", {"testo": "LE PAROLE", "nuovo": "LA SCATOLA", "parola_b": "scatola"}),
    ("Perché", "tit", {"righe": ["UNA SOLA", "*DOMANDA"]}),
    ("sistema", "vs", {"a": ["SISTEMA VERO", ""], "b": ["ETICHETTA", ""], "parola_b": "un'etichetta", "diverso": True}),
    ("Quel", "tit", {"sopra": "PROVATO SU DATI", "righe": ["MAI", "*VISTI?"], "grande": True}),
    ("Sì", "vs", {"a": ["SÌ", ""], "b": ["NO", ""], "parola_b": "no"}),
    ("comprato", "tit", {"righe": ["HAI COMPRATO", "UN !BACKTEST"]}),
    ("foto", "vs", {"a": ["FOTO", "del passato"], "b": ["PROMESSA", "del futuro"], "parola_b": "promessa", "ko_b": True}),
    ("qui", "pieno", {}),
    ("perfetto", "vs", {"a": ["PASSATO", "perfetto"], "b": ["FUTURO", "inutile"], "parola_b": "inutile", "ko_b": True}),
    ("Si", "tit", {"righe": ["SI CHIAMA", "*OVERFITTING"]}),
    ("memoria", "tit", {"righe": ["IMPARA A", "*MEMORIA"]}),
    ("studente", "vs", {"a": ["IERI", "10 e lode"], "b": ["DOMANI", "bocciato"], "parola_b": "domani", "ko_b": True}),
    ("poi", "tit", {"righe": ["NON È NELLA", "!PUBBLICITÀ"]}),
    ("l'alpha", "tit", {"righe": ["ALPHA", "*DECAY"], "grande": True}),
    ("vantaggio", "via", {"testo": "UN VANTAGGIO", "nuovo": "DI TUTTI", "parola_b": "tutti"}),
    ("usano", "tit", {"righe": ["USATO DA MILLE", "SI !CONSUMA"]}),
    ("vendono", "tit", {"righe": ["LO VENDONO", "A *TUTTI"]}),
    ("dimmi", "tit", {"righe": ["CHE VANTAGGIO", "!È?"]}),
    ("prossima", "tit", {"righe": ["«IL MIO SISTEMA", "USA L'*IA»"]}),
    ("chiedergli", "via", {"testo": "COME FUNZIONA?", "nuovo": "NON SERVE", "parola_b": "serve"}),
    ("guardalo", "tit", {"righe": ["GUARDALO", "NEGLI *OCCHI"]}),
    ("quali", "tit", {"righe": ["SU QUALI", "*DATI?"], "grande": True}),
    ("aveva", "tit", {"righe": ["LI AVEVA", "GIÀ !VISTI?"]}),
    ("l'etichetta", "vs", {"a": ["ETICHETTA", "la mette chiunque"], "b": ["PROVA", "solo chi l'ha fatta"], "parola_b": "prova", "ko_a": True}),
]

if __name__ == "__main__":
    genera(os.path.join(QUI, "parole-allineate.json"), SCHEDE,
           os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a9machine-schede.ts"), "A9MACHINE")
