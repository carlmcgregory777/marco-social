# Higgsfield Academy — corso «AI Creation» (studiato con Marco, 29/10/2026)

Fonte: https://higgsfield.ai/academy/courses/ai-creation (docente Adil). Materiale scaricato in `theory/higgsfield-academy/`: trascrizioni (`*.txt`), guide PDF, skill `03-ugc-video-creator.md`.
Lezioni 0-3 studiate il 29/10, lezioni 4-5 il 03/11/2026. Ancora bloccate: 6 Dirigi la tua scena (`direct-your-own-scene`), 7 Guida al corso (`course-field-guide`). Le pagine sono `/academy/courses/ai-creation/<slug>`. Gli asset di ogni lezione si trovano nell'HTML della pagina (`fetch` della pagina → link cloudfront `.vtt`, `.pdf`, `.md`), senza navigare la scheda di Marco.

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

## Lezione 4 — Creare e modificare le risorse (personaggi, luoghi, oggetti)
File: `04-create-assets.txt` (trascrizione), `04-create-assets-pdf.txt` (guida), `04-image-prompt-library.pdf` (prompt + immagini), `04-cineimage-skill/cineimage-soul/SKILL.md` (skill per prompt di location).
- Idea centrale: **la qualità del video nasce dalle immagini di riferimento.** Seedance 2.5 attenua l'effetto finto ma non lo toglie: texture di plastica, bordi strani, colore e direzione della luce del riferimento passano nel video. Se le ombre dicono «luce dall'alto», il video tiene la luce dall'alto. Le zone nere chiuse restano nere.
- **Quale modello per cosa** (Cinema Studio → Image):
  - **Soul Cinema** (0,125 crediti a immagine): location fotografiche, luce credibile, texture naturali. Limiti: segue il prompt in modo libero (sposta gli oggetti), oggetti piccoli rotti, nelle scene notturne le ombre perdono dettaglio. Solo testo→immagine oppure 1 immagine senza prompt.
  - **Soul 2.0** (0,125 crediti): casting di persone. Con lo stesso prompt «portrait of a man in his mid thirties» dà 6 facce diverse e vere; Seedream e Nano Banana danno 6 «gemelli» idealizzati. Nano Banana a 2K costa 3 crediti, 24 volte di più.
  - **Seedream 5.0 Pro**: mondi grandi o fantastici e soprattutto **modifiche** (aggiungere persone, cambiare un vestito) mantenendo volto e texture. Limiti: più dettagli metti, più sembra un render 3D; ripete forme uguali.
  - **GPT Image 2.5 Sunburst**: testi esatti, impaginazioni, storyboard, targhe. Limiti: location troppo nitide, rumore nel cielo, aspetto CGI.
  - **Nano Banana Pro**: tuttofare che segue bene il prompt, ma aspetto «da AI» e volti idealizzati.
