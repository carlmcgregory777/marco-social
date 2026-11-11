# A6 v5: le schede del blocco C, agganciate alle PAROLE della voce (parole-c.json),
# non a tempi scritti a mano: se la voce cambia, si rilancia e i tempi seguono.
# Scrive remotion-c/src/a6oracle-schede.ts
#
# Ogni scheda: (parola d'aggancio, tipo, dati). La parola si cerca DOPO quella della
# scheda precedente, quindi le ripetizioni («sette miliardi» due volte) non si confondono.
# Tipi (disegnati in A6ORACLE.tsx):
#   tit   righe grandi Anton; "*" davanti a una parola = riquadro viola; "!" = riquadro rosso
#   tre   tre numeri che entrano uno alla volta (agganci propri)
#   vs    due riquadri, il secondo entra sulla sua parola
#   via   testo che viene barrato, poi (opzionale) il sostituto sulla sua parola
#   giornale  titolo di giornale su carta bianca + fonte
#   barra51   la barra di Nvidia che si riempie fino al 51%
#   timbro    timbro che sbatte (FIRMATO -> CANCELLATO)
#   pieno     nessuna scheda: C a tutto schermo (cambio di inquadratura)
import json, os, re

QUI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a6oracle-schede.ts")
P = json.load(open(os.path.join(QUI, "parole-c.json"), encoding="utf-8"))
norm = lambda s: re.sub(r"[^\wàèéìòù']", "", s.lower())

SCHEDE = [
    ("contratto", "tit", {"righe": ["IL CONTRATTO", "PIÙ *GRANDE"], "sopra": "DELLA STORIA DI ORACLE"}),
    ("Tutti", "tit", {"righe": ["ORACLE HA", "*VINTO L'IA"], "sopra": "DICEVANO TUTTI"}),
    ("qualcuno", "tit", {"righe": ["QUALCUNO", "LO !SAPEVA"]}),
    ("Fermati", "tit", {"righe": ["FERMATI."], "grande": True}),
    ("Centomila", "tre", {"voci": [["Centomila", "100.000", "CHIP NVIDIA"], ["miliardi", "7 MLD $", "IL CONTRATTO"], ["cinque", "5 ANNI", "LA DURATA"]]}),
    ("contenti", "tit", {"righe": ["TUTTI", "A *COMPRARE"]}),
    ("quei", "tit", {"righe": ["QUEI CHIP", "NON !PASSAVANO"]}),
    ("Washington", "vs", {"a": ["WASHINGTON", "niente chip avanzati in mano cinese"], "b": ["PECHINO", "compra i chip di casa"], "parola_b": "Pechino"}),
    ("pressione", "tit", {"righe": ["PRESSIONE", "DA *TUTTI E DUE"]}),
    ("firmato", "timbro", {"primo": "FIRMATO", "secondo": "CANCELLATO", "parola_b": "cancellato"}),
    ("caso", "tit", {"righe": ["NON È UN", "CASO !ISOLATO"]}),
    ("Nvidia", "barra51", {"titolo": "NVIDIA · DATA CENTER", "parola_pieno": "cinquantuno", "parola_fine": "cinesi", "fonte": "FINANCIAL TIMES · 3 NOVEMBRE"}),
    ("Detto#2", "tit", {"righe": ["DETTO", "*A VOCE"], "sopra": "DAI VENDITORI"}),
    ("iscritto", "tit", {"righe": ["NON PER", "!ISCRITTO"]}),
    ("regola", "via", {"testo": "UNA REGOLA", "nuovo": "UNA PAURA", "parola_b": "paura"}),
    ("bilanci", "vs", {"a": ["BILANCI", "la paura non c'è"], "b": ["PREZZI", "la paura c'è"], "parola_b": "prezzi", "ko_a": True}),
    ("domanda", "tit", {"righe": ["UNA SOLA", "*DOMANDA"]}),
    ("raccontato", "tit", {"righe": ["CHI VE L'HA", "RACCONTATO"], "sopra": "«ORACLE HA VINTO L'IA»"}),
    ("sapeva", "tit", {"righe": ["LO SAPEVA", "!O NO?"]}),
    ("giornali", "giornale", {"testata": "I TITOLI", "titolo": "Oracle firma 7 miliardi con Tencent", "nota": "i giornali l'hanno scritto"}),
    ("confine", "tit", {"righe": ["IL CONFINE", "C'ERA *PRIMA"]}),
    ("numeri", "vs", {"a": ["I NUMERI", "7 miliardi"], "b": ["LE REGOLE", "0 incassabili"], "parola_b": "regole", "ko_b": True}),
    ("passo", "pieno", {}),
    ("bot", "vs", {"a": ["IL DATO", "c'è"], "b": ["L'ESECUZIONE", "no"], "parola_b": "eseguire", "ko_b": True}),
    ("segnale", "vs", {"a": ["SEGNALE", "c'è"], "b": ["PREZZO", "no"], "parola_b": "prezzo", "ko_b": True}),
    ("arriva", "tit", {"righe": ["CHI ARRIVA", "*PRIMO", "VINCE"]}),
    ("ragione", "via", {"testo": "CHI HA RAGIONE", "nuovo": "CHI ARRIVA PRIMO", "parola_b": "primo"}),
    ("adesso", "pieno", {}),
    ("gennaio", "giornale", {"testata": "GENNAIO 2026", "titolo": "Michael Burry scommette contro Oracle", "nota": "lo ha scritto lui, pubblicamente"}),
    ("Pubblicamente", "tit", {"righe": ["ERA LÌ", "*DA LEGGERE"]}),
    ("differenza", "via", {"testo": "L'INTUITO"}),
    ("lui#2", "vs", {"a": ["LUI", "legge i numeri"], "b": ["TU", "leggi i titoli"], "parola_b": "tu", "ko_b": True}),
    ("prossima", "tit", {"righe": ["«È LA", "*VINCITRICE»"], "sopra": "LA PROSSIMA VOLTA CHE LO SENTI"}),
    ("chiedergli", "via", {"testo": "QUANTO HA FATTURATO?", "nuovo": "DOVE?", "parola_b": "dove"}),
    ("firmato", "vs", {"a": ["FIRMATO", ""], "b": ["ESEGUIBILE", ""], "parola_b": "eseguire", "diverso": True}),
    ("qualcuno", "tit", {"righe": ["CI STAVANO", "COSTRUENDO", "UNA *FAVOLA"]}),
    ("tuoi", "tit", {"righe": ["CON I", "!TUOI SOLDI"], "grande": True}),
]


