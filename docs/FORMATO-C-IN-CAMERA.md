# Formato «C in camera» (deciso il 31/10/2026, sostituisce lo schermo diviso di R9)

Marco: lo schermo diviso con i meme non è andato bene. Nuovo schema: C parla in camera da più inquadrature, con spezzoni cinematografici e grafiche animate in stile After Effects. Deve poter diventare virale e insieme spiegare bene.

## Lo schema (40-45 s)
| Tempo | Blocco | Cosa si vede | Perché funziona |
|---|---|---|---|
| 0-3 s | GANCIO | C in primo piano che parla (labiale vero), zoom di scatto all'ultima parola, numero gigante animato sopra | volto + numero = stop dello scroll |
| 3-10 s | CONTESTO | spezzone cinematografico con C dentro la metafora (es. schermi che scrivono codice da soli) + 1 parola chiave grande | curiosità visiva |
| 10-30 s | SPIEGAZIONE | alternanza ogni 2-4 s: spezzone metafora → grafica animata con il numero vero → spezzone | ogni cambio rimette a zero l'attenzione |
| 30-36 s | OPINIONE | C da un'altra inquadratura (tre quarti, luce diversa) che parla | l'opinione detta in faccia crea fiducia |
| 36-40 s | PROMESSA | spezzone «cosa vedrai da qui in avanti» | motivo per seguire |
| 40-45 s | CTA + LOOP | C in primissimo piano: «Commenta ALGO» + finto box commento; l'ultima frase si aggancia alla prima | commenti + rivisioni |

## Inquadrature di C (Dreamina, seedance_2.0_mini m2v: ritratto + voce Julian, labiale vero)
- **A, primo piano frontale:** gancio.
- **B, tre quarti con luce laterale viola:** opinioni.
- **C, primissimo piano:** CTA.
- **D, piano largo seduto alla scrivania:** facoltativo.
- Riferimento sempre `pers_C.png`. Prompt con «keep face, purple bowl haircut, big ears, black moustache, black suit, purple shirt, black tie exactly identical».
- **Costo misurato il 31/10:** 5 crediti al secondo (test di 5 s = 25 crediti, labiale ok).

## Spezzoni metafora (Dreamina seedance_2.0_mini, 4-6 s)
C è sempre dentro la scena, impassibile, mentre succede la cosa assurda: fabbrica di strategie, muro di vetro, robottino sulla scala, caveau che si apre. Stile cinematografico scuro, viola e nero, niente testo nel video (le scritte le mette Remotion).

## Effetti stile After Effects (Remotion, gratis)
- **Transizioni:** zoom con motion blur, whip pan, flash, glitch RGB.
- **Testo cinetico:** parola che entra con overshoot, tracking che si allarga, numeri che contano.
- **Camera virtuale:** punch-in sulle parole forti, scossa sugli impatti, lento push-in sul parlato.
- **Grafiche 3D:** schede inclinate in prospettiva (CSS 3D), luce che passa sopra (light sweep), grana e vignetta.
- **Light leak viola** sui cambi di scena e barra di avanzamento sottile in basso (aumenta il completamento).
- **Sottotitoli karaoke:** parola per parola, la parola chiave si colora di viola e rimbalza.

## Regole che restano
Voce Julian; musica bassa (0,13); niente meme di altri (originalità); C sempre identico; copertina con C; didascalia con 🎙️ Voce generata con AI; avviso di rischio; massimo 3 hashtag.

## Ricetta per rifarlo (provata con ALGORY #1, 31/10/2026)
**Set fisso** (non si rigenera: si riusa sempre, così sembra lo stesso studio di un creator vero). Tela Dreamina 92997bbb, profilo CLI `nuovo`. Immagini in `produzione/format-c/set/`:

| Inquadratura | File | Resource ID Dreamina |
|---|---|---|
| A frontale, scrivania con monitor | A.png | 642ff6ac-b942-40b9-a5e2-a7fd0d9ce731 |
| B tre quarti, luce laterale viola | B.png | 614a4bfd-2f22-446c-b5c9-f8870181de10 |
| C primissimo piano | C.png | f669ae8e-bdae-45d9-8a42-8009808af094 |

C di riferimento: `pers_C.png` = resource 5abbb247-5fbe-4530-8c70-8003095fc111.