- **Controlla lo «slop» prima di usare un'immagine:** rumore dove dovrebbe essere liscio, superfici troppo nitide, motivi ripetuti uguali (forma, misura, distanza), riflessi che rubano l'attenzione. Domande: i materiali sono credibili? La luce ha senso? L'umore va bene per la scena?
- **Trucco di profondità:** elementi sfocati in primo piano + in Soul Cinema «shot on an anamorphic lens» per sfocato e bokeh da cinema.
- **Trucco segreto Soul Cinema:** crea la composizione con un modello preciso (GPT), poi trascina quell'immagine in Soul Cinema senza prompt → versioni con luce e texture da film, stesso concetto.
- **Personaggio con AI Director + skill «Character Sheet»:** brief corto (ruolo, età, stile) → 5 candidati con Soul 2.0 (0,625 crediti in tutto) → scegli → domande sul guardaroba → scheda a 3 viste in Seedream 5.0 Pro (fronte intero, retro intero, ritratto 3/4). Controlla che volto, capelli, giacca e proporzioni coincidano nelle tre viste.
- **Trucco identità:** il director prepara una seconda versione della scheda con il **volto piccolo coperto**. Il volto della figura intera può differire un po' dal ritratto: se il video riceve tutti e due ha segnali d'identità in conflitto e la faccia cambia tra piano largo e primo piano.
- **Modificare la scheda** in Seedream 5.0 Pro: allega l'originale, scrivi la modifica + cosa resta + «uguale in tutte le viste»; stesso formato e risoluzione dell'originale. Es.: «Give him a silver wallet chain… Replace the black t-shirt with a plain white ribbed cotton tank top, same tank top in all views».
- **Scheda con la tua faccia + vestiti di un altro:** «Use @Image1 only for identity… Use @Image2 only for clothing; do not transfer that person's face or identity.» Il director controlla il risultato e propone correzioni (jeans infilati negli stivali → corretti solo quelli).
- **Location:** Soul Cinema 21:9, prompt con disposizione precisa («bancone a destra, separé a sinistra, biliardo in fondo, inquadrato dalla porta»), 4 generazioni, scegli quella che serve alla scena (non la più ricca). Parti dal locale **vuoto**: è più facile giudicare lo spazio.
- **Modifica location** in Seedream 5.0 Pro con parole semplici: aggiungi persone, lascia liberi i posti che servono, metti un **punto di riferimento spaziale** (il boccale di birra al centro del bancone). Nel prompt video basta dire «si siede accanto al boccale».
- **Controcampo:** «Show the same bar from the opposite end, looking back towards the entrance… Keep the existing chairs… Change only the camera viewpoint.» Verifica la continuità: i dettagli nuovi sono inventati.
- **Oggetti di scena:** sfondo bianco, luce da studio, niente logo, **vista 3/4** (fronte + lato = meno libertà al modello). Colore che spicca (valigetta arancione). Oggetti complessi → «prop sheet» con tutti i lati.
- **Prompt di location per Seedream** (60-90 parole): «An empty photographic view of…» + 2-3 elementi con materiali → a cosa serve lo spazio («spazio libero per 15 ballerini») → camera precisa (posizione, altezza, direzione, obiettivo 24 mm) → da dove viene la luce → palette e 1-2 texture (non «8K, ultra detailed») → esclusioni brevi («No people, writing or logos»). Per provare cambia solo l'altezza della camera.
- **Skill Cineimage** (`cineimage-soul` v2.7, in `04-cineimage-skill/`): trasforma un'idea o un'immagine in un prompt di location per Soul Cinema. Regola: «controlla logica, contenuto e camera; dirigi la luce; non simulare il renderer». Si carica su Claude.ai o nel SuperComputer (`/cineimage`).
- **Compito lezione 4:** 1-2 personaggi con scheda, una location, modifiche volute alla location (persone, un oggetto, un dettaglio con cui il personaggio interagisce); caricare schede + location prima/dopo + breve descrizione.

## Lezione 5 — Inquadrature e prompt (Seedance 2.5)
File: `05-shot-sizes.txt`, `05-shot-sizes-pdf.txt`, `05-camera-shot-sizes-angles-pdf.txt` (guida camera di 20 pagine).
- **Elements:** in Cinema Studio ⋯ → Create Element → Image Element, categoria (Character, Location, Prop…) e nome semplice. Nel prompt si scrive `@Biker` e il riferimento si allega da solo. Una `@etichetta` scritta a mano senza elemento NON allega niente.
- **Seedance 2.5:** 4-30 s con audio, ripresa unica o multi-shot (decide dal prompt). Fino a 30 immagini + 10 video + 10 audio, ma **fino a 12 immagini funziona meglio**. Nella lezione: 5 immagini (2 personaggi, 1 oggetto, 2 viste del luogo).
- **Prompt in 3 parti + finale:**
  1. **SCENE CONTEXT** — l'azione visibile di tutta la clip in 1-2 frasi.
  2. **REFERENCES** — un compito per ogni riferimento: «The biker, 100% as shown in the reference image». Per l'oggetto: aspetto dall'immagine, ma **chi lo porta e in che mano** lo dice il prompt. Per il luogo: «use it for the light, color, location and background people». Seconda vista: «use it for color and location, not for composition or framing». Se vuoi solo la faccia, dillo.
  3. **SHOTS** — «Shot 1, 0-5 s: medium close-up, low angle jib shot» + azioni in ordine, nominando sempre chi fa cosa. Battute dentro l'azione: «saying "What's up?"», poi «Second of silence» per chiudere.
  4. **CONTINUITY & SOUND** — cosa resta fermo (il boccale sempre lì), profondità in ogni shot (qualcosa vicino, in mezzo, in fondo), regola dei terzi, «Natural bar ambience, footsteps, clothing movement. No music.»
- **Impostazioni:** durata = ultimo timecode, audio acceso, 1 generazione, guarda il costo. **Draft mode** = anteprima a 480p che costa meno, poi solo la take buona a 1080p.
- **Dopo ogni take, 3 domande:** chi ha fatto cosa (persona giusta)? Si riconoscono persone, oggetto e luogo? La camera mostra quello che ho chiesto? Poi correggi **una cosa**. Guarda la take nuova intera con l'audio: la correzione non deve rompere quello che andava.
- **Cosa correggere:**
  - l'errore torna in ogni take → controlla prompt e riferimenti;
  - il difetto è già nell'immagine → **correggi l'immagine**, le parole non lo cancellano;
  - agisce la persona sbagliata / oggetto fuori posto → è il testo: «se io non capisco chi è in quella frase, non lo capisce neanche Seedance»;
  - input chiari ma difetto isolato → nuova take.
