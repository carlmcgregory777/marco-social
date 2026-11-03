# Algory: affiliazione, link e scheda della piattaforma

Aggiornato il 03/11/2026. Algory è l'affiliazione PRINCIPALE di @cthe.trader (decisione di Marco del 03/11/2026): viene prima di Higgsfield e di qualsiasi altro partner.

## 1. Cosa ha scritto Vaga (mail del 03/11/2026, 16:34)

Mittente: tomas@vagafx.com, a fxmafialtd@gmail.com, oggetto «Received: Partner Program Application». Domanda approvata.

| Voce | Valore |
|---|---|
| Link affiliato | https://algory.app/index.html?p=stanga |
| Codice 1 | **STANGA20**: 20% di sconto su ogni pagamento, finché il cliente resta abbonato |
| Codice 2 | **STANGA50**: 50% di sconto solo sul primo pagamento |
| Commissione | 50% di quello che il cliente paga davvero (dopo lo sconto), per tutto il tempo in cui resta abbonato |
| Attribuzione | chi si iscrive dal link **o** paga con un codice è tuo «da quel momento». Nessuna durata di cookie indicata: l'aggancio è all'iscrizione, poi è a vita finché paga |
| Pagamento | mensile, PayPal o Wise. Marco deve mandare a Vaga l'indirizzo. Soglia minima «piccola», cifra non indicata |
| Dove mettere cosa | link in bio; **codici nei reel e nelle didascalie**, perché lì i link non sono cliccabili |
| Extra | white label (Algory col tuo marchio, prezzi tuoi, setup una tantum + quota sui ricavi). Chiamata su algory.app/book |

### Cosa è vietato (mail + pagina partner algory.app/partners.html)

- **Non nominare la prop firm nei post su Algory.** Alcune firm rifiutano i payout se scoprono che usi bot. Quindi mai «GOAT», «GoatFunded» o altri nomi: si dice «un conto da 100.000 $ di una prop firm».
- Chi usa già Algory o è già nel Discord **non conta**. Mai proporre link o codice nel Discord, né in chat privata a membri del Discord: se ti beccano a «rubare» clienti dal Discord perdi le commissioni non pagate e la partnership finisce.
- Mai promettere profitti, guadagni, percentuali di challenge superate o risultati garantiti. Mostrare i propri risultati è permesso.
- **#ad** nella didascalia di ogni post con link o codice (in Italia aggiungere anche #adv).
- Niente auto-iscrizioni, niente annunci a pagamento sulla parola «Algory», niente spam.
- La commissione può essere trattenuta se si violano le regole di promozione.

### Prezzi Algory (sito, 03/11/2026, in dollari)

| Piano | Prezzo | Con STANGA20 | Tua commissione (50%) |
|---|---|---|---|
| Free | 0 $ | — | 0 $ |
| Mensile | 97 $/mese | 77,60 $ | 38,80 $ al mese |
| Trimestrale | 197 $/trimestre | 157,60 $ | 78,80 $ al trimestre |
| Annuale | 487 $/anno | 389,60 $ | 194,80 $ all'anno |
| Secondo PC (VPS) | +29 $/mese, +59 $/trim., +145 $/anno | | |

Con STANGA50 il cliente paga metà solo la prima volta, poi prezzo pieno: la commissione dei mesi dopo è più alta (48,50 $/mese). **Consiglio: spingere STANGA20 come codice principale** (è più facile da vendere: «-20% per sempre») e tenere STANGA50 per le occasioni (Black Friday, lancio della serie).

## 2. Piano dei link (DA CONFERMARE con Marco prima di toccare qualsiasi cosa)

Regola: un solo indirizzo nostro che conta i clic e si cambia in un punto solo, come per Higgsfield:
`https://marcostangatrader.netlify.app/vai/algory` → `https://algory.app/index.html?p=stanga`