def cerca(parola, da):
    parola, _, n = parola.partition("#")
    n = int(n or 1)
    for i in range(da, len(P)):
        if norm(P[i]["w"]) == norm(parola):
            n -= 1
            if n == 0:
                return i
    raise SystemExit(f"parola non trovata: {parola!r} dopo l'indice {da}")


out, i = [], 0
for parola, tipo, dati in SCHEDE:
    i = cerca(parola, i)
    t = round(P[i]["s"] - 0.12, 2)
    d = dict(dati)
    for k in [k for k in d if k.startswith("parola_")]:
        j = cerca(d[k], i)
        d["t_" + k[7:]] = round(P[j]["s"] - 0.05, 2)
        del d[k]
    if tipo == "tre":
        voci, j = [], i
        for parola_v, num, lab in d["voci"]:
            j = cerca(parola_v, j)
            voci.append([round(P[j]["s"] - 0.05, 2), num, lab])
        d["voci"] = voci
    out.append({"t": t, "tipo": tipo, **d})
    i += 1

fine = round(P[-1]["e"], 2)
for k, s in enumerate(out):
    s["fino"] = out[k + 1]["t"] if k + 1 < len(out) else fine + 2.0
    gap = s["fino"] - s["t"]
    flag = "  <-- lunga" if gap > 4.5 else ""
    print(f'{s["t"]:6.2f} {gap:4.1f}s {s["tipo"]:8} {s.get("righe") or s.get("testo") or s.get("a") or s.get("titolo") or ""}{flag}')

open(SRC, "w", encoding="utf-8").write(
    "// A6ORACLE v5: schede agganciate alle parole (generato da attualita/A6-oracle/montaggio/schede.py)\n"
    "// tempi in secondi sulla voce-c (A+B senza la fonte)\n"
    f"export const FINE_VOCE_A6 = {fine};\n"
    "export const SCHEDE_A6: any[] = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n")
print("scritto", os.path.abspath(SRC))
