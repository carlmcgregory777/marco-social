# Analisi: Alex Hormozi «How To Make More Money Than You Deserve (My 2027 Framework)»

Video: youtube.com/watch?v=pwZJcLZc3_Y · 08/11/2026 · 17:37 · 1,4 milioni di views in 4 giorni · girato in 4K a 24 fps.
Analisi del 13/11/2026: 113 cambi di inquadratura rilevati in automatico, fogli di fotogrammi ogni 4 s e ogni 1 s nel primo minuto (cartella `fogli/`).

## 1. Struttura del contenuto

| Tempo | Blocco | Cosa succede |
|---|---|---|
| 0:00-0:10 | Gancio | Una frase-tesi («non conta quanto sei bravo, conta che business scegli») + prova sociale: palco, sede Acquisition.com, «OVER 10,000 BUSINESSES» |
| 0:10-0:40 | Mappa | Presenta il framework «IDIOT INDEX»: grafico a 2 assi (difficoltà × soldi) con 5 caselle numerate. È la mappa di tutto il video |
| 0:40-1:00 | Sottopancia | «ALEX HORMOZI · $250M/year Founder» + avviso legale in basso |
| 1:00-16:50 | 5 livelli | Ogni livello: torna il grafico con la casella cerchiata → definizione → esempi disegnati → «non-obvious truth» (frase-tweet) → caso reale |
| 6:20-7:15 | CTA a metà | Mostra il poster fisico «$100M Scaling Roadmap» + grafica 3D del documento + «↓ LINK IN DESCRIPTION ↓» giallo |
| 16:50-17:37 | Chiusura | Grafico completo, frase finale in tweet («Choose the boat…») |

Il trucco del contenuto: **un solo framework visivo** ripreso 6-7 volte. Lo spettatore sa sempre «a che punto siamo» (riduce l'abbandono su un video di 17 minuti).

## 2. Ritmo del montaggio

- Primo minuto: **21 tagli** (uno ogni 3 s). Poi 4-10 tagli al minuto, ma con una grafica nuova ogni 4-8 s: l'occhio non sta mai fermo più di 5-6 s.
- Inquadratura media 9 s, mediana 6 s.
- **Tre camere** sullo stesso set: totale frontale (tavolo intero), mezzo busto, e una laterale stretta. Si alternano a ogni frase importante. Per noi: un solo clip di C basta, si fanno «finti cambi di camera» con zoom digitale (vedi §5).
- Tagli **sulle pause**: nessun «ehm», nessun respiro. Il parlato è serrato.
- Ogni tanto inserto **dal vero**: mani che spostano i fogli sul tavolo-lavagna (il tavolo stesso è il grafico).

## 3. Elementi grafici (6 tipi, sempre gli stessi)

1. **Titoli d'apertura**: maiuscolo bianco, sans molto grasso (tipo *Inter/Proxima Nova Black*), sopra e sotto il soggetto, su B-roll scuro, con entrata sfocata→nitida.
2. **Doodle a pennarello** (il marchio di fabbrica): icone disegnate a mano in nero, linea spessa, sfondo bianco puro che si fonde con lo studio bianco. Etichette in stampatello a mano. Un solo colore d'accento: **verde** (cerchio intorno all'opzione giusta, frecce, «$$$») e **rosso** per «HARD» e le cancellature.
   - Animazione: si **disegnano da sole** (tratto che avanza, come scritto a mano in ~0,5-1 s), entrano a **sinistra e a destra del soggetto**, mai sopra la faccia. Poi zoom lento d'insieme.
   - Il cerchio verde si disegna dopo, come un evidenziatore.
3. **Grafico «IDIOT INDEX»** a schermo intero: assi neri, testo blu-pennarello, caselle che compaiono una alla volta in ordine numerico, casella attiva cerchiata in verde.
4. **Scheda «DEFINITION»** (sottopancia didattico): quadratino blu elettrico + «DEFINITION» spaziato piccolo + termine in maiuscolo sottile + riquadro bianco con ombra e testo nero semibold (font tipo *Inter*). Entra da sinistra con una linea verticale sottile che collega quadratino e riquadro. Compare **ogni volta** che dice una parola tecnica (circa 40 volte nel video).
5. **Card «tweet» stile X**: card nera arrotondata, foto profilo + nome + spunta blu, il testo si **scrive parola per parola** a tempo con la voce. Usata per le frasi-citazione («non-obvious truth»). Entra con dissolvenza grigio→nero.
6. **CTA**: grafica 3D del documento che scorre in prospettiva + banda gialla «↓ LINK IN DESCRIPTION ↓».

Altro: sottopancia nome nero con testo bianco; disclaimer legale piccolo in basso al primo minuto; nessuna musica invadente; colore pulito, sfondo bianco sovraesposto.

## 4. Con cosa è fatto (la mia stima)

- **Ripresa**: 3 cineprese cinema in 4K (24 fps), studio bianco «infinito», luce morbida. Niente AI.
- **Montaggio**: Premiere Pro o DaVinci Resolve (team interno di editor di Acquisition.com).
- **Animazioni**: After Effects. I doodle sono illustrazioni vettoriali fatte da un illustratore (o su Procreate/iPad) e animate con «Trim Paths» o maschere che seguono il tratto. Le card definizione e i tweet sono modelli (MOGRT) riusati in tutto il canale.
- **Font**: sans geometrico/grotesk (Inter o simile) per card e titoli; un font a stampatello a mano (simile a *Patrick Hand SC* o *Kalam*) per le etichette dei doodle.

## 5. Come lo rifacciamo noi con C (tutto gratis tranne voce e labiale)

| Elemento Hormozi | Come lo facciamo | Strumento | Costo |
|---|---|---|---|
| Studio bianco + 3 camere | C a una scrivania in studio bianco; 1 clip labiale, poi 3 «camere» finte: totale, zoom 1,35 al busto, zoom 1,7 sul viso, con taglio a ogni frase | Nano Banana (set) + InfiniteTalk su Runpod + Remotion | 0,13 $ + 0,25 $ ogni ~50 s di parlato |
| Doodle che si disegnano | Icone generate con AI («black marker doodle, white background»), convertite in vettori (potrace) e animate col tratto che avanza | Nano Banana o GPT Image 2 → potrace → Remotion `@remotion/paths` | ~0,04 $ a icona, oppure set di icone gratis |
| Grafico-framework | Componente Remotion: assi che si disegnano, caselle numerate, cerchio verde sulla casella attiva | Remotion | gratis |
| Scheda DEFINITION | Componente Remotion con il quadratino viola #5b3fd6 al posto del blu | Remotion | gratis |
| Card tweet | Card nera di @cthe.trader con testo parola per parola, sincronizzato con `parole-allineate.json` (che già abbiamo) | Remotion | gratis |
| Titoli d'apertura su B-roll | Filmati veri (Tg, borsa) + titolo Anton | yt-dlp + Remotion | gratis |
| CTA a metà | Grafica della checklist/lead magnet + banda «↓ LINK IN DESCRIZIONE ↓» | Remotion | gratis |

Per la versione in italiano dei doodle: font a mano *Patrick Hand SC* (Google Fonts, gratis), accento viola al posto del verde, rosso solo per perdite (regola del brand).