| # | Dove | Ora | Dopo |
|---|---|---|---|
| 1 | `netlify.toml` | solo /vai/higgsfield | aggiungere /vai/algory e /link/vai/algory → link di Vaga (302) |
| 2 | Pagina link in bio (`sito/link/index.html`) | card «Il tool con cui creo e testo i miei bot · #ad» nascosta (data-dal 2099) e senza link | card visibile, **primo posto**: «Algory: il software con cui creo e testo i miei bot · #ad». Sotto: «Codice STANGA20: -20% su ogni pagamento. Link affiliato. Il trading comporta un alto rischio di perdita.» → /vai/algory |
| 3 | Pagina link in bio, ordine | checklist prima | Algory 1°, checklist 2° (resta il regalo che raccoglie email) |
| 4 | Pagina link in bio, footer | senza Partita IVA | aggiungere la Partita IVA (serve da quando c'è un link affiliato attivo, nota del 17/10) |
| 5 | Link nel profilo Instagram, voce «Ti mando la guida» | porta alla guida | titolo «Algory -20% · link aff.» → /vai/algory. La voce non è nel codice del sito: è uno dei link del profilo Instagram, si cambia dall'app |
| 6 | Bio Instagram, terza riga | — | «👇 Algory -20% codice STANGA20 · #ad · trading = alto rischio» |
| 7 | ManyChat parola **ALGO** | porta alla checklist gratis | DM con pulsante → /vai/algory + codice STANGA20 + avviso di rischio; la checklist resta come secondo pulsante |
| 8 | Bio TikTok | — | «Algory -20%: codice STANGA20 (#ad)». Il link in bio di TikTok arriva solo a 1.000 follower: per ora il codice è l'unico modo per non perdere i lead |
| 9 | Canale YouTube, link dell'intestazione | — | primo link «Algory -20% (link aff.)» → /vai/algory |
| 10 | Sito c-thetrader.com | nessun link affiliato | facoltativo: pulsante in inglese «The software C runs on · #ad» |
| 11 | Kit di C (Higgsfield) e parola VIDEO | link Higgsfield | **resta com'è**: è il regalo promesso nel reel Higgsfield, cambiarlo rompe quella promessa. Higgsfield diventa affiliazione secondaria |

## 3. Scheda Algory (da sapere a memoria prima di girare)

Fonti: sito algory.app (03/11/2026), app installata sul PC di Marco (build 1.4.0.6.0, del 24/07/2026), analisi dei bot di luglio (memoria «GOAT Funded + Algory»).

**Cos'è.** Un software per Windows di VagaFX Ltd che crea strategie di trading automatiche per MetaTrader 5. Non vende bot già fatti: li «alleva» e scarta quelli che non reggono. Slogan: «Trading strategies that survive live».

**Come nasce un bot.**
1. Genoma: ogni strategia è fatta di geni (segnale, direzione, filtro, uscita, esecuzione).
2. Allevamento: due «tribù», Consistency e Growth, evolvono per 20 generazioni ciascuna; poi la «Final War» unisce i due gruppi. Si incrociano solo geni che passano la verifica di parità con MT5.
3. Dati: il bot si allena sul primo 70% dello storico ed è giudicato sull'ultimo 30%, che l'allevamento non vede mai (fuori campione, OOS).
4. Quattro cancelli prima del vault: battere la maggior parte di 100 strategie casuali sui dati nascosti; reggere 1.000 rimescolamenti dell'ordine dei trade (drawdown rimisurato); reggere piccole modifiche dei parametri; avere almeno 15 trade fuori campione.
5. Costi veri: commissioni, spread, swap, slippage e ora legale, calcolati per broker.

**Vault e passaporto.** Ogni bot sopravvissuto ha un passaporto: curva con la zona fuori campione evidenziata, statistiche, geni, voto 0-100 e lettera. Il voto pesa otto parti: la più importante è la persistence (20 punti, quanto tiene fuori campione), poi recovery e Sharpe (15 ciascuno).

**Parity test.** Il bot viene rigiocato nel tester di MT5 di chi lo usa e riceve un voto A-F su quanto combacia. Si mette in conto solo da A (85% e oltre).

**Portafogli.** Più bot insieme, con voto di diversità A-F su cinque assi: correlazione, esposizione, salute, concentrazione, dimensione. Se due bot hanno correlazione 0,9 o più, tutto il portafoglio non può superare D. Simulazione dell'equity combinata al rischio scelto.

**Full Deploy.** Compila il portafoglio in EA per MT5, apre un grafico per bot e controlla che ogni bot sia caricato. Protezioni dentro l'EA: limite di drawdown giornaliero (4% di base), rischio totale massimo tra i bot, blocco per simbolo, obiettivo di profitto facoltativo, filtro notizie, chiusura del venerdì, margine massimo, lotto minimo forzato.

**Incubazione** (facoltativa). Il bot parte al 25% del rischio, passa al 50% quando dimostra di funzionare, al 100% quando è promosso.

**Scadenza, Refresh, Reassess.** Ogni deploy vale 90 giorni secondo il sito (a luglio, sulla build di Marco, la validità osservata era circa 30 giorni: verificare dopo l'aggiornamento). Refresh = rifà la stessa strategia sul motore attuale e sul tuo broker (il voto può scendere). Reassess = rivaluta un bot live dopo 15 trade nuovi: HOLDING, DECAYED o TOO EARLY. Se il voto cala di 5 punti o l'aspettativa diventa negativa: HOLDING, WEAKENING o REPLACE. Rotazione = il bot stanco si sostituisce con uno nuovo dal vault.

**Automazioni.** Programmi che concatenano campagna, ricostruzione del portafoglio, pulizia e parity test. I mercati che non producono nulla due volte vengono saltati e riprovati più avanti. Cestino di 30 giorni; i bot dei portafogli sono protetti dalla pulizia automatica.

**Piano Free.** Motore completo, solo oro, USDJPY e USDCAD su H1 o H2, potenza Eco e Medium, vault, un solo PC, nessuna carta. È il gancio perfetto: «provalo gratis, paghi solo se vuoi tutti i mercati e il deploy».

**Filosofia (da ripetere con le parole giuste).** Algory non garantisce profitti: garantisce il processo e la possibilità di controllarlo. Test onesti, fuori campione, parità tra backtest e conto vero, gestione del decadimento. Frase sicura: «Algory non ti dice che il bot vincerà. Ti dice quanto ha retto su dati che non aveva mai visto».

**Lezioni dal conto di Marco (utili e vere, senza nominare la firm).** I bot su NAS100 e GER40 hanno fatto quasi sempre male; H2 e H4 sono i timeframe più fertili, M15 da evitare; uno storico più lungo non dà bot migliori; la colonna RET mostra soprattutto l'in-sample, quella che conta è il ritorno OOS; i bot scaduti diventano inerti.

**Da fare.** L'app di Marco è la build 1.4.0.6.0 di luglio: aggiornarla prima di registrare le schermate, così la serie mostra la versione attuale. Algory non pubblica un changelog sul sito: le novità si leggono nel Discord (solo leggere, mai promuovere lì).

**Avviso da mettere ovunque:** «Il trading comporta un alto rischio di perdita. I risultati passati e i backtest non garantiscono risultati futuri. Non è un consiglio finanziario. #ad link affiliato.»

## 4. Cosa insegnano i reel di Vaga (@vagafx, 95k follower, studiati il 03/11/2026)

Studiati 15 reel (aprile-ottobre 2026): parlato trascritto e fotogrammi. Tutti durano circa 30 secondi e chiudono con «Comment ALGO» (link o guida in DM). La parola è la stessa che usiamo noi.

**Novità e numeri precisi che Vaga dice nei reel (più dettagliati del sito):**
- Test contro il caso: il bot deve battere **almeno 75 su 100** bot casuali sul 30% di dati mai visti.
- Test dei parametri: si «spinge» ogni parametro; se **meno della metà** delle versioni resta in guadagno, il bot viene buttato.
- Rimescolamento: 1.000 volte l'ordine dei trade; se la sfortuna porta un drawdown troppo grande, fuori.
- Bot live ricontrollati sui dati nuovi: quelli che calano vengono sostituiti.
- **Novità di ottobre 2026, «ricerca da prezzo grezzo»:** un bot che ignora indicatori e concetti noti e cerca da solo le forme nel prezzo. 8 milioni di test in meno di 2 ore, 19 schemi sopravvissuti su un anno di dati mai visti (12 segnali di entrata, 6 filtri), nessuno valido su un secondo mercato. Esempi: EURUSD alle 8:00 dopo un nuovo minimo di swing; EURUSD a mezzogiorno, 71 casi in un anno, 56 su 100 al target.
- Il piano Free esiste dal lancio pubblico (16/04/2026, dopo 6 mesi di beta nella community).

**I formati che usa (da adattare, mai copiare):**
1. **Storia vera di finanza quantitativa** (LTCM che perde 4,6 miliardi, Knight Capital che perde 440 milioni in 45 minuti, il «weekend effect» di Jim Simons, la matematica dell'uranio che smonta i pattern) → la lezione → «Comment ALGO». Combacia con le nostre Attualità e i dati che ribaltano.
2. **«Il mio software ha trovato…»**: un pattern concreto con numeri (ora, mercato, quante volte, percentuale) e la prova sui dati mai visti.
3. **Risposta a un commento** («Non hai paura del curve fitting?»): il commento a schermo, poi la spiegazione con le schermate.
4. **Smonta-falsi**: «tutti i video di bot IA che vedi sono animazioni» (le ha rifatte con Claude in un prompt), poi la differenza con un software vero.
5. **B-roll estetico**: il monitor con l'app accesa, tastiera rossa, una frase sola in sovrimpressione («Prima legge del backtest: se i risultati sono perfetti, hai dimenticato lo spread»).

**Le schermate che mostra (da registrare uguali sul nostro schermo, versione VPS aggiornata):** contatore radiale delle generazioni della campagna; «Live engine feed» con le righe dei test e «saved to vault»; ventaglio delle curve con la linea che separa allenamento e dati mai visti; tabella del vault con le percentuali; inspector di un bot con geni e punteggio (es. 73); numero di «Strategies alive»; pannello Market/Tribe/Generation/Top fitness.

**Cosa ne prendiamo:** ganci da 30 secondi con un numero concreto; la «risposta al commento» come formato fisso (episodio 11 della serie); le storie quant famose nelle Attualità; un episodio extra sulla ricerca da prezzo grezzo. Stile visivo: noi restiamo viola e nero con C, non il rosso di Vaga, così non sembriamo una copia.
