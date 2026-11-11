# Dentro Algory #11: ritagli delle schermate per Remotion, con il nome della prop firm coperto (regola di Vaga).
from PIL import Image, ImageFilter, ImageDraw
S = "schermate/"; O = "../remotion-c/public/algory11/"
def copri(im, boxes):
    for b in boxes:
        r = im.crop(b); w, h = r.size
        r = r.resize((max(1, w // 14), max(1, h // 14)), Image.BILINEAR).resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(6))
        r = Image.blend(r, Image.new("RGB", (w, h), (10, 8, 14)), 0.55)
        im.paste(r, b)
    return im
# vault: colonna BROKER coperta, tabella da ID a ARCHETYPE
v = Image.open(S + "vault.png").convert("RGB")
copri(v, [(118, 305, 300, 1012)])
v.crop((20, 240, 1010, 1012)).save(O + "vault.png")
v.crop((20, 240, 1900, 1012)).save(O + "vault-largo.png")
# curva grande (allenamento rosso / mai visti blu); la linea tratteggiata è a x=1228 nell'originale
e = Image.open(S + "equity-grande.png").convert("RGB")
e.crop((262, 127, 1658, 937)).save(O + "equity.png")
# passaporto del bot C4EA1A: curva + esami + edge fading
i = Image.open(S + "inspector-c4ea1a.png").convert("RGB")
i.crop((1420, 230, 1910, 1030)).resize((980, 1600), Image.LANCZOS).save(O + "esami.png")
# home: chip del portafoglio e riga del broker coperti
c = Image.open(S + "command.png").convert("RGB")
copri(c, [(1300, 160, 1460, 195), (1310, 822, 1640, 850)])
c.crop((0, 23, 1920, 1035)).save(O + "command.png")
print("ok")
