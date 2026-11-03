# Reel affiliato Higgsfield v2 (schema Cosentino «sponsor»)

## Da dove viene lo schema
Reel di Mik Cosentino del 03/11/2026 (https://www.instagram.com/p/DfPm7kvo7YV/, trascrizione in `rif/mik-sponsor.txt`, fotogrammi in `rif/fr/sheet.jpg`). Sponsorizza Arcads con questa struttura (94 s):
1. **Gancio = il risultato finito a tutto schermo.** Parte un cartone con la sua faccia e una morale; lui è in green screen in basso a destra: «guardate questo video, in 15 secondi vi spiega…».
2. **Prova sociale:** screenshot di profili veri con milioni di views fatti così («fanno soldi con le views o vendendo prodotti»).
3. **«La bella notizia»:** è semplice e replicabile per te o per la tua attività. «Sono bastati due step.»
4. **Step 1:** iscrizione con prova gratuita, poi Connettori di Claude → collega lo strumento. «Boom.»
5. **Step 2:** chat nuova, la richiesta scritta per intero sullo schermo, invio → «eccolo».
6. **Immagina cosa puoi farci tu:** clip, meme, storie per la tua attività e i tuoi clienti.
7. **Obiezione tempo + lead magnet:** «io ci ho messo ore a capirlo, voi non dovete» → guida gratuita con 25 format → «commenta CLIP e te la mando in privato».

Cosa copiamo: la sequenza, il risultato finito come gancio, i due step mostrati sullo schermo vero, la CTA che regala una guida (lead nostro, regola Theory) e non manda subito al link.
Cosa cambiamo: la prova è C stesso, la durata è più corta (~55 s), e il tono resta quello di C (impassibile, ironico, frasi corte).

## Ruolo e paletti
- **Ruolo:** Conversione (il contenuto con CTA della settimana).
- **Pubblico:** chi vuole fare contenuti per sé o per la sua attività ma non ha tempo, camera, faccia da mettere o capacità di montaggio.
- **Spillo (USP):** «Scrivi cosa vuoi in italiano, e il video lo gira lui.»
- **Frase da inoltrare:** «Non serve saper montare. Serve sapere cosa chiedere.»
- **Trasparenza:** «link affiliato» detto nel DM e scritto nel video; #ad in didascalia.
- **Niente promesse di soldi o viralità.** La prova sociale è solo vera (le nostre pagine, i numeri che possiamo mostrare).
- **Da verificare il giorno della registrazione:** se Higgsfield offre una prova gratuita e quanti crediti dà. Lo diciamo solo se è vero quel giorno. Va verificato anche il percorso esatto in Claude per collegare il connettore.

## Green screen (risposta alla domanda di Marco)
Sì, si può fare, in due modi:
- **A, gratis:** prendiamo le clip di C già girate sul set e togliamo lo sfondo in locale con la segmentazione delle persone (rembg/MediaPipe, gratis). Poi mettiamo C ritagliato in basso a destra sopra screenshot, video e registrazioni. Resta un margine di qualità da controllare sui bordi dei capelli viola.
- **B, il più pulito:** generiamo le clip nuove di C già su sfondo verde pieno (prompt «solid chroma green background») e le ritagliamo con ffmpeg `chromakey`. I bordi vengono perfetti, ma serve la generazione a pagamento delle clip.
Lo useremo anche nelle Attualità: C in basso davanti all'articolo di giornale o al grafico, come fa Mik.

## Copione v3 (~55 s dopo ×1,1) — decisione di Marco 03/11/2026
Gancio come Mik (il risultato finito a tutto schermo), poi la sua idea dei due reel «così… o così», poi i due passaggi e la guida gratuita.
Legenda: **[GS]** = C ritagliato in green screen in basso sopra il contenuto; **[DIV]** = schermo diviso (contenuto sopra, C sotto); **[TS]** = C a tutto schermo sul set.

| # | Formato | C dice | Si vede |
|---|---|---|---|
| 1 | [GS] | «Guarda questo video. Non l'ha girato nessuno.» | A tutto schermo un mini film fatto con Higgsfield: C che cammina sotto la pioggia a Londra, cinematografico. Titolo fisso: «QUESTO VIDEO NON L'HA GIRATO NESSUNO». |
| 2 | [GS] | «E nemmeno me. Io non esisto: mi ha creato un'intelligenza artificiale.» | La scheda personaggio di C su Higgsfield, con un timbro «GENERATO». |
| 3 | [DIV] | «Vuoi fare un video così?» | POP-UP 1 sopra: il motion control di C (balla o cammina a Londra). C alza gli occhi e lo guarda, come se fosse lì. |
| 4 | [DIV] | «…o così?» (sopracciglio alzato) | POP-UP 2 sopra: un reel Seedance cinematografico nostro (GUIDO IO. o FORGE). Suono «swoosh». C lo guarda, impassibile. |
| 5 | [TS] | «Senza camera. Senza montaggio. Senza metterci la faccia. Bastano due passaggi.» | Tre spunte che cadono a ritmo, zoom di scatto su «due». |
| 6 | [GS] | «Uno. Ti iscrivi a Higgsfield. Apri Claude, vai nei connettori, cerchi Higgsfield e lo colleghi. Fatto.» | Registrazione vera dello schermo: la pagina Higgsfield, poi Claude → Connettori → Higgsfield → «Collegato». Spunta verde e «ding». |
| 7 | [GS] | «Due. Apri una chat e scrivi, in italiano, cosa vuoi.» | La richiesta che si scrive da sola, per intero e leggibile («Fammi un video di 10 secondi del mio personaggio che cammina sotto la pioggia a Londra, stile film»). |
| 8 | [GS] | «Invio. E…» (pausa) «…eccolo.» | Barra di avanzamento, poi parte a tutto schermo il video del gancio: il reel si chiude su sé stesso. |
| 9 | [TS] | «Pensa cosa ci fai tu: video per il tuo negozio, storie per i tuoi clienti, un personaggio che parla al posto tuo.» | Tre riquadri che entrano a ritmo: GUIDO IO., FORGE, C. |
| 10 | [TS] | «Io ci ho messo settimane a capire cosa chiedere. Tu non devi.» | Primo piano, pausa. |
| 11 | [TS] | «Ho messo tutto in una guida gratuita: come si collega, e venti richieste pronte da copiare. Commenta VIDEO e te la mando in privato.» | Copertina del PDF «Il kit di C», scritta «Commenta VIDEO», in piccolo «link affiliato nella guida». |

## Come arriva la guida (sistema di raccolta, costo 0 €)
1. **Commento «VIDEO»** → ManyChat (piano gratuito) risponde al commento e manda il DM con il link alla pagina del kit.
2. **Pagina https://marcostangatrader.netlify.app/kit.html** → email + @instagram + consenso privacy (Netlify Forms, modulo «kit», gratis fino a 100 iscritti al mese tra tutti i moduli).
3. **Pagina di ringraziamento** con il PDF da scaricare subito (`kit-di-c.pdf`).
4. **Brevo** (gratis) riceve il contatto da solo (funzione già pronta, FONTE = «kit») e manda l'email di benvenuto con il PDF: così abbiamo la lista email nostra, da usare per la sequenza e i prossimi lanci.
5. **Link affiliato** nel PDF e nell'email passa da `/vai/higgsfield`: si cambia in un punto solo quando arriva il link, e Netlify conta i clic.
Dettagli e testi in `docs/LEAD-E-RISPONDITORE.md` (Flusso 3).

**Ganci alternativi (reel di prova a non follower):**
- A: «Guarda questo video. Non l'ha girato nessuno.» (principale)
- B: «Io non esisto. E questo video l'ha fatto un'AI in due minuti.»
- C: «Questo personaggio ha quasi diecimila follower. Non esiste.» (con la pagina TikTok come gancio)

## Didascalia (bozza)
Questo video non l'ha girato nessuno. E nemmeno io esisto: mi ha creato un'intelligenza artificiale.

Bastano due passaggi:
1. Ti iscrivi a Higgsfield e lo colleghi a Claude (o ChatGPT) dai connettori.
2. Scrivi in italiano cosa vuoi. Il video lo gira lui.

Non serve saper montare. Serve sapere cosa chiedere.

Ho messo tutto in una guida gratuita, «Il kit di C», con 20 richieste pronte da copiare. Commenta VIDEO e te la mando in privato.

#ad Il link nel messaggio è affiliato: se ti iscrivi da lì ricevo una commissione, a te non costa di più.
🤖 C è un personaggio AI · dietro c'è Marco · 🎙️ Voce generata con AI
#intelligenzaartificiale #videoai #contentcreator

## Messaggio in DM a chi commenta VIDEO
Eccola 👇 [link alla guida]
Dentro trovi come collegare Higgsfield a Claude e 20 richieste pronte. Il link per iscriverti è questo (affiliato): [link]
Se ti blocchi, rispondimi qui.

## Lead magnet «Il kit di C» (PRONTO il 03/11: sito/link/kit-di-c.pdf)
PDF di 4-6 pagine nello stile @cthe.trader:
1. Cos'è Higgsfield e cosa ci fai (con i nostri esempi).
2. Come collegarlo a Claude e a ChatGPT, con gli screenshot veri.
3. 20 richieste pronte, divise per uso: personaggio, negozio, storie per clienti, reel parlati, copertine.
4. Gli errori che costano crediti (le nostre lezioni vere: prompt in 5 blocchi, una nota per revisione, riferimenti con ruolo, generazioni gratuite col sito).

## Produzione e costi
- **Gratis:** il video del gancio, se lo facciamo con un modello «Illimitato» del sito (da controllare se esiste per il video); gli screenshot; la registrazione dello schermo, che faccio io; il montaggio; il green screen modo A; la guida PDF.
- **A pagamento:** le clip parlate nuove di C (scene 1-10, circa 45 s di parlato). Su Lumina 21 crediti/s ≈ 950 crediti; su Higgsfield Seedance va preventivato. Per risparmiare: le scene [GS] possono usare spezzoni già girati con la voce nuova e il labiale rifatto, oppure si genera solo il volto parlante corto e il resto è voce sopra le immagini.
- **Mancano:** il link affiliato Higgsfield e la decisione su quanti crediti spendere.

## Versione montata (03/11/2026) — APPROVATA da Marco
- Video: `HFAFF.mp4` (~40 s, pause tagliate, ×1,2), copertina `cover-hfaff.jpg` («L'HO FATTO CON UNA FRASE» + logo Higgsfield).
- Montaggio: `montaggio/monta.py` (voce, tempi, effetti, musica variante 2) → Remotion `HFAFF` / `CoverHF` in `remotion-c/src/HFAFF.tsx`.

### Didascalia Instagram (finale)
L'ho fatto con una frase. Niente camera, niente montaggio, niente faccia.

Bastano due passaggi:
1. Ti iscrivi a Higgsfield e lo colleghi a Claude dai Connettori.
2. Scrivi in italiano cosa vuoi. Il video lo gira lui.

Non serve saper montare. Serve sapere cosa chiedere.

Ho messo tutto in una guida gratuita, «Il kit di C», con 20 richieste pronte da copiare. Commenta VIDEO e te la mando in DM.

#ad Il link nella guida è affiliato: se ti iscrivi da lì ricevo una commissione, a te non costa di più.
🤖 C è un personaggio AI · dietro c'è Marco · 🎙️ Voce generata con AI
#videoai #intelligenzaartificiale #contentcreator

### Descrizione TikTok (inglese, corta, niente hashtag)
One sentence. That's the whole shoot. Comment VIDEO for the free guide. #ad
- Su TikTok niente ManyChat: a chi commenta VIDEO si risponde a mano con il link https://marcostangatrader.netlify.app/kit.html (o lo si mette in bio).
- Al momento di pubblicare attivare «Contenuto commerciale» → «Contenuto di brand» (link affiliato) e l'etichetta «Contenuto generato con l'IA».
