# P2 film (17/11/2026): regia agganciata alle frasi della voce.
# Ogni riga = (frase del copione, cosa succede). La frase si cerca nel testo della voce e prende il tempo della sua prima parola in parole.json.
# Uscita: remotion-c/src/p2film-dati.ts (SHOT, OVER, FX, PEZZI labiale, DURATA).
import json, os, re, difflib, subprocess
QUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(QUI)
OUT = '../../../../remotion-c/src/p2film-dati.ts'

def norm(t):
    t = t.lower().replace('’', "'")
    t = re.sub(r"[^a-zà-ù0-9' ]", ' ', t).replace("'", ' ')
    return t.split()
TESTO = open('../voce/testo-completo.txt', encoding='utf-8').read()
P = json.load(open('parole.json', encoding='utf-8'))
sw = norm(TESTO)
flat, own = [], []
for k, p in enumerate(P):
    for w in norm(p['w']): flat.append(w); own.append(k)
sm = difflib.SequenceMatcher(None, sw, flat, autojunk=False)
mp = {}
for a, b, n in sm.get_matching_blocks():
    for j in range(n): mp[a + j] = b + j
DUR = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'voce.wav'], capture_output=True, text=True).stdout)
_cur = [0]
def q(frase, dopo=None):
    """tempo (s) della prima parola di «frase», cercata nel testo dopo l'ultima frase trovata"""
    f = norm(frase); n = len(f)
    start = _cur[0] if dopo is None else dopo
    for i in range(start, len(sw) - n + 1):
        if sw[i:i + n] == f:
            _cur[0] = i
            for d in range(0, 30):
                if i + d in mp: return round(max(0, P[own[mp[i + d]]]['s'] - 0.05 * (d == 0)), 3)
            raise SystemExit('nessun aggancio: ' + frase)
    raise SystemExit('frase non trovata: ' + frase)

SHOT, OVER = [], []
def clip(fr, file, s=1.0, s2=1.15, o='50% 50%', da=0.2): SHOT.append(dict(a=q(fr), tipo='clip', file=file, s=s, s2=s2, o=o, da=da))
def parla(fr, z='m'): SHOT.append(dict(a=q(fr), tipo='parla', z=z))
def graf(fr, nome, **k): SHOT.append(dict(a=q(fr), tipo='graf', nome=nome, **k))
def ov(fr, tipo, fino=None, **k):
    a = q(fr); b = None
    if fino: s = _cur[0]; b = q(fino); _cur[0] = s
    OVER.append(dict(a=a, b=b, tipo=tipo, **k))
def tr(fr, n, titolo):  # cartello della trappola + contatore
    OVER.append(dict(a=q(fr), b=None, tipo='trappola', n=n, titolo=titolo))

