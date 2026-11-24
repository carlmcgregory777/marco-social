"""PDF schematico di «Le armi della persuasione» generato dal file theory/reference-cialdini-persuasione.md."""
import re, sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
                                TableStyle, PageBreak, KeepTogether, CondPageBreak)

SRC = r"C:\Users\stang\code\marco-social\theory\reference-cialdini-persuasione.md"
OUT = sys.argv[1]

pdfmetrics.registerFont(TTFont("Anton", r"C:\Users\stang\code\marco-social\produzione\vox\ep1\src\Anton-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Ar", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("ArB", r"C:\Windows\Fonts\arialbd.ttf"))
pdfmetrics.registerFont(TTFont("ArI", r"C:\Windows\Fonts\ariali.ttf"))
pdfmetrics.registerFontFamily("Ar", normal="Ar", bold="ArB", italic="ArI", boldItalic="ArB")

VIOLA = colors.HexColor("#5b3fd6"); VIOLA2 = colors.HexColor("#8b6dff")
NERO = colors.HexColor("#0b0a10"); GRIGIO = colors.HexColor("#6b6b78")
CHIARO = colors.HexColor("#f1eefc"); BORDO = colors.HexColor("#d9d2f7")

st = lambda **k: ParagraphStyle("x", fontName="Ar", fontSize=9.2, leading=12.2, textColor=NERO, **k)
S_TXT = st()
S_LAB = ParagraphStyle("lab", fontName="ArB", fontSize=7.6, leading=10, textColor=VIOLA)
S_TIT = ParagraphStyle("tit", fontName="ArB", fontSize=11, leading=14, textColor=colors.white)
S_CAP = ParagraphStyle("cap", fontName="Anton", fontSize=30, leading=34, textColor=colors.white)
S_CAPN = ParagraphStyle("capn", fontName="ArB", fontSize=10, leading=13, textColor=VIOLA2)
S_PRI = ParagraphStyle("pri", fontName="Ar", fontSize=10.5, leading=14.5, textColor=colors.white)
S_H = ParagraphStyle("h", fontName="Anton", fontSize=20, leading=24, textColor=VIOLA, spaceAfter=6)
S_BUL = st(leftIndent=12, bulletIndent=0, spaceAfter=3)

def md(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\w)", r"<i>\1</i>", t)
    t = re.sub(r"`(.+?)`", r"\1", t)
    t = re.sub(r"\[\[(.+?)\]\]", r"\1", t)
    return t

src = open(SRC, encoding="utf-8").read()
testa, corpo = src.split("# Riassunti capitolo per capitolo", 1)
sintesi = testa.split("## Sintesi per @cthe.trader", 1)[1].split("\n", 1)[1]

W = A4[0] - 30 * mm

def card(titolo, campi):
    rows = [[Paragraph(md(titolo), S_TIT)]]
    sty = [("BACKGROUND", (0, 0), (-1, 0), VIOLA), ("BOX", (0, 0), (-1, -1), 0.6, BORDO),
           ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
           ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
           ("SPAN", (0, 0), (1, 0)), ("VALIGN", (0, 0), (-1, -1), "TOP")]
    rows[0].append("")
    for lab, txt in campi:
        r = len(rows)
        rows.append([Paragraph(lab.upper(), S_LAB), Paragraph(md(txt), S_TXT)])
        if lab == "Sui social":
            sty.append(("BACKGROUND", (0, r), (-1, r), CHIARO))
        else:
            sty.append(("LINEBELOW", (0, r), (-1, r), 0.3, BORDO))
    t = Table(rows, colWidths=[24 * mm, W - 24 * mm])
    t.setStyle(TableStyle(sty))
    return t

def banner(num, titolo, principio):
    t = Table([[Paragraph("CAPITOLO " + num, S_CAPN)], [Paragraph(md(titolo).upper(), S_CAP)],
               [Paragraph(md(principio), S_PRI)]], colWidths=[W])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), NERO), ("LEFTPADDING", (0, 0), (-1, -1), 12),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 12), ("TOPPADDING", (0, 0), (0, 0), 12),
                           ("BOTTOMPADDING", (0, -1), (-1, -1), 12), ("LINEBELOW", (0, -1), (-1, -1), 4, VIOLA)]))
    return t

LABEL = {"cos'è": "Cos'è", "come funziona / prova": "Prova", "come funziona": "Prova",
         "come difendersi": "Difesa", "sui social": "Sui social"}

story = []
# copertina
story += [Spacer(1, 55 * mm), Paragraph("LE ARMI DELLA<br/>PERSUASIONE", ParagraphStyle("c", fontName="Anton", fontSize=54, leading=58, textColor=VIOLA)),
          Spacer(1, 6 * mm), Paragraph("Robert B. Cialdini · schema di ogni concetto del libro", ParagraphStyle("c2", fontName="ArB", fontSize=15, leading=19, textColor=NERO)),
          Spacer(1, 3 * mm), Paragraph("con le applicazioni per i social di @cthe.trader", ParagraphStyle("c3", fontName="Ar", fontSize=13, leading=17, textColor=GRIGIO)),
          Spacer(1, 70 * mm), Paragraph("Riassunto e parafrasi a uso personale · 24/11/2026", ParagraphStyle("c4", fontName="Ar", fontSize=9, textColor=GRIGIO)),
          PageBreak()]

