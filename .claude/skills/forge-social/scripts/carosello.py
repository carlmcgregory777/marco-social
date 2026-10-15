"""Crea le slide PNG di un carosello FORGE (1080x1350) da un file JSON.

Uso:  python carosello.py spec.json cartella_uscita

Il JSON:
{
  "slides": [
    {"tipo": "copertina", "titolo": "Il tuo cliente fa sempre *gli stessi pesi*?", "sotto": "Non e' pigrizia. ↓"},
    {"tipo": "punto", "n": "1", "titolo": "...", "testo": "...", "nota": "..."},
    {"tipo": "esempio", "titolo": "...", "righe": [["12 · 11 · 10", "resti a 40 kg"], ["12 · 12 · 12", "sali a 42,5 kg"]], "testo": "..."},
    {"tipo": "pagina", "titolo": "...", "img": "pagina.png"},
    {"tipo": "cta", "titolo": "...", "testo": "...", "bottone": "10 schede gratis · link in bio"}
  ]
}
Le parole tra *asterischi* diventano verdi. Una riga vuota nel testo va a capo.
Serve Google Chrome (lo usa senza finestra, con un profilo temporaneo separato) e i font Space Grotesk di forge/marchio.
"""
import html
import json
import os
import re
import subprocess
import sys
import tempfile

BROWSER = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
FONT = "file:///C:/Users/stang/code/forge/marchio/"
LOGO = "file:///C:/Users/stang/code/forge/marchio/icona-1024.png"
W, H = 1080, 1350


def testo(s):
    s = html.escape(s or "")
    s = re.sub(r"\*(.+?)\*", r'<em>\1</em>', s)
    return "<br>".join(s.split("\n"))


CSS = """
@font-face{font-family:SG;src:url('%(f)sSpaceGrotesk-Regular.ttf')}
@font-face{font-family:SG;font-weight:500;src:url('%(f)sSpaceGrotesk-Medium.ttf')}
@font-face{font-family:SG;font-weight:700;src:url('%(f)sSpaceGrotesk-Bold.ttf')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:%(w)dpx;height:%(h)dpx;background:#07090B;overflow:hidden}
body{font-family:SG,sans-serif;color:#EEF2F4;position:relative;
 background:radial-gradient(900px 700px at 105%% -10%%,rgba(0,225,95,.16),transparent 60%%),#07090B}
.top{position:absolute;left:84px;right:84px;top:72px;display:flex;justify-content:space-between;align-items:center}
.marca{display:flex;align-items:center;gap:16px;font-weight:700;font-size:30px;letter-spacing:.16em}
.marca img{width:44px;height:44px;border-radius:10px}
.conta{font-size:26px;color:#8B97A3;font-weight:500}
.corpo{position:absolute;left:84px;right:84px;top:210px;bottom:170px;display:flex;flex-direction:column;justify-content:center}
h1{font-weight:700;font-size:92px;line-height:1.02;letter-spacing:-.02em}
h2{font-weight:700;font-size:70px;line-height:1.06;letter-spacing:-.015em}
em{font-style:normal;color:#00E15F}
.sotto{margin-top:44px;font-size:40px;line-height:1.3;color:#8B97A3}
.n{font-weight:700;font-size:150px;line-height:1;color:#00E15F;margin-bottom:28px}
p{margin-top:40px;font-size:42px;line-height:1.36;color:#D5DDE3}
.nota{margin-top:34px;font-size:32px;line-height:1.4;color:#8B97A3}
.tab{margin-top:44px;border:2px solid #212B34;border-radius:28px;overflow:hidden}
.riga{display:flex;justify-content:space-between;padding:30px 36px;font-size:40px;border-top:2px solid #212B34}
.riga:first-child{border-top:0}
.riga b{font-weight:700}
.riga span{color:#8B97A3}
.riga.ok{background:rgba(0,225,95,.10)}
.riga.ok span{color:#00E15F}
.btn{margin-top:56px;align-self:flex-start;background:#00E15F;color:#07090B;font-weight:700;font-size:40px;padding:30px 46px;border-radius:999px}
.piccolo{font-size:56px}
.doc{margin-top:36px;align-self:center;width:912px;border-radius:18px;border:2px solid #212B34;box-shadow:0 30px 90px rgba(0,0,0,.7)}
.piede{position:absolute;left:84px;right:84px;bottom:72px;display:flex;justify-content:space-between;font-size:28px;color:#5F6B76}
.piede b{color:#8B97A3;font-weight:500}
""" % {"f": FONT, "w": W, "h": H}


def pagina(sl, i, tot, handle):
    t = sl.get("tipo", "punto")
    if t == "copertina":
        corpo = '<h1>%s</h1>%s' % (testo(sl["titolo"]), '<div class="sotto">%s</div>' % testo(sl["sotto"]) if sl.get("sotto") else "")
    elif t == "esempio":
        righe = "".join('<div class="riga%s"><b>%s</b><span>%s</span></div>' % (" ok" if j == len(sl["righe"]) - 1 and sl.get("ultima_ok", True) else "", html.escape(a), html.escape(b)) for j, (a, b) in enumerate(sl["righe"]))
        corpo = '<h2>%s</h2><div class="tab">%s</div>%s' % (testo(sl["titolo"]), righe, '<p>%s</p>' % testo(sl["testo"]) if sl.get("testo") else "")
    elif t == "pagina":
        img = "file:///" + os.path.abspath(sl["img"]).replace("\\", "/")
        corpo = '<h2 class="piccolo">%s</h2><img class="doc" src="%s">' % (testo(sl["titolo"]), img)
    elif t == "cta":
        corpo = '<h2>%s</h2>%s<div class="btn">%s</div>' % (testo(sl["titolo"]), '<p>%s</p>' % testo(sl["testo"]) if sl.get("testo") else "", html.escape(sl.get("bottone", "10 schede gratis · link in bio")))
    else:
        corpo = '%s<h2>%s</h2>%s%s' % ('<div class="n">%s</div>' % html.escape(sl["n"]) if sl.get("n") else "", testo(sl["titolo"]),
                                     '<p>%s</p>' % testo(sl["testo"]) if sl.get("testo") else "",
                                     '<div class="nota">%s</div>' % testo(sl["nota"]) if sl.get("nota") else "")
    seg = "Scorri →" if i < tot else "Salva per il prossimo cliente"
    return ('<!doctype html><html><head><meta charset="utf-8"><style>%s</style></head><body>'
            '<div class="top"><div class="marca"><img src="%s">FORGE</div><div class="conta">%d/%d</div></div>'
            '<div class="corpo">%s</div><div class="piede"><b>%s</b><span>%s</span></div></body></html>') % (CSS, LOGO, i, tot, corpo, handle, seg)


def main():
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    out = os.path.abspath(sys.argv[2])
    os.makedirs(out, exist_ok=True)
    handle = spec.get("handle", "@forgecoach.it")
    slides = spec["slides"]
    profilo = tempfile.mkdtemp(prefix="chrome-forge-")
    for i, sl in enumerate(slides, 1):
        f = os.path.join(out, "slide-%02d.html" % i)
        open(f, "w", encoding="utf-8").write(pagina(sl, i, len(slides), handle))
        png = os.path.join(out, "slide-%02d.png" % i)
        subprocess.run([BROWSER, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--user-data-dir=" + profilo,
                        "--window-size=%d,%d" % (W, H), "--virtual-time-budget=3000",
                        "--screenshot=" + png, "file:///" + f.replace("\\", "/")], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        os.remove(f)
        print(png)


if __name__ == "__main__":
    main()