# ---------------- 0. conferma del click ----------------
clip('Su cento persone', 'v2/c', 1.0, 1.2)
ov('Su cento persone', 'botta', 'Sette. Gli altri', righe=['*7 SU 100'], top=760, size=150, scuro=True, dopo=1.6)
parla('Sette. Gli altri', 's')
graf('Gli altri novantatré', 'omini')
clip("C'è una regola", 'v2/j', 1.05, 1.3)
ov('anche quando sei in guadagno', 'botta', 'Le trappole sono', righe=['ANCHE IN !GUADAGNO'], top=790, scuro=True)
parla('Le trappole sono sette', 's')
ov('Sette, come quelli', 'botta', 'E alla fine', righe=['*7 TRAPPOLE'], top=800, size=140)
parla('E alla fine ti faccio', 'm')
graf('È un conto che puoi', 'titolo')
# ---------------- 1. chi parla ----------------
parla('Io sono C', 'm')
ov('Io sono C', 'nome', 'Ti faccio vedere come')
parla('Quindi sì, una prop firm', 's')
clip('Ti faccio vedere come sono costruite', 'v2/d', 1.0, 1.25)
parla('Dici: io le prop firm', 'm')
ov('almeno due di queste trappole', 'botta', 'E per fartele', righe=['2 VALGONO ANCHE', 'PER *TE'], top=640)
clip('E per fartele vedere', 'v2/a', 1.0, 1.2)
# ---------------- 2. ore 9 ----------------
clip('Sono le nove', 'v2/e', 1.0, 1.15)
ov('cinquecentoquaranta euro', 'botta', 'In cambio', righe=['*540 €'], top=780, size=150, scuro=True)
clip('In cambio hai un conto', 's02', 1.05, 1.2, '60% 40%')
graf('E cinque regole', 'regole')
parla('Facile, no', 's')
ov('Facile, no', 'ottobit', 'E la prima trappola', titolo='CHE FACCIAMO?', voci=['INIZIA', 'LEGGI LE CONDIZIONI'], scelta=0, dopo=0.8)
clip('Ovviamente le condizioni', 'v2/f', 1.0, 1.2)
# ---------------- trappola 1 ----------------
tr('Quei centomila dollari non esistono', 1, 'IL CONTO NON ESISTE')
clip('Quei centomila dollari non esistono', 's01', 1.0, 1.3, '40% 45%')
ov('Quei centomila dollari non esistono', 'ologramma', 'Una delle prop firm più grandi')
graf('Una delle prop firm più grandi', 'citazione', testo='All accounts are demo accounts with fictitious funds.', evid='demo accounts with fictitious funds', fonte='FAQ di una delle prop firm più grandi d’Europa')
parla('E dici: vabbè', 'm')
clip('Una firm americana pubblica', 'v2/o', 1.0, 1.2)
clip('Dei trader che avevano passato', 'v2/d', 1.15, 1.4)
graf('Zero virgola settantuno', 'zeroset')
parla("E c'è un dettaglio", 's')
clip('Nel simulatore clicchi', 's01', 1.1, 1.35, '45% 50%', 1.0)
clip('Nel mercato vero no', 'v2/g', 1.0, 1.2)
ov('Nel mercato vero no', 'botta', 'Quindi puoi passare', righe=['SLIPPAGE: !ZERO'], top=800, scuro=True)
parla('Questa vale anche per te', 'm')
graf('E allora i soldi che ti pagano', 'secchi')
parla('Tieni a mente questi', 's')
ov('la cosa più interessante', 'botta', 'Il primo giorno', righe=['TRAPPOLA *6'], top=820)
# ---------------- trappola 2 ----------------
tr('Il primo giorno va bene', 2, 'IL PAVIMENTO CHE SALE')
clip('Il primo giorno va bene', 's03', 1.1, 1.3, '70% 30%')
ov('Più due per cento', 'botta', 'Quindi ti senti', righe=['*+2%'], top=780, size=160)
clip('Quindi ti senti bravo', 'v2/h', 1.0, 1.15)
clip('Ma il giorno dopo esce', 'v2/i', 1.05, 1.3)
clip('Meno cinque in un giorno', 's06', 1.1, 1.25, '50% 40%')
ov('Meno cinque in un giorno', 'botta', 'Conto chiuso. Ieri', righe=['!-5% IN UN GIORNO'], top=790, scuro=True)
clip('Conto chiuso. Ieri', 's07', 1.15, 1.35, '30% 50%')
ov('Conto chiuso. Ieri', 'botta', 'Questa però', righe=['CONTO !CHIUSO'], top=800, size=140, barra=0.4, scuro=True, flash='rosso')
parla('Questa però la conoscono', 'm')
parla('Molte firm hanno una regola', 'l')
ov('Si chiama drawdown trailing', 'botta', 'Parti da centomila', righe=['DRAWDOWN *TRAILING'], top=820, size=100)
graf('Parti da centomila', 'pavimento')
clip('Sei sopra i centomila di partenza', 's07', 1.2, 1.4, '30% 50%', 1.5)
ov('Hai fatto soldi', 'botta', 'Non vale per tutte', righe=['HAI FATTO SOLDI.', 'E HAI !PERSO'], top=640, scuro=True, flash='rosso')
parla('Non vale per tutte le firm', 'm')
# ---------------- CTA ----------------
parla('Guarda, questa del pavimento', 'm')
ov('fammi un favore', 'iscriviti', 'Ma torniamo al nostro')
clip('Ma torniamo al nostro amico', 's10', 1.0, 1.15, '60% 50%')
ov('sono le due di notte', 'botta', 'Sei a più nove', righe=['ORE *2:14'], top=800, size=140, scuro=True)
# ---------------- trappola 3 ----------------
tr('Sei a più nove', 3, "L'OBIETTIVO CHE TI FA RISCHIARE")
graf('Sei a più nove', 'obiettivo')
clip("E proprio lì fai l'errore", 'v2/j', 1.1, 1.35)
ov('raddoppi la size', 'botta', 'Non sei tu', righe=['SIZE !×2'], top=800, size=150, scuro=True, flash='rosso')
parla('Non sei tu che sei debole', 's')
graf('Nel 1996 tre economisti', 'fondi')
parla('Quando sei sotto il traguardo', 'm')
clip('Una challenge, con un obiettivo fisso', 'v2/d', 1.1, 1.4)
ov('Come un torneo', 'botta', 'E poi', righe=['COME UN *TORNEO'], top=800, scuro=True)
clip("E poi c'è il «quasi»", 'n7', 1.0, 1.2)
ov('due simboli su tre', 'slot', 'Arrivare a più nove')
clip('E ti viene più voglia', 'n7', 1.3, 1.5, '30% 40%', 1.0)
parla('Arrivare a più nove e saltare', 's')
clip('Ma prova a pensare', 's10', 1.1, 1.3, '60% 50%', 2.0)
ov('Il quasi non ti fa smettere', 'botta', 'E questa, te', righe=['TI FA *RICOMPRARE'], top=800, scuro=True)
parla("E questa, te l'ho detto", 'm')
# ---------------- storia di Marco ----------------
parla('Ti dico la verità', 'm')
ov('Ti dico la verità', 'caldo', 'Hai perso. E proprio')
graf('Le prime prop firm che ho provato', 'giorni')
clip('Sempre lo stesso film', 's05', 1.05, 1.3, '35% 40%')
clip('sposti lo stop', 'v2/k', 1.0, 1.25)
clip("in venti minuti l'esame", 's07', 1.2, 1.4, '30% 50%', 2.0)
ov("in venti minuti l'esame", 'botta', 'E il giorno dopo', righe=['*20 MINUTI'], top=800, size=150, scuro=True)
parla('E il giorno dopo? Ne compravo', 's')
clip('Ne ho bruciate così tante', 's09', 1.0, 1.15)
parla('E sai cosa ho capito', 's')
ov('io ero il cliente perfetto', 'botta', 'Hai perso. E proprio', righe=['IL CLIENTE *PERFETTO'], top=800)
# ---------------- trappola 4 ----------------
tr('Hai perso. E proprio', 4, 'IL CLIENTE PERFETTO')
clip('Hai perso. E proprio', 's08', 1.05, 1.3, '45% 55%')
ov('arriva l\'offerta', 'notifica', 'Quella grande firm')
ov('riprova, con lo sconto', 'ottobit', 'Quella grande firm', titolo='CHE FACCIAMO?', voci=['RESET -20%', 'SMETTI'], scelta=1, dopo=1.0)
parla('Quella grande firm europea', 'm')
graf('quattrocentoventi milioni', 'numero', n0=0, n1=420, prima='', dopo=' M$', sopra='RICAVI 2025', sotto='una grande prop firm europea')
graf('E sai da chi arrivano', 'carrelli')
parla('Il cliente migliore di una prop firm', 's')
graf('Nel 1985 due ricercatori', 'studio', anno='1985', chi='ARKES E BLUMER', cosa='COSTO IRRECUPERABILE', frase='più hai già speso, più continui a spendere')
parla('Hai già bruciato due quote', 'm')
clip('Prima, seconda, terza', 's09', 1.05, 1.2)
ov('Prima, seconda, terza', 'challenge')
clip('Un\'analisi su trecentomila conti', 'v2/l', 1.0, 1.2)
graf('Per circa ottocento dollari', 'numero', n0=0, n1=800, prima='', dopo=' $', sopra='IN MEDIA, A TESTA', sotto='≈ 3 challenge · analisi su 300.000 conti')
parla('Va bene. Ma mettiamo', 'm')
clip('Passi. E fai pure soldi', 'v2/h', 1.0, 1.2)
parla('Sei arrivato? Mica tanto', 's')
# ---------------- trappola 5 ----------------
tr('Le regole che tutti leggono', 5, 'LE REGOLE CON GLI AGGETTIVI')
parla('Le regole che tutti leggono', 's')
clip('Quelle che contano sono', 'n5', 1.0, 1.25)
graf('Esposizione eccessiva. Posizioni', 'pagina')
parla("Chi decide cos'è eccessivo", 's')
ov('Loro', 'botta', 'E non lo dico', righe=['*LORO.'], top=800, size=170)
parla('E non lo dico solo io', 'm')
graf('una trappola per i payout', 'citazione', testo='It is not a real risk management tool. It is a payout trap.', evid='It is a payout trap.', fonte='CEO di una prop firm concorrente · Finance Magnates, 2026 (sua opinione)')
parla('Cioè la regola che dice', 'm')
clip('E poi ci sono i pagamenti', 'n11', 1.0, 1.2)
clip('A una conferenza di settore', 'n11', 1.3, 1.5, '50% 60%', 1.0)
ov('ritardi con tremilatrecento', 'botta', 'E qui la domanda', righe=['*3.300 PERSONE', 'IN ATTESA'], top=640, scuro=True)
parla('E qui la domanda vera', 'm')
# ---------------- trappola 6 ----------------
tr('Ricordi i due secchi', 6, 'QUANDO VINCI TU, PER LORO È UN COSTO')
graf('Ricordi i due secchi', 'secchi', piena=True)
graf("Risultato: l'utile è sceso", 'crollo')
parla('Quindi quando vinci tu', 's')
ov('per loro è un costo', 'botta', 'Non è cattiveria', righe=['PER LORO È UN *COSTO'], top=820, size=100)
parla('Non è cattiveria', 'm')
graf('Per tentativo, passa', 'denominatore')
parla('Stessa gente, stessi soldi', 's')
clip("E c'è un'ultima domanda", 'n6', 1.0, 1.25)
ov('ne hanno chiuse fino a cento', 'botta', 'Quest\'anno una', righe=['*1 SU 7', 'HA CHIUSO'], top=640, scuro=True)
clip('Più o meno una su sette', 'n6', 1.3, 1.5, '50% 40%', 1.0)
clip("Quest'anno una ha perso", 's11', 1.0, 1.2)
parla('E aprirne una costa poco', 'm')
graf('circa cinquemila dollari', 'numero', n0=0, n1=5000, prima='', dopo=' $', sopra='PER APRIRE UNA PROP FIRM', sotto='+ una % al fornitore · stima della stampa di settore')
parla('E poi ti vendono un conto', 's')
# ---------------- trappola 7 ----------------
tr('Ultima trappola', 7, "CHI TE L'HA CONSIGLIATA")
parla('Ultima trappola', 'm')
clip('Una recensione su YouTube', 'n12', 1.0, 1.2)
graf('Una classifica. Le stelline', 'carte')
clip('Il codice sconto. Su una', 'n12', 1.15, 1.35, '40% 40%', 1.5)
ov('fino al venti per cento', 'botta', 'Sui futures', righe=['FINO AL *20%', 'A CHI METTE IL CODICE'], top=640, scuro=True)
parla('Sui futures, prende', 'm')
graf('La classifica. Il fondatore', 'numero', n0=0, n1=10000, prima='', dopo=' $', sopra='AL MESE', sotto='per stare in classifica · detto dal fondatore di una firm americana')
parla("Non è illegale", 's')
graf('Le stelline. Una firm', 'numero', n0=1300, n1=49, prima='★ ', dopo='', sopra='RECENSIONI', sotto='tolte perché false · Finance Magnates, 2025', scendi=True)
parla('E io? In questo video', 'm')
# ---------------- conto della serva ----------------
parla('Allora, facciamo il conto della serva', 'm')
graf('Spendi in media ottocento', 'lavagna')
graf('Metti ottocento, ne tornano', 'numero', n0=800, n1=280, prima='', dopo=' $', sopra='METTI 800 $, NE TORNANO', sotto='calcolo nostro su dati FPFX · ipotesi conto da 100k', scendi=True)
parla('Quindi sono una truffa', 's')
clip('Come al casinò', 'n7', 1.1, 1.3, '40% 50%', 1.0)
parla('Però al casinò non puoi', 'm')
parla('E adesso la parte per cui', 's')
ov('Cosa fanno i sette', 'botta', 'Dati precisi', righe=['COSA FANNO I *7'], top=800, size=140)
# ---------------- cosa fanno i sette ----------------
clip('Dati precisi non ce ne sono', 'n1', 1.0, 1.2)
graf('Uno. Rischio piccolo e fisso', 'checklist')
parla('Vedi cosa hanno in comune', 'm')
parla('Chi perde le vede come ostacoli', 's')
clip('Io oggi lavoro così', 'n1', 1.15, 1.3, '30% 50%', 2.0)
# ---------------- scudo e avviso ----------------
parla('E per essere chiari', 'm')
ov('Questo non è un consiglio', 'avviso', 'E se un giorno')
parla('E se un giorno ti pagano', 's')
# ---------------- due strade + prossimo video ----------------
clip('Quindi stasera hai due strade', 's12', 1.0, 1.25, '50% 35%')
clip('Ne compri un\'altra a sentimento', 'v2/l', 1.0, 1.2)
clip('Oppure, prima di spendere', 'n5', 1.1, 1.3)
parla('La checklist che uso io', 'm')
ov('La checklist che uso io', 'checkgratis', 'Il prossimo video')
graf('Il prossimo video lo decidi tu', 'ab')
parla('Scrivi A o B', 's')
parla('E se vuoi sapere come', 'm')

