# Allinea i pezzi del copione v4 ([L] [M] [G: ...] [I: ...], lezioni N°) ai tempi delle parole della voce finale.
# Uscita: segmenti.json = [{tipo, nota, lezione, titolo, a, b, testo}] con a/b in secondi di voce.wav.
import json, os, re, difflib
QUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(QUI)
righe = open('../copione.md', encoding='utf-8').read().split('\n')
i0 = next(i for i, r in enumerate(righe) if r.startswith('### Gancio'))
i1 = next(i for i, r in enumerate(righe) if r.startswith('## 3b.'))
NUM = {'2016': 'duemilasedici', '2017': 'duemiladiciassette', 'stanga50': 'stanga cinquanta'}
def norm(t):
    t = t.lower().replace('’', "'")
    for k, v in NUM.items(): t = t.replace(k, v)
    t = re.sub(r"[^a-zà-ù0-9' ]", ' ', t).replace("'", ' ')
    return t.split()
seg = []; lez = (0, ''); cur = None
for r in righe[i0:i1]:
    r = r.strip()
    m = re.match(r'\*\*N° (\d+) · (.+)\*\*', r)
    if m: lez = (int(m.group(1)), m.group(2)); continue
    m = re.match(r'\[(L|M)\]$', r) or re.match(r'\[(G|I): (.+)\]$', r)
    if m:
        cur = dict(tipo=m.group(1), nota=(m.group(2) if m.lastindex > 1 else ''), lezione=lez[0], titolo=lez[1], testo='')
        seg.append(cur); continue
    if r.startswith('###') or not r or cur is None: continue
    cur['testo'] += (' ' if cur['testo'] else '') + r
seg = [s for s in seg if s['testo']]
P = json.load(open('parole.json', encoding='utf-8'))
tw = [norm(p['w']) for p in P]
flat = []; own = []
for k, ws in enumerate(tw):
    for w in ws: flat.append(w); own.append(k)
sw = []; start = []
for s in seg:
    start.append(len(sw)); sw += norm(s['testo'])
sm = difflib.SequenceMatcher(None, sw, flat, autojunk=False)
mp = {}
for a, b, n in sm.get_matching_blocks():
    for j in range(n): mp[a + j] = b + j
def trova(i):
    for d in range(0, 40):
        if i + d in mp: return max(0, mp[i + d] - d)
    raise SystemExit(f'nessun aggancio vicino alla parola {i}')
for k, s in enumerate(seg):
    s['a'] = round(P[own[trova(start[k])]]['s'], 2)
for k, s in enumerate(seg):
    s['b'] = seg[k + 1]['a'] if k + 1 < len(seg) else round(P[-1]['e'] + 0.6, 2)
