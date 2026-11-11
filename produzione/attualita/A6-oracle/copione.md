# Attualità di C #6: «Vi stanno vendendo un contratto che non si può eseguire»

- **Spunto:** reel di Amedeo Iasci (Jashi) https://www.instagram.com/reel/DfWvNy9o2nV/ del 05/11/2026 (88 s). Trascrizione in `produzione/motion-transfer/ig-dfwvny9o2nv/jashi.txt`.
- **Formato (nuovo, da A6 in poi):** «GUARDA QUESTO» — C in **green screen** che parla, con il video/la fonte **sotto**, poi il commento. Vedi «Formato» più sotto.
- **Tono (deciso da Marco il 06/11):** **accusa, non spiega.** Niente concessioni, niente «è come la vedo io», niente «occhio però». C smonta un falso mito. Riferimento: Achille Gandolfi Vannini (reel `DcOWtVipMuV`).
- **Tesi di C:** vi stanno vendendo Oracle come la vincitrice dell'IA per un contratto da sette miliardi. Ma quel contratto non si può eseguire: i chip non possono attraversare quel confine. Chi ve lo racconta lo sa. Il mercato conta i ricavi, non le frontiere — e chi conta le frontiere arriva primo.
- **Ruolo:** Attenzione + Autorità. **Leva del giorno:** **Obiezioni** — l'obiezione da smontare è «Oracle ha firmato un contratto da 7 miliardi, è una buona notizia».
- **Frase da inoltrare** (scritta per prima): «Un contratto firmato e un contratto che si può eseguire sono due cose diverse. E qualcuno ci sta costruendo una favola sopra.»
- **Ponte con C:** chi opera con sistemi sa che il rischio non è nel dato che leggi, è nella regola che non conosci. Il segnale c'è, il prezzo no.
- **Paletti:** nessun giudizio politico su USA o Cina, nessuna categoria di persone come nemico, nessun consiglio operativo. Si attacca la **condotta** (chi vende la favola), mai una persona. Niente «Priced in.» (bocciato il 04/11).

## Formato «GUARDA QUESTO» (nuovo)

```
0-3s      C in green screen: «Guarda questo.» → parte il video della fonte
3-20s     LA FONTE a tutto schermo (la dichiarazione, la clip) con C piccolo in un angolo
20-120s   C a tutto schermo che smonta, con le grafiche sopra
```

Tecnica: `OffthreadVideo` dentro il `Sequence` al posto del pannello grafico, e C ritagliato in basso con `objectFit` + maschera. Per A6 la fonte è la card/il grafico di Oracle, non una dichiarazione parlata — quindi il blocco «fonte» mostra **il grafico e la card**, non un video di persona.

## Fatti — DA VERIFICARE PRIMA DI PUBBLICARE

Jashi è lo **spunto**, non la fonte. Ogni cifra va trovata su una fonte verificabile, altrimenti si taglia.

| Cifra | Stato (verificato 07/11/2026) | Fonte |
|---|---|---|
| Oracle–Tencent: ~100.000 chip Nvidia, ~7 miliardi $, data center Oracle nel Sud-Est asiatico, 5 anni | OK | FT, ripreso da TechRepublic, Tom's Hardware, datacenterdynamics |
| Tencent è cinese (il Sud-Est asiatico sono solo i data center) | OK — **v1 sbagliava** («azienda del Sud-Est asiatico») | idem |
| Contratto **cancellato** (FT, 4/11/2026) dopo pressioni di funzionari USA e cinesi | OK, ma **solo FT**: Reuters non l'ha verificato, Oracle e Tencent non commentano. Per questo la voce dice «il Financial Times scrive» | FT, Network World, thenextweb |
| Nvidia: almeno il 51% del business data center a clienti non cinesi, detto dai venditori, non per iscritto, solo contratti nuovi | OK (FT, 3/11 = «il giorno prima») | Bloomberg 2026-11-03, mobileworldlive |
| Burry contro Oracle (put + short) annunciato su Substack | OK, 9-10/01/2026 | Bloomberg, Fortune |
| «metà della posizione chiusa a giugno, ai minimi» | **SBAGLIATO, tolto**: ha chiuso metà delle put gen-2027 il 20/07/2026 perché «too big» | Investing.com |
| prezzo Oracle | non citato nella v2 | — |

