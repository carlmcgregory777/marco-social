# Elenco degli Short delle Attualità (17/11/2026): titolo, file, copertina, data e ora di uscita.
# Descrizione = sezione «Instagram» di didascalia.md. Uso: python shorts.py -> shorts.json
import json, re, pathlib
R = pathlib.Path(__file__).resolve().parents[2] / "attualita"
P1 = pathlib.Path(__file__).resolve().parents[1] / "P1-prototipo" / "finale"
S = [  # chiave, cartella, file, copertina, data, ora, titolo
 ("A19","A19-eurodigitale","A19-euro","A19-euro","2026-11-18","12:30","Euro digitale: «ti spengono i soldi»? Cosa c'è di vero"),
 ("A18","A18-nuovo","A18-conti","A18-conti","2026-11-18","18:30","Lavorare in regola conviene? Il conto con 3 figli e l'Assegno di inclusione"),
 ("A20","A20-gasolio","A20-gasolio","A20-gasolio","2026-11-19","12:30","Il petrolio scende, il gasolio quasi no. Dove finisce la differenza?"),
 ("A11","A11-pensioni","A11-pensioni","A11-pensioni","2026-11-19","18:30","La tua pensione si rimpicciolisce: 1,5 lavoratori per ogni pensionato"),
 ("A21","A21-truffe","A21-truffe","A21-truffe","2026-11-20","12:30","Truffe con l'IA: la Consob ha oscurato 1.878 siti. Io te lo dico, loro no"),
 ("A12","A12-armi","A12-armi","A12-armi","2026-11-20","18:30","10.000 € in Rheinmetall nel 2022: oggi 81.000. Col senno di poi"),
 ("A26","A26-pieno","A26-pieno","A26-pieno","2026-11-21","12:30","Pieno da 50 €: 26 vanno allo Stato. E c'è la tassa sulla tassa"),
 ("A15","A15-bollette","A15-bollette","A15-bollette","2026-11-21","18:30","Torino, bollette bruciate in piazza: i tre numeri che contano"),
 ("A22","A22-bonus-soglia","A22-bonus-soglia","A22-bonus-soglia","2026-11-22","12:30","ISEE un euro sopra la soglia: perdi tutto il bonus luce"),
 ("A14","A14-taglio","A14-taglio","A14-taglio","2026-11-22","18:30","Zelensky e il re di Svezia: il video è vero, la notizia è falsa"),
 ("A23","A23-aumento","A23-aumento","A23-aumento","2026-11-23","12:30","100 € lordi di aumento, 56 € in busta: dove vanno gli altri 44?"),
 ("A13","A13-qi","A13-qi","A13-qi","2026-11-23","18:30","Il QI più alto del mondo dimostra Dio? Un titolo non è una prova"),
 ("A24","A24-tredicesima","A24-tredicesima","A24-tredicesima","2026-11-24","12:30","Perché la tredicesima è più bassa del tuo stipendio"),
 ("A17","A17-nuovo","A17-libro","A17-libro","2026-11-24","18:30","Libro di storia Laterza, pagina 666. E chi paga i libri? Tu"),
 ("A25","A25-pensione-minima","A25-pensione","A25-pensione-minima","2026-11-25","12:30","20 anni di contributi o zero: 66 € di differenza sulla pensione"),
 ("A16","A16-bomba","A16-bomba","A16-bomba","2026-11-25","18:30","Allarme bomba in 6.000 scuole e tutti a dire «compra cybersecurity»"),
]
out = []
for k, d, f, c, data, ora, tit in S:
    t = (R / d / "didascalia.md").read_text(encoding="utf-8")
    m = re.search(r"^## Instagram[^\n]*\n(.*?)(?=^## |\Z)", t, re.S | re.M)
    desc = re.sub(r"\n{3,}", "\n\n", m.group(1).strip())
    out.append(dict(k=k, titolo=tit, video=str(R/d/"finale"/f"{f}-FINALE.mp4"), copertina=str(R/d/"finale"/f"{c}-copertina.jpg"), data=data, ora=ora, descrizione=desc))
out.append(dict(k="P1", titolo="Fare soldi col trading? Non conta quanto sei bravo", video=str(P1/"P1-reel-9x16-v3.mp4"), copertina=str(P1/"P1-reel-copertina.jpg"), data="2026-11-26", ora="18:30",
  descrizione="Non conta quanto sei bravo col trading. Conta in che gioco stai giocando.\n\nTu in quale casella sei? Scrivilo nei commenti.\n\nNessun consiglio finanziario · 🎙️ voce generata con AI\n\n#trading #tradingitalia #educazionefinanziaria"))
for o in out:
    for p in ("video","copertina"):
        assert pathlib.Path(o[p]).exists(), o[p]
    assert len(o["titolo"]) <= 100 and len(o["descrizione"]) < 5000, o["k"]
json.dump(out, open(pathlib.Path(__file__).with_name("shorts.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(out), "ok")
