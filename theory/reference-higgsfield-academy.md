# Higgsfield Academy — corso «AI Creation» (studiato con Marco, 29/10/2026)

Fonte: https://higgsfield.ai/academy/courses/ai-creation (docente Adil). Materiale scaricato in `theory/higgsfield-academy/`: trascrizioni (`*.txt`), guide PDF, skill `03-ugc-video-creator.md`.
Lezioni 0-3 studiate. Lezioni 4-7 bloccate al 29/10 (4 Creazione e modifica di risorse, 5 Dimensioni delle inquadrature e prompt, 6 Dirigi la tua scena, 7 Guida al corso): da studiare quando si sbloccano. Gli asset di ogni lezione si trovano nell'HTML della pagina (`fetch` della pagina → link cloudfront `.vtt`, `.pdf`, `.md`), senza navigare la scheda di Marco.

## Lezione 1 — Il tuo primo video
- Prompt in 5 blocchi: **Soggetto** (chi + tratti visivi che lo identificano) → **Luogo** (posto, contorno, ora) → **Eventi** (azioni in ordine, compreso come finisce) → **Camera** (cosa resta in quadro, punto di vista, movimento) → **Luce + suono** (sorgente e direzione della luce, suoni voluti).
- Parole vaghe («drammatico») = solo umore. Per ottenere una cosa precisa nomina sorgente e direzione: «luce da una finestra a sinistra del viso, l'altro lato in ombra».
- Prompt lunghi da professionisti: ruoli distinti e riconoscibili, causa → conseguenza, continuità di camera (direzione sullo schermo, posizioni), **vincoli positivi numerati** («esattamente due velivoli, un pilota visibile solo nello shot 3, tagli netti esattamente a 3,0 s…»), sezione colore finale, audio «solo diegetico, niente musica, niente sottotitoli».
- Shot con tempi: «Shot 1 · 0.0-3.0s · grandangolo 84°, camera…», «First frame: …», chiusura «Hard cut.»
- Prima di generare: controlla modello, formato, risoluzione, durata, suono, numero di output e preventivo. Per le prove usa 480p (costa meno). Salva sempre il prompt insieme al video: lo stesso prompt può dare un video diverso.
- Generazioni fallite, NSFW o bloccate per IP: di solito i crediti tornano.

## Lezione 2 — Secondo cervello (SuperComputer = agente LLM + strumenti di generazione)
- Brief in 4 parti: **IO SONO** (chi sei, per chi è) · **MI SERVE** (risultato + periodo) · **FAI** (azione) · **FORMATO** (forma e dettaglio della risposta). Le info mancanti si aggiungono nella stessa chat.
- Controlla le ricerche: date dentro il periodo chiesto, fonte che dice davvero quella cosa, classifica utile.
- Per le scene: chi / dove / cosa succede in 3 frasi + «prima di scrivere il prompt fammi le domande che ti servono». Domande tipiche: formato, durata, ambientazione realistica, camera (un solo movimento continuo, quando rivelare), suono (diegetico).
- Rileggi il prompt prima di pagare: il modello riassume e perde dettagli (es. «spegne l'ultima luce» al posto di «spegne le luci una per una»).
- Prima bozza a 480p, con «Ask before generating» attivo.
- Revisione: **una nota alla volta**, sempre nello schema PROBLEMA → CAMBIO → COSA RESTA. Se la correzione cambia altro (ha aggiunto una tenda invece di cambiare l'inquadratura), restringi: «cambia SOLO l'inquadratura». Rileggi i vincoli («One cut» → «zero tagli»).
- Confronta lo stesso istante nelle due versioni e poi guardale intere. Una nuova generazione può rompere ciò che andava bene: ricontrolla persona, vestiti, luogo, azione, suono.
- Massimo 2 bozze per esercizio. Una bozza funzionante basta.

## Lezione 3 — Immagini prodotto e pubblicità
- Riferimenti separati con un **ruolo dichiarato**: PRODOTTO / CREATOR / LUOGO. Non comporre prima persona + luogo in un'unica immagine.
- Prodotto: foto intera, luce chiara, bordi visibili. Togliere lo sfondo non autorizza a ridisegnarlo: confronta sagoma e dettagli con l'originale.
- Persona: **character sheet** = corpo intero + volto + outfit in un'immagine 16:9 (skill «Character Sheet», Soul 2.0). Meglio 3 candidati che 20.
- Luogo: chiedere 10 location 9:16 «che spiccano», scegliere, scaricare e allegare il file (un link non basta).
- Skill «Product Photographer»: 6 foto 9:16 (3 con la persona, 3 solo prodotto). Per un set piccolo: primo piano, prodotto intero, prodotto in uso.
- Due strade video: **UGC creator** (30 s, parlato che corrisponde all'azione) oppure **spot Cinema Studio** (12 s, movimento e primi piani). «Più dinamico, aggiungi angolazioni» cambia direzione; «rigenera» dà solo un'altra versione. Nessuna delle due garantisce un risultato migliore.
- Skill UGC (`03-ugc-video-creator.md`), punti chiave:
  - prompt in 5 blocchi (regole tecniche e mondo → personaggio legato al riferimento + clausola dell'ammiccare → tappe a tempo `HOOK (0–2s)` con camera + azione + battuta → CTA facoltativa → stile);
  - telefono invisibile («il telefono che registra È la camera, fuori quadro»);
  - battito delle palpebre naturale; pelle reale senza effetto cera;
  - 15 s = 4-6 battute brevi, una parola in MAIUSCOLO per battuta;
  - arco emotivo esplicito (shock → risata → gioia);
  - mai inventare caratteristiche o affermazioni sul prodotto.

## Come lo applichiamo a C e ai video Genjutsu
1. **Riferimenti con ruolo + character sheet di C:** volto e corpo separati o in un'unica scheda. Lezione mt12: con il solo corpo intero e il protagonista di spalle Genjutsu teneva la faccia dell'originale. Fare una scheda personaggio ufficiale di C (corpo intero + volto, 16:9) e usarla come unico riferimento personaggio.
2. **Prompt = 5 blocchi + vincoli positivi**, non ripetizioni in maiuscolo («la maiuscola e i divieti ripetuti non danno garanzie»). Per i motion transfer: Soggetto (chi diventa C, con riferimento) → cosa cambia nella scena (oggetti) → cosa resta identico (elenco) → camera/luce come l'originale → pulizia (watermark).
3. **Una nota alla volta** nelle revisioni: PROBLEMA → CAMBIO → COSA RESTA. È la regola che Marco chiama «non overfittare».
4. **Non descrivere l'aspetto della persona da sostituire** («grey-haired man»): il modello tende a tenerlo. Identificala per ruolo o abito.
5. Salvare sempre prompt + video insieme (già fatto in `STATO.md`), massimo 2 bozze per video.
6. Per FORGE e per gli spot: la skill UGC è pronta da adattare (avatar che parla, telefono invisibile, gancio visivo nei primi 2 s).