# sintesi
story.append(Paragraph("IN SINTESI", S_H))
for blocco in sintesi.strip().split("\n\n"):
    righe = [r for r in blocco.split("\n") if r.strip()]
    if not righe: continue
    if righe[0].startswith("**") and righe[0].rstrip().endswith(":**") and len(righe) == 1:
        story += [Spacer(1, 4), Paragraph(md(righe[0]), ParagraphStyle("sh", fontName="ArB", fontSize=11, leading=14, textColor=VIOLA, spaceAfter=4))]
        continue
    for r in righe:
        r = r.strip()
        if r == "---": continue
        m = re.match(r"^(?:-|\d+\.)\s+(.*)", r)
        if m:
            num = re.match(r"^(\d+)\.", r)
            story.append(Paragraph(md(m.group(1)), S_BUL, bulletText=(num.group(1) + "." if num else "•")))
        elif r.endswith(":**") or (r.startswith("**") and r.endswith(":**")):
            story += [Spacer(1, 4), Paragraph(md(r), ParagraphStyle("sh", fontName="ArB", fontSize=11, leading=14, textColor=VIOLA, spaceAfter=4))]
        else:
            story.append(Paragraph(md(r), st(spaceAfter=5)))
story.append(PageBreak())

# capitoli
capitoli = re.split(r"\n## Capitolo ", corpo)[1:]
indice = []
for cap in capitoli:
    head, *_ = cap.split("\n", 1)
    num, titolo = [x.strip() for x in head.split("·", 1)]
    body = cap.split("\n", 1)[1]
    parti = re.split(r"\n### ", body)
    intro = parti[0].strip()
    # checklist in coda all'ultima voce
    ultimo = parti[-1]
    check = None
    mm_ = re.search(r"\*\*Checklist social[^\n]*\n(.*)", ultimo, re.S)
    if mm_:
        check = mm_.group(1); parti[-1] = ultimo[:mm_.start()]
    m2 = re.search(r"\*\*Checklist social[^\n]*\n(.*)", intro, re.S)
    princ = re.sub(r"\s+", " ", re.sub(r"^-{3,}$", "", intro, flags=re.M)).strip()
    princ = princ.replace("**Principio:**", "").strip()
    story += [banner(num, titolo, princ), Spacer(1, 8)]
    n = 0
    for voce in parti[1:]:
        t, *resto = voce.split("\n", 1)
        testo = resto[0] if resto else ""
        campi, extra = [], []
        for riga in re.split(r"\n(?=- \*\*)", testo.strip()):
            m = re.match(r"^- \*\*(.+?):\*\*\s*(.*)", riga.strip(), re.S)
            if m and m.group(1).lower() in LABEL:
                campi.append((LABEL[m.group(1).lower()], re.sub(r"\s*\n\s*", " ", m.group(2)).strip()))
            elif riga.strip() and riga.strip() != "---":
                extra.append(re.sub(r"\s*\n\s*", " ", riga.strip().lstrip("- ")))
        if extra:
            campi.append(("Note", " ".join(extra)))
        n += 1
        story += [KeepTogether([card(t.strip(), campi)]), Spacer(1, 6)]
    indice.append((num, titolo, n))
    if check:
        items = [re.sub(r"^\s*(?:\d+\.|-)\s*", "", x).strip() for x in check.strip().split("\n") if re.match(r"^\s*(?:\d+\.|-)\s", x)]
        rows = [[Paragraph("CHECKLIST SOCIAL · CAPITOLO " + num, S_TIT)]] + \
               [[Paragraph(md(x), ParagraphStyle("ck", parent=S_TXT, bulletIndent=0, leftIndent=12), bulletText="•")] for x in items]
        tb = Table(rows, colWidths=[W])
        tb.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), NERO), ("BACKGROUND", (0, 1), (-1, -1), CHIARO),
                                ("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 4),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), 4), ("LINEBEFORE", (0, 1), (0, -1), 3, VIOLA)]))
        story += [Spacer(1, 4), tb]
    story.append(PageBreak())

def piede(c, d):
    if d.page == 1: return
    c.saveState(); c.setFont("Ar", 7.5); c.setFillColor(GRIGIO)
    c.drawString(15 * mm, 9 * mm, "Cialdini · Le armi della persuasione · schema per @cthe.trader")
    c.drawRightString(A4[0] - 15 * mm, 9 * mm, str(d.page))
    c.setFillColor(VIOLA); c.rect(0, A4[1] - 4 * mm, A4[0], 4 * mm, stroke=0, fill=1)
    c.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm, topMargin=14 * mm, bottomMargin=15 * mm,
                      title="Cialdini - Le armi della persuasione (schema)", author="Marco")
doc.addPageTemplates([PageTemplate(frames=[Frame(15 * mm, 15 * mm, W, A4[1] - 29 * mm, id="f")], onPage=piede)])
doc.build(story)
print("ok", indice, sum(x[2] for x in indice))