- **Richiesta di riparazione a un LLM:** «Revise the tested prompt below. What went wrong: […]. What I want instead: […]. Keep the parts that already work. Update every affected line so the instructions agree. Return the full revised prompt, then list exactly what you changed or added and why. Tested prompt: […]» — poi rileggi che non abbia aggiunto azioni o movimenti.
- **Vocabolario camera** (tre scelte separate: GRANDEZZA, ANGOLO, MOVIMENTO):
  - Grandezza: extreme wide (persona piccola), wide (figura intera + spazio), full shot (testa-piedi), medium long (testa-ginocchia), cowboy (fino a metà coscia), medium (vita in su), medium close-up (testa e spalle), close-up (viso), extreme close-up (un dettaglio).
  - Angolo: eye level, high angle (dall'alto, rende piccoli), low angle (dal basso, rende imponenti), overhead (verticale), Dutch angle (orizzonte storto = disagio).
  - Movimento: pan (gira sul posto), tilt (guarda su/giù), pedestal/boom/jib (la camera sale), dolly in/out (si avvicina/allontana), truck (di lato), tracking (segue il soggetto), arc (gira intorno), zoom (cambia obiettivo, non si muove), dolly zoom (effetto «vertigine» per uno shock), static, handheld, roll, whip pan.
  - Una scelta di camera alla volta nelle prove. Sequenza base: wide (luogo) → medium (gesto) → close-up (reazione).
- **Soul Directory** (soul-directory.higgsfield.app): 33 stili, 46 movimenti camera, 24 luci con prompt da copiare + Shot Builder + simulatore di luci 3D.
- **Compito lezione 5:** 2 take della stessa scena (prima e dopo una correzione) con i loro prompt.

## Come lo applichiamo a C e ai video Genjutsu
1. **Riferimenti con ruolo + character sheet di C:** volto e corpo separati o in un'unica scheda. Lezione mt12: con il solo corpo intero e il protagonista di spalle Genjutsu teneva la faccia dell'originale. Fare una scheda personaggio ufficiale di C (corpo intero + volto, 16:9) e usarla come unico riferimento personaggio.
2. **Prompt = 5 blocchi + vincoli positivi**, non ripetizioni in maiuscolo («la maiuscola e i divieti ripetuti non danno garanzie»). Per i motion transfer: Soggetto (chi diventa C, con riferimento) → cosa cambia nella scena (oggetti) → cosa resta identico (elenco) → camera/luce come l'originale → pulizia (watermark).
3. **Una nota alla volta** nelle revisioni: PROBLEMA → CAMBIO → COSA RESTA. È la regola che Marco chiama «non overfittare».
4. **Non descrivere l'aspetto della persona da sostituire** («grey-haired man»): il modello tende a tenerlo. Identificala per ruolo o abito.
5. Salvare sempre prompt + video insieme (già fatto in `STATO.md`), massimo 2 bozze per video.
6. Per FORGE e per gli spot: la skill UGC è pronta da adattare (avatar che parla, telefono invisibile, gancio visivo nei primi 2 s).
7. **(L4) Scheda di C «da video»:** dalla scheda ufficiale (job d889c713 / 59c21fa3) fare una versione con il volto piccolo coperto e usarla nei video, così la faccia non cambia tra piano largo e primo piano.
8. **(L4) Location di C fatte bene:** ufficio a Londra di notte con Soul Cinema (0,125 crediti a immagine; di notte le ombre si chiudono: chiedere luci visibili come schermi e lampade), poi modifiche in Seedream 5.0 Pro. Un **punto di riferimento** (es. il monitor con il grafico viola al centro della scrivania) per scrivere «C si siede davanti al monitor». Sfocati in primo piano per la profondità.
9. **(L4) Casting economico:** nuovi personaggi o comparse con Soul 2.0 (6 facce per 0,75 crediti), non con Nano Banana.
10. **(L5) Salvare C come Element** in Cinema Studio (`@C`) e scrivere i prompt Seedance in 3 parti: SCENE CONTEXT → REFERENCES («C, 100% as shown in the reference image») → SHOTS con i tempi → CONTINUITY & SOUND. Durata = ultimo timecode.
11. **(L5) Prima prova in draft 480p**, solo la take buona a 1080p. Revisione con le 3 domande (azione, continuità, camera) e l'albero «correggi immagine / prompt / nuova take».
12. **(L5) Gancio dei reel di C:** usare il vocabolario camera nel primo secondo (es. dolly in veloce o dolly zoom sullo sguardo impassibile di C, low angle per dare autorità).