**Testo corretto:** `voce/testo-v2.txt` (07/11/2026).

**Se una cifra non si trova: si taglia.** Il video regge sul meccanismo: un contratto firmato non è un contratto eseguibile.

## v1 — testo della voce (tono accusatorio)

[casual] Guarda questo. Michael Burry, quello che ha previsto la crisi del 2008, è andato short su Oracle. Ha scommesso che scende. E tutti a ridere, perché Oracle ha appena firmato il contratto più grande della sua storia: sette miliardi. Sette miliardi di chip affittati a un'azienda del Sud-Est asiatico. Bellissimo, no? Peccato che quel contratto non si possa eseguire. E qualcuno lo sapeva.
Fermati un secondo. Centomila chip avanzati, sette miliardi, il contratto più grande di sempre. Tutti contenti, tutti a comprare. Ma quei chip non possono passare di lì. Da una parte gli Stati Uniti, che non vogliono vendere chip a chi sta vicino alla Cina. Dall'altra la Cina, che dice alle sue aziende di non comprare chip americani. Risultato: il contratto è firmato. E non si può eseguire.
[excited] E non è un caso isolato. Due giorni fa Nvidia ha detto ai suoi venditori che il cinquantuno per cento del business non deve essere cinese. Detto a voce. Non per iscritto. Vuol dire che non è una regola: è una paura. E le paure non finiscono nei bilanci. Ma nei prezzi sì.
E allora la domanda è una sola. Chi vi ha raccontato che Oracle è la vincitrice dell'intelligenza artificiale, lo sapeva o no? Perché il contratto c'era, e i giornali l'hanno scritto. Ma il confine c'era prima del contratto. Chi guarda i numeri vede sette miliardi. Chi guarda le regole vede sette miliardi che non si possono incassare.
E io passo le giornate con dei sistemi, e questa roba la riconosco al volo. È identica a quando un bot compra su un dato che poi non si può eseguire. Il segnale c'è, il prezzo no. E chi arriva primo vince. Non chi ha ragione: chi arriva primo.
E adesso la parte che ti riguarda. Metà della posizione di Burry era già chiusa a giugno, quando Oracle era ai minimi. Non ha previsto niente: ha cambiato idea quando ha visto i numeri. La differenza tra lui e te non è l'intuito. È che lui i numeri li legge, e tu leggi i titoli.
[excited] Quindi la prossima volta che qualcuno ti dice che un'azienda è la vincitrice di qualcosa, non chiedergli quanto ha fatturato. Chiedigli **dove** lo ha fatturato. Perché un contratto firmato e un contratto che si può eseguire sono due cose diverse. E qualcuno, sopra quella differenza, ci sta costruendo una favola. Con i tuoi soldi.

## Note di montaggio

- **Inquadratura:** `A4-midterm/set/C-microfono.png` (C al microfono) per tutto il video. Labiale **InfiniteTalk** su Runpod, 720p, **con la voce GIÀ TAGLIATA** (`voce.wav`), non l'mp3 grezzo — altrimenti il labiale va fuori tempo di 20+ secondi.
- **Voce:** Julian, `eleven_v4`, stabilità **0,6** (come A4 e A5). Mai `eleven_v3`.
- **Blocco «fonte» (0-20s):** card Oracle stile Vaga/Jashi — «ORCL · Oracle · $123.78 · ▼ 3,63%» con il grafico rosso che scorre — sopra C ritagliato in basso.
- **Grafiche:** «7 MILIARDI», «100.000 CHIP», «51%», «CONTRATTO FIRMATO ≠ CONTRATTO ESEGUIBILE», «DOVE, NON QUANTO».
- **Segni a mano animati** sul dato che dice, cambio visivo ogni 2-4 s.
- **Musica:** valzer Burton, variante da ruotare, bassa (0,13).
- **Copertina:** `CoverC` — faccia di C + «VI STANNO VENDENDO / UNA FAVOLA» + etichetta viola.
- **Numeri:** i 7 miliardi, i 100.000 chip, il 51% vengono da Jashi e **non sono verificati**.

## Costo stimato

| voce | costo |
|---|---|
| InfiniteTalk (voce.wav, 720p) | $0,25 |
| voce Julian | da sito ElevenLabs |
| montaggio Remotion | 0 |
