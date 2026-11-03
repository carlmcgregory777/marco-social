# Serie «Dentro Algory» (10 episodi + versioni lunghe)

Creata il 03/11/2026. Scheda tecnica di riferimento: `docs/ALGORY-PARTNER.md`.

## Regole fisse della serie

- **Una funzione per episodio**, spiegata con schermate vere dell'app (registrazione dello schermo del PC di Marco o della VPS). Niente schermate inventate.
- **Formato short** (Instagram Reel, TikTok, YouTube Short): 45-70 s, 9:16. Gancio nei primi 3 s, C in apertura (clip o immagine), poi schermo dell'app con zoom sul punto che conta, sottotitoli, voce Julian, valzer Burton a rotazione, ×1,1. Copertina con C e numero «DENTRO ALGORY #n».
- **Ruolo Cosentino**: Educazione o Autorità. La CTA esplicita c'è, perché è la serie di conversione (eccezione già prevista: i reel ALGORY possono chiudere su Algory).
- **CTA unica** in tutti gli episodi: «Commenta ALGO e ti mando il link per provarlo gratis». In didascalia: «Codice STANGA20: -20% su ogni pagamento». Su TikTok, dove il link non si clicca, il codice va anche **scritto a schermo** nell'ultimo secondo.
- **Avviso a schermo** (ultimi 2 s, scritta piccola ma leggibile) e in didascalia: «#ad · link affiliato · Il trading comporta un alto rischio di perdita. I backtest non garantiscono risultati futuri.»
- **Mai**: promesse di guadagno, percentuali di challenge superate, «rendita», «soldi facili»; mai il nome della prop firm; mai screenshot del Discord di Algory.
- **Etichette**: Instagram «Partnership pagata» (contenuto brandizzato) + «Contenuti IA»; TikTok «Contenuti brandizzati» + «Generato con IA»; YouTube «Promozione a pagamento».
- **Versione lunga YouTube**: ogni episodio ha la sua versione da 8-12 minuti. Per tenere la qualità, se ne pubblica **una ogni due settimane**, unendo due episodi vicini (vedi roadmap). Il link affiliato cliccabile va nella descrizione dei video lunghi; ogni Short punta al suo video lungo con il «Video correlato».

## Riepilogo

| # | Titolo | Funzione | Ruolo |
|---|---|---|---|
| 1 | Non compro bot. Li faccio nascere. | Cos'è Algory, allevamento e genoma | Educazione |
| 2 | Il backtest che ti mente | In-sample 70% / fuori campione 30% | Educazione |
| 3 | 4 esami prima del conto | I 4 cancelli del vault | Autorità |
| 4 | Il passaporto di un bot | Vault, passaporto, voto 0-100, persistence | Educazione |
| 5 | Funziona sul mio MetaTrader? | Parity test A-F | Autorità |
| 6 | Lo spread che uccide i bot | Costi veri per broker | Educazione |
| 7 | 15 bot, un solo rischio | Portafogli e voto di diversità | Educazione |
| 8 | Il bot che si ferma da solo | Full Deploy e protezioni dentro l'EA | Autorità |
| 9 | Prima 25%, poi tutto | Incubazione | Educazione |
| 10 | Quando un bot muore | Reassess, decadimento, rotazione | Autorità |

---

## Episodio 1 — «Non compro bot. Li faccio nascere.» (PROSSIMO DA GIRARE)

- **Gancio (0-3 s)**: C fermo, impassibile: «I bot da 99 € su Telegram? Io i miei li faccio nascere. E ne butto il 99%.» A schermo, il vault che scorre veloce.
- **Punti chiave**: 1) Algory non vende bot, li crea: ogni strategia ha un DNA (segnale, filtro, uscita). 2) Due tribù evolvono 20 generazioni, poi si sfidano nella «Final War». 3) Quasi tutti muoiono: arrivano nel vault solo quelli che passano gli esami (si vedono nell'episodio 3). 4) Si parte gratis su oro, USDJPY e USDCAD.
- **Schermate da registrare**: avvio di una campagna (scelta simbolo e timeframe); la barra delle generazioni che avanza; il contatore «nati / sopravvissuti»; il vault con la lista dei bot; il pannello dei geni di un bot (inspector).
- **CTA**: «Commenta ALGO e ti mando il link: la versione gratis basta per vedere nascere il primo bot.» Didascalia con STANGA20.
- **Versione lunga YouTube** (con l'ep. 2): «Ho visto nascere 1.000 bot di trading: ecco quanti ne sono sopravvissuti». Campagna completa in tempo reale (accelerata), spiegazione del genoma gene per gene, quanti bot escono da una campagna vera, differenza tra piano Free e Pro.

## Episodio 2 — «Il backtest che ti mente»

- **Gancio**: «Questo bot fa +340%. È spazzatura.» Curva bellissima, poi taglio sulla parte fuori campione che crolla.
- **Punti chiave**: 1) Un bot si può «adattare» al passato fino a sembrare perfetto (overfitting). 2) Algory lo allena sul primo 70% e lo giudica sull'ultimo 30%, che non ha mai visto. 3) La colonna da guardare è il ritorno fuori campione, non RET. 4) Esempio vero dal vault di Marco: bot con RET alto e OOS scarso.
- **Schermate**: passaporto con la zona fuori campione evidenziata; colonne RET e OOS del vault a confronto; ordinamento per OOS.
- **CTA**: «Commenta ALGO: ti mando il link e i 2 numeri che guardo per primi.»
- **Versione lunga**: insieme all'ep. 1 (vedi sopra), capitolo «Come leggere un backtest senza farsi fregare».