# ---------------- spezza le inquadrature «parla» sui confini dei pezzi del labiale ----------------
PEZZI = json.load(open('labiale/indice.json'))
SHOT.sort(key=lambda s: s['a'])
for k in range(1, len(SHOT)):
    if SHOT[k]['a'] <= SHOT[k - 1]['a']: raise SystemExit(f"ordine sbagliato: {SHOT[k - 1]} / {SHOT[k]}")
fine = DUR + 0.6
for k, s in enumerate(SHOT):
    s['b'] = SHOT[k + 1]['a'] if k + 1 < len(SHOT) else fine
    if s['tipo'] == 'clip' and s['b'] - s['a'] > 9.5: print('ATTENZIONE clip lunga', round(s['b'] - s['a'], 1), s['file'], s['a'])
    if s['tipo'] == 'clip': s['vel'] = round(max(0.5, min(1.0, 4.7 / max(0.1, s['b'] - s['a']))), 3)
# effetti: whoosh ai cambi, impact sulle scritte, boom sui flash
FX = []
for k, s in enumerate(SHOT):
    if k: FX.append([round(s['a'] - 0.08, 3), 'whoosh' if s['tipo'] == 'graf' else 'swish', 0.45 if s['tipo'] != 'parla' else 0.3])
for o in OVER:
    if o['tipo'] == 'botta': FX.append([o['a'] + o.get('dopo', 0), 'boom' if o.get('flash') else 'impact', 0.7])
    if o['tipo'] == 'trappola': FX += [[o['a'] - 0.1, 'riser', 0.35], [o['a'] + 0.3, 'boom', 0.8]]
    if o['tipo'] in ('ottobit', 'notifica', 'iscriviti', 'checkgratis'): FX.append([o['a'] + o.get('dopo', 0), 'pop', 0.8])
