# Schede agganciate alle PAROLE della voce (formato SchedeC.tsx, dall'08/11/2026).
# Ogni episodio ha montaggio/schede.py con la lista SCHEDE e chiama genera().
# Una scheda: (parola d'aggancio, tipo, dati). La parola si cerca DOPO quella della scheda
# precedente; "parola#n" = n-esima occorrenza da lì. Le chiavi "parola_x" diventano "t_x".
# Tipi: tit, lista/tre (voci [parola, testo]), vs, via, giornale, timbro (primo, secondo, parola_b), grafico, pieno.
# Nel grafico: "segni" [{parola, i, testo, col, su}] e "grosso" {parola, testo}.
import json, os, re

norm = lambda s: re.sub(r"[^\wàèéìòù'&]", "", s.lower())


def genera(parole_json, schede, out_ts, nome):
    P = json.load(open(parole_json, encoding="utf-8"))

    def cerca(parola, da):
        parola, _, n = parola.partition("#")
        n = int(n or 1)
        for i in range(da, len(P)):
            if norm(P[i]["w"]) == norm(parola):
                n -= 1
                if n == 0:
                    return i
        raise SystemExit(f"parola non trovata: {parola!r} dopo l'indice {da} ({P[da]['w'] if da < len(P) else 'fine'})")

    t_di = lambda j: round(P[j]["s"] - 0.05, 2)
    out, i = [], 0
    for parola, tipo, dati in schede:
        i = cerca(parola, i)
        d = json.loads(json.dumps(dati))
        # 10/11/2026: un timbro con "testo" al posto di "primo" usciva vuoto nel video (A15)
        if tipo == "timbro" and "primo" not in d:
            raise SystemExit(f'timbro su {parola!r}: servono "primo" (+ "secondo" e "parola_b"), 1-2 parole ciascuno')
        if tipo == "tit" and d.get("grande") and len(d.get("righe", [])) > 2:
            print(f'ATTENZIONE tit su {parola!r}: "grande" con 3 righe può coprire i sottotitoli, controlla il fotogramma')
        for k in [k for k in d if k.startswith("parola_")]:
            d["t_" + k[7:]] = t_di(cerca(d.pop(k), i))
        if tipo in ("lista", "tre"):
            j, voci = i, []
            for pv, testo in d["voci"]:
                j = cerca(pv, j)
                voci.append([t_di(j), testo])
            d["voci"] = voci
        if tipo == "grafico":
            j = i
            for m in d.get("segni", []):
                j = cerca(m.pop("parola"), j)
                m["t"] = t_di(j)
            if "grosso" in d:
                d["grosso"]["t"] = t_di(cerca(d["grosso"].pop("parola"), i))
        out.append({"t": round(P[i]["s"] - 0.12, 2), "tipo": tipo, **d})
        i += 1

    out[0]["t"] = 0.0  # la prima scheda copre anche l'attacco
    fine = round(P[-1]["e"], 2)
    for k, s in enumerate(out):
        s["fino"] = out[k + 1]["t"] if k + 1 < len(out) else fine + 2.0
        gap = s["fino"] - s["t"]
        flag = "  <-- lunga" if gap > 4.5 else ("  <-- corta" if gap < 1.2 else "")
        etich = s.get("righe") or s.get("testo") or s.get("a") or s.get("titolo") or s.get("voci") or ""
        print(f'{s["t"]:6.2f} {gap:4.1f}s {s["tipo"]:8} {str(etich)[:60]}{flag}')

    open(out_ts, "w", encoding="utf-8").write(
        f"// {nome}: schede agganciate alle parole (generato da schede.py dell'episodio)\n"
        f"export const FINE_VOCE = {fine};\n"
        "export const SCHEDE: any[] = " + json.dumps(out, ensure_ascii=False) + ";\n")
    print("scritto", os.path.abspath(out_ts), "| schede:", len(out))