## Episodio 3 — «4 esami prima del conto»

- **Gancio**: «Prima di toccare un euro, ogni mio bot deve passare 4 esami. Il terzo ne boccia la metà.»
- **Punti chiave**: 1) Battere 100 strategie a caso sui dati nascosti (se no è fortuna). 2) 1.000 rimescolamenti dell'ordine dei trade: il drawdown regge? 3) Parametri spostati di poco: il bot sta in piedi o crolla? 4) Almeno 15 trade fuori campione, se no il campione è troppo piccolo.
- **Schermate**: il riepilogo dei cancelli di un bot promosso e di uno bocciato; il grafico Monte Carlo dei rimescolamenti.
- **CTA**: «Commenta ALGO e ti mando il link per vedere gli esami dei tuoi bot.»
- **Versione lunga** (con l'ep. 4): «I 4 test che i venditori di bot non ti fanno vedere». Ogni cancello spiegato con un esempio promosso e uno bocciato, e cosa significa Monte Carlo in parole semplici.

## Episodio 4 — «Il passaporto di un bot»

- **Gancio**: «Ogni bot che uso ha un passaporto. Questo prende 91 su 100. Ti faccio vedere perché.»
- **Punti chiave**: 1) Il voto 0-100 somma otto parti. 2) La più pesante è la persistence: quanto tiene fuori campione rispetto all'allenamento. 3) Poi recovery e Sharpe. 4) I filtri che usa Marco nel vault (persistence ≥100, DD ≤5%, almeno 100 trade).
- **Schermate**: passaporto completo; dettaglio del voto; filtri del vault impostati.
- **CTA**: «Commenta ALGO: ti mando il link e i miei filtri.»
- **Versione lunga**: insieme all'ep. 3.

## Episodio 5 — «Funziona sul mio MetaTrader?»

- **Gancio**: «Il backtest dice A. Il tuo MetaTrader dice F. Chi ha ragione?»
- **Punti chiave**: 1) Molti bot funzionano solo nel software che li ha creati. 2) Il parity test rigioca il bot nel tester di MT5 e confronta. 3) Voto A-F: si mette in conto solo da A (85% e oltre). 4) Cosa fare con un B o un C.
- **Schermate**: avvio del parity test; MT5 Strategy Tester che gira; voto finale.
- **CTA**: «Commenta ALGO e ti mando il link.»
- **Versione lunga** (con l'ep. 6): «Perché il tuo bot vince nel backtest e perde sul conto». Parità, costi del broker, slippage reale del conto di Marco (stop da circa 400 $ chiusi fino a -577 $).

## Episodio 6 — «Lo spread che uccide i bot»

- **Gancio**: «Questo bot era perfetto. Poi ho messo lo spread vero: morto.»
- **Punti chiave**: 1) Commissioni, spread, swap, slippage e ora legale cambiano da broker a broker. 2) Algory li calcola per il tuo broker e li scrive sul passaporto. 3) Esempio vero: il NAS100 tolto per uno spread di 163 punti con stop stretto. 4) Regola: prima i costi, poi il sogno.
- **Schermate**: costi del broker nel passaporto; confronto tra un bot su forex e uno su indice.
- **CTA**: «Commenta ALGO e ti mando il link.»
- **Versione lunga**: insieme all'ep. 5.

## Episodio 7 — «15 bot, un solo rischio»