# tempi utili per le grafiche (parole chiave)
_cur[0] = 0
K = {}
def k(nome, fr): K[nome] = q(fr)
k('o_sette', 'Gli altri novantatré'); k('reg1', 'Fai più dieci'); k('reg2', 'poi più cinque'); k('reg3', 'Non perdere più del cinque'); k('reg4', 'né più del dieci'); k('reg5', 'Almeno quattro giorni')
k('zs', 'Zero virgola settantuno'); k('sec_q', 'Dalla quota che hai pagato'); k('sec_p', 'E da quella di chi')
k('pav1', 'Parti da centomila'); k('pav2', 'Vai bene, arrivi'); k('pav3', 'Ma il limite sale'); k('pav4', 'Poi il mercato respira'); k('pav5', 'e il conto viene chiuso')
k('ob1', 'Ti manca un per cento'); k('fo1', 'I gestori che a metà anno'); k('fo2', 'nella seconda metà rischiavano')
k('gg1', 'Ventinove, ventotto'); k('car1', 'Da gente che aveva già comprato')
k('ch1', 'Prima, seconda, terza'); k('ch2', 'seconda, terza. Un'); k('ch3', 'terza. Un\'analisi')
k('pg1', 'Esposizione eccessiva. Posizioni'); k('pg2', 'Posizioni di dimensione anomala'); k('pg3', 'farti perdere le ricompense')
k('sec2', 'La firm aveva messo da parte'); k('sec3', 'Non sono bastati'); k('cr1', 'Risultato: l\'utile')
k('den1', 'Per tentativo, passa'); k('den2', 'Per persona, il cinquantadue')
k('ca1', 'Il codice sconto. Su una'); k('lav1', 'Spendi in media ottocento'); k('lav2', 'Sette volte su cento'); k('lav3', 'E il pagamento medio'); k('lav4', 'Diviso tutti')
k('cl1', 'Uno. Rischio piccolo'); k('cl2', 'Due. Più sono vicini'); k('cl3', 'Tre. Le regole scritte'); k('cl4', 'Quattro. Leggono'); k('cl5', 'Cinque. Un budget')
k('ab1', 'A: prendo le regole'); k('ab2', 'B: ti faccio vedere'); k('fine', 'Io mi fermo qui')
ts = ('// generato da youtube/P2-prop-firm/film/montaggio/regia.py: non modificare a mano\n'
      f'export const DURATA_P2FILM_S = {round(fine + 0.8, 3)};\n'
      f'export const SHOT: any[] = {json.dumps(SHOT, ensure_ascii=False)};\n'
      f'export const OVER: any[] = {json.dumps(OVER, ensure_ascii=False)};\n'
      f'export const FX: [number, string, number][] = {json.dumps(sorted(FX))};\n'
      f'export const PEZZI: {{a: number; b: number}}[] = {json.dumps([dict(a=p["a"], b=p["b"]) for p in PEZZI])};\n'
      f'export const K: Record<string, number> = {json.dumps(K)};\n')
open(OUT, 'w', encoding='utf-8').write(ts)
print('inquadrature', len(SHOT), 'sovrapposizioni', len(OVER), 'fx', len(FX), 'ratio', round(sm.ratio(), 3), 'durata', round(fine, 1))