print('ratio allineamento', round(sm.ratio(), 3))
for s in seg: print(f"{s['a']:7.2f}-{s['b']:7.2f} {s['tipo']} N{s['lezione']:<2} {s['nota'][:30]:30} {s['testo'][:60]}")
json.dump(seg, open('segmenti.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------- tempi delle frasi chiave: cerca la frase nel copione, prende il tempo della parola agganciata ----------
CUE = [
 ('c500', 'bruciato cinquecento euro', 0), ('cRisparmi', 'tutti i miei risparmi', 0), ('cChallenge', 'challenge su challenge', 0),
 ('cContarle', 'smesso pure di contarle', 0), ('cSenzaLavoro', 'senza lavoro', 0), ('cUltimi', 'ultimi soldi', 0),
 ('c2016', 'dal 2016', 0), ('cDieci', 'quasi dieci anni', 0), ('cAT', 'analisi tecnica analisi', 0), ('cVol', 'analisi volumetrica order', 0),
 ('cOF', 'order flow i quartili', 0), ('cQuart', 'i quartili gli', 0), ('cInd', 'con l inducement', 0), ('cTutto', 'l ho provato', 0),
 ('cOggi', 'oggi lavoro', 0), ('cStress', 'meno stressante', 0), ('cGrafico', 'attaccato al grafico', 0), ('cErrori', 'gli errori', 0),
 ('cDodici', 'dodici cose', 0), ('cNonVera', 'non sono una persona vera', 0), ('cMiChiamo', 'mi chiamo c', 0), ('cAI', 'intelligenza artificiale', 0),
 ('cLoSo', 'lo so lo so', 0), ('cMarco', 'dietro di me c è marco', 0), ('cQuinte', 'dietro le quinte', 0),
 ('c1', 'allora 2016 forse', 0), ('cPub', 'la pubblicità', 0), ('cAnche', 'anche tu puoi', 0), ('cCasco', 'io ci casco', 0), ('cLeva', 'con una leva', 0),
 ('c80', 'faccio ottanta euro', 0), ('cGenio', 'mi sentivo un genio', 0), ('cPeggiore', 'la cosa peggiore', 0), ('cIngiust', 'un ingiustizia', 0),
 ('cMazzata', 'la mazzata', 0), ('cVenerdi', 'venerdì sera', 0), ('cPetrolio', 'sul petrolio', 0), ('cCinema', 'vado al cinema', 0), ('cChiuso', 'il mercato nel weekend è chiuso', 0),
 ('cMondo', 'il mondo no', 0), ('cSalto', 'fa un salto', 0), ('cGap', 'si chiama gap', 0), ('cLunedi', 'lunedì mattina', 0), ('c500b', 'cinquecento euro andati', 0), ('cPopcorn', 'mangiavo i popcorn', 0),
 ('cShock', 'shockato', 0), ('cNonTutto', 'il grafico non è tutto', 0),
 ('cStudiare', 'mi metto a studiare', 0), ('cNoProp', 'non esistevano nemmeno', 0), ('cMM', 'il money management', 0), ('cRR', 'il rapporto rischio rendimento', 0), ('cWR', 'il win rate', 0), ('cSess', 'le sessioni di mercato', 0),
 ('cRischi10', 'rischi dieci euro', 0), ('cVenti', 'guadagnarne venti', 0), ('cUnaSuDue', 'una volta su due', 0), ('cPerdi10', 'perdi dieci', 0), ('cVinci20', 'vinci venti', 0), ('cSopra', 'sei comunque sopra', 0), ('cMatem', 'il trading è matematica', 0),
 ('cMedie', 'medie mobili trendline', 200), ('cTrend', 'trendline rotture', 200), ('cRotture', 'rotture di supporti', 200), ('cIndic', 'indicatori tutta', 200), ('cGiusta', 'tutta roba giusta', 0),
 ('cRispettarle', 'non vuol dire rispettarle', 0), ('cTorna', 'poi torna', 0),
 ('cPropArrivano', 'poi arrivano le prop firm', 0), ('c50k', 'cinquantamila', 0), ('c100k', 'centomila dollari se', 0), ('cEsame', 'si chiama challenge', 0), ('cPaghi', 'paghi l iscrizione', 0), ('cRegole', 'rispetti le regole', 0), ('cObiettivo', 'raggiungi l obiettivo', 0), ('cLoro', 'coi soldi loro', 0),
 ('c30', 'trenta giorni per passarla', 0), ('cFantastico', 'fantastico no', 0), ('cContatore', 'quel contatore', 0), ('c29', 'ventinove', 0), ('c28', 'ventotto', 0), ('cStringe', 'il tempo stringe', 0),
 ('cPagavo', 'le pagavo', 0), ('cBruciavo', 'e le bruciavo', 0), ('cFilm', 'lo stesso film', 0), ('cDueGiorni', 'due giorni perfetti', 0), ('cStop', 'sposti lo stop', 0), ('cTorna2', 'tanto torna', 0), ('cRaddoppi', 'raddoppi per recuperare', 0), ('cVentiMin', 'in venti minuti', 0),
 ('cGratta', 'un gratta e vinci', 0), ('cCaro', 'pure caro', 0),
 ('cPezzo', 'ti manchi un pezzo', 0), ('cG5vol', 'passo all analisi volumetrica', 0), ('cG5of', 'poi all order flow', 0), ('cG5q', 'poi i quartili', 0), ('cG5ind', 'gli algo con l inducement la', 0), ('cG5buona', 'la volta buona', 0),
 ('cFunz', 'funzionavano tutti', 0), ('cIo', 'il problema ero io', 0),
 ('cConti', 'conti bruciati conti ripresi', 0), ('cPayout', 'qualche payout', 0), ('cCeLho', 'ce l ho fatta', 0), ('cSuGiu', 'su e giù su e giù', 0), ('cSopravv', 'sono sopravvissuto', 0), ('cNonVivere', 'sopravvivere non è vivere', 0),
 ('cPeggio', 'il periodo peggiore', 0), ('cDomanda', 'ma chi me lo fa fare', 0), ('cCommenti', 'scrivimelo nei commenti', 0), ('cMollano', 'tanti a quel punto mollano', 0), ('cIoNo', 'io no', 340), ('cSicuro', 'sicuro al cento per cento', 0),
 ('cOgg', 'in modo oggettivo', 0), ('cAltrimenti', 'altrimenti è tutto inutile', 0), ('cGramm', 'senza regole di grammatica', 0), ('cConviene', 'come ti conviene', 0), ('cPerdita', 'se sei in perdita', 0), ('cGuadagno', 'se sei in guadagno', 0),
 ('cAmico', 'un mio amico', 0), ('cVaga', 'vaga fx', 0), ('cNiente', 'niente interpretazioni', 0), ('cRegoleV', 'regole e mi', 0), ('cPiaciuto', 'mi è piaciuto subito', 0),
 ('cCopiato', 'non ho copiato', 0), ('cConcetti', 'i suoi concetti', 0), ('cMia', 'una strategia mia', 0), ('cPassa', 'e la passo', 0), ('cArrivano', 'e arrivano i payout', 0), ('cAnni', 'dopo anni', 0), ('cStudenti', 'siamo studenti di vaga', 0),
 ('cProgetto', 'un progetto nuovo', 0), ('cAlgo', 'trading algoritmico', 0), ('cAlgory1', 'si chiamava già algory', 0), ('cVeterani', 'ai veterani', 0), ('cBeta', 'beta tester', 0), ('cRotto', 'pure rotto', 0),
 ('cDomandaN', 'non più qual è il metodo giusto', 0), ('cMezzo', 'posso togliermi io di mezzo', 0),
 ('cPrima', 'pensa a cosa voleva dire', 0), ('cBot', 'trasformarla in un bot', 0), ('cFortuna', 'era solo fortuna', 0), ('cAnniV', 'ci volevano anni', 0), ('cProgr', 'roba da programmatori', 0),
 ('cDaSolo', 'la fa da solo', 0), ('cParam', 'parametri che decidi tu', 0), ('cSacco', 'crea un sacco di strategie', 0), ('cMaiVisto', 'non hanno mai visto', 0), ('cButta', 'e butta via', 0),
 ('cStudente', 'come uno studente', 0), ('cMemoria', 'a memoria', 0), ('cNuove', 'domande nuove', 0), ('cFuori', 'se non lo passa fuori', 0), ('cProssimi', 'nei prossimi video pezzo', 0),
 ('cGasa', 'non si gasa', 0), ('cNoCinema', 'non va al cinema', 0), ('cNonInterp', 'non interpreta niente', 0),
 ('cOcchio', 'ora però occhio', 0), ('cStampa', 'stampa soldi', 0), ('cNonEsiste', 'non esiste', 540), ('cSiPerde', 'si perde anche così', 0), ('cMesi', 'i suoi mesi brutti', 0), ('cPerche', 'sai perché perdi', 0), ('cScendere', 'quanto può scendere', 0),
 ('cNormale', 'è normale', 550), ('cSpegni', 'e la spegni', 0), ('cRegola', 'è una regola non', 0), ('cVita', 'un altra vita', 0), ('cSchermi', 'dieci schermi', 0), ('cDormire', 'dormire', 560), ('cCinemaFin', 'andare al cinema finalmente', 0),
 ('cCorsi', 'corsi da migliaia', 0), ('cSegnali', 'abbonamenti ai segnali', 0), ('cComprate', 'comprate una dietro l altra', 0),
 ('cMetodo', 'il metodo di vaga', 0), ('cStrum', 'algory come strumento', 0), ('cConto', 'un conto da centomila', 0), ('cCloud', 'un computer in cloud', 0), ('cGratis', 'piano gratuito', 0),
 ('cLink', 'il link in descrizione', 0), ('cAffil', 'è un link affiliato', 0), ('cNonCosta', 'non costa niente di più', 0), ('cCodice', 'col codice', 0), ('cMeta', 'paghi la metà', 0),
 ('cPrimo', 'il primo video del canale', 0), ('cDentro', 'ti porto dentro algory', 0), ('cChal', 'per passare una challenge', 0), ('cPers', 'un conto personale', 0), ('cMano', 'il trading a mano', 0),
 ('cReel', 'sui reel', 620), ('cSenzaPanico', 'senza panico', 0), ('cCommunity', 'è una community', 0), ('cStufata', 'sentire promesse', 0), ('cLeggo', 'li leggo tutti', 0),
 ('cLascio', 'e ti lascio con una cosa', 0), ('cFantasie', 'fantasie più ottimiste', 0), ('cEccoci', 'eccoci qua', 0), ('cSegreto', 'l indicatore segreto', 0), ('cPerfetto', 'il metodo perfetto', 0),
 ('cServono', 'servono regole', 0), ('cRispetti', 'qualcosa che le rispetti', 0), ('cDovevo', 'dovevo essere io', 0), ('cNonPiu', 'oggi non più', 0), ('cConsiglio', 'non è un consiglio finanziario', 0), ('cCiao', 'ciao', 680),
]
tempo_parola = lambda i: P[own[trova(i)]]['s']
T = {}
for nome, fr, dopo in CUE:
    q = norm(fr); hit = None
    for i in range(len(sw) - len(q) + 1):
        if sw[i:i + len(q)] == q and tempo_parola(i) >= dopo: hit = i; break
    if hit is None: raise SystemExit('frase non trovata: ' + fr)
    T[nome] = round(tempo_parola(hit), 2)
json.dump(T, open('tempi.json', 'w', encoding='utf-8'), indent=0)
print(len(T), 'tempi')