- **Gancio**: «Ho 15 bot. Se due si somigliano troppo, il mio portafoglio prende D.»
- **Punti chiave**: 1) Un portafoglio non è una lista di bot buoni: devono essere diversi. 2) Voto di diversità su 5 assi. 3) Correlazione 0,9 o più: tetto a D. 4) Simulazione dell'equity combinata al rischio scelto.
- **Schermate**: pagina portafoglio con voto; matrice delle correlazioni; equity combinata.
- **CTA**: «Commenta ALGO e ti mando il link.»
- **Versione lunga** (con l'ep. 8): «Come costruisco un portafoglio di bot da zero (e come lo metto sul conto)». Dalla scelta nel vault al deploy, rischio per bot, picco di rischio contemporaneo.

## Episodio 8 — «Il bot che si ferma da solo»

- **Gancio**: «Se il conto perde il 4% in un giorno, i miei bot si spengono da soli. Senza di me.»
- **Punti chiave**: 1) Full Deploy: un clic, un grafico per bot, controllo che siano caricati. 2) Protezioni dentro l'EA: drawdown giornaliero, rischio totale, filtro notizie, chiusura del venerdì. 3) Perché contano per chi ha regole di drawdown. 4) Scadenza del deploy e refresh.
- **Schermate**: impostazioni di deploy con le protezioni; MT5 con i grafici aperti; log di caricamento.
- **CTA**: «Commenta ALGO e ti mando il link.»
- **Versione lunga**: insieme all'ep. 7.

## Episodio 9 — «Prima 25%, poi tutto»

- **Gancio**: «Un bot nuovo, sul mio conto, non rischia mai il 100%. Inizia dal 25.»
- **Punti chiave**: 1) Incubazione: 25% del rischio, poi 50% quando dimostra, poi 100%. 2) Perché il primo mese live è il più pericoloso. 3) Come si vede in che fase è ogni bot.
- **Schermate**: impostazione dell'incubazione; elenco bot con la fase.
- **CTA**: «Commenta ALGO e ti mando il link.»
- **Versione lunga** (con l'ep. 10): «Il ciclo di vita di un bot: nasce, cresce, muore». Incubazione, reassess, decadimento, rotazione, con i bot veri tolti dal conto di Marco a luglio.

## Episodio 10 — «Quando un bot muore»

- **Gancio**: «Questo bot è stato sul mio conto per mesi. Oggi lo spengo. Ti spiego perché.» (Numeri e voti nei ganci di tutta la serie: si usano quelli veri del giorno della registrazione.)
- **Punti chiave**: 1) Ogni strategia prima o poi si consuma. 2) Reassess dopo 15 trade nuovi: HOLDING, DECAYED, TOO EARLY. 3) Se il voto scende di 5 punti: WEAKENING o REPLACE. 4) Rotazione con un bot nuovo dal vault. Chiude il cerchio con l'ep. 1 (loop: «e ne nasce un altro»).
- **Schermate**: pannello reassess; bot segnato REPLACE; sostituzione nel portafoglio.
- **CTA**: «Commenta ALGO e ti mando il link per iniziare dal primo bot.»
- **Versione lunga**: insieme all'ep. 9.

---

## Episodi extra (dai reel di Vaga, 03/11/2026)

- **11 — «Non hai paura del curve fitting?»** (formato risposta al commento): il commento vero a schermo, poi i 4 controlli con le schermate. Gancio: «Mi hanno scritto: i tuoi bot sono solo adattati al passato. Ti faccio vedere come lo controllo.»
- **12 — «Il bot che cerca da solo»**: la nuova ricerca da prezzo grezzo di Algory. Gancio: «8 milioni di test in 2 ore. Ne sono sopravvissuti 19.» Numeri solo se verificati sulla versione della VPS.
- **13 — «Ogni video di bot IA che vedi è finto»**: dashboard animate contro un software che fa trading davvero (le animazioni le facciamo noi in Remotion e lo diciamo).

Regola: le schermate si registrano sulla **VPS**, dove c'è la versione aggiornata di Algory (il PC ha ancora quella di luglio).

## Didascalia tipo (Instagram)

```
[frase gancio ripresa dal video]

Dentro Algory #1: come nasce un bot di trading e perché quasi tutti muoiono prima di arrivare sul conto.

Commenta ALGO e ti mando il link per provarlo gratis.
Codice STANGA20: -20% su ogni pagamento.

#ad link affiliato. Il trading comporta un alto rischio di perdita. I backtest non garantiscono risultati futuri. Non è un consiglio finanziario.
🎙️ Voce generata con AI

#tradingalgoritmico #botditrading #algory
```

TikTok: descrizione corta in inglese nello stile di C, più la riga «Code STANGA20 · #ad · Trading involves high risk of loss», niente altri hashtag.