**Passi per ogni episodio:**
1. **Copione e voce.** Voce Julian v4 dal sito ElevenLabs (tasti via JS: `execCommand('insertText')`). Poi:
   - ×1,1 e pause tagliate: `silenceremove … stop_silence=0.28,atempo=1.1`;
   - tempi delle parole con faster-whisper small, senza initial_prompt;
   - file `src/<ep>-parole.ts`.
2. **Piano delle scene.**
   - Il parlato di C (inquadrature A/B/C che si alternano) copre ~60% del video;
   - 1-2 spezzoni di copertura (R) da A o B con `first_last_frame`;
   - 1-2 grafiche a tutto schermo sopra lo sfondo sfocato del set.
3. **Spezzoni.**
   - Taglia l'audio della frase, caricalo come resource e crea un nodo `seedance_2.0_mini`:
     - modo `m2v`;
     - riferimenti: immagine del set + audio della frase;
     - 9:16 720p, durata = frase arrotondata per eccesso, minimo 4 s;
     - prompt «talks straight to the camera… precise lip sync… creator explaining».
   - Costo: 5 crediti al secondo.
   - Scarica con `resource download <id> -o file.mp4`.
4. **Ritardo del labiale.** Il parlato nello spezzone parte 0,26-0,57 s dopo l'inizio. Misuralo (correlazione dell'inviluppo audio, script nella sessione del 31/10) e mettilo in `inizio` (frame) della scena.
5. **Montaggio.** Componente `FormatC` in `remotion-c/src/FormatC.tsx`. Si passano:
   - `SCENE`: clip o grafica, più le scritte `sopra`;
   - `PAROLE`, `CHIAVE`, la cartella `public/<ep>`;
   - `voce.wav`, `musica.wav` (valzer, ruotare la variante), `sfx.wav` (synth.py, whoosh sui tagli e impatti sulle scritte).
   - Effetti già inclusi:
     - zoom con blur in entrata;
     - lampo + luce viola sui tagli;
     - punch-in a ogni frase;
     - sottotitoli karaoke (3 parole, chiave viola);
     - grana + vignetta;
     - barra di avanzamento.
   - Mattoni pronti: `Sticker`, `Conta`, `Nota`, `Card3D`, `BoxCommento`, `SfondoSet`.
6. **Copertina.** Composizione `CoverC` (foto del set + titolo in alto + etichetta viola). Controlla il ritaglio 4:5.
7. **Render.** `npx remotion render src/index.ts <ID> out.mp4`, poi `loudnorm=I=-14:TP=-1.5:LRA=11`.

**Costo tipico** di un episodio da 40 s: 5 spezzoni parlati + 2 di copertura ≈ 180 crediti Dreamina; set già pronto = 0.

## Bocciatura di Marco su ALGORY1C (31/10/2026 sera)
- **Labiale poco sincronizzato.** Causa: la voce era una traccia unica sopra gli spezzoni, allineata a mano con un ritardo stimato. Da ora: nelle scene parlate si usa l'**audio dello spezzone stesso** (quello che Seedance ha sincronizzato), non la traccia separata. La traccia unica serve solo sotto spezzoni e grafiche.
- **Sfondi troppo finti.** Il set generato (A/B/C) sembra rendering. Da rifare con aspetto da foto di telefono (luce imperfetta, oggetti veri, disordine leggero) oppure partendo da una foto vera della stanza di Marco.
- **Sistema Cosentino** (theory/reference-cosentino-nuova-era-social.md): ogni video ha un solo ruolo e il contesto nei primi 3 s; dal 02/11 un'Attualità di C al giorno.

## Set 2 «stanza vera» (31/10/2026 sera, sostituisce A/B/C)
- Fatto sul sito Dreamina (account del browser, non quello della CLI): Immagine IA, Seedream 5.0 Lite, 9:16 2K, riferimento `pers_C.png`, prompt «Candid smartphone photo… real small home office in an Italian apartment… no neon, no purple lighting, not a 3D render». Costo 24 crediti per 4 immagini.
- B (tre quarti): strumento **Angoli** sul sito, rotazione ~315°, inclinazione 0, distanza media: 2 crediti.
- C (primissimo piano): ritaglio digitale di A1 in Remotion (Angoli «vicino» cambia poco).
- File in `produzione/format-c/set2/`: **A1.jpg** (scelta: senza treppiede in vista), A2-A4 (alternative con telefono sul treppiede in campo), **B1.jpg**.
- Caricare un file sul sito: l'input non si vede. Si carica il file su un URL pubblico, poi in pagina `fetch` → `File` → `DragEvent('drop')` sul box `.references-*`.
