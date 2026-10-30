# Diretta 24/7 della MT5 dalla VPS (guida del 30/10/2026)

## In breve
- La VPS manda UN solo video a Restream, che lo gira a YouTube e Twitch insieme.
- Così la VPS fa la fatica una volta sola, non due.
- TikTok LIVE da PC si sblocca intorno ai 1.000 follower (oggi 2): si aggiunge dopo, sempre da Restream.

```
MT5 sulla VPS → OBS Studio (sulla VPS) → Restream → YouTube + Twitch (+ TikTok più avanti)
```

## Prima di iniziare: 3 controlli
1. **La VPS regge?**
   - OBS usa CPU. Servono almeno 2 vCPU e 4 GB di RAM liberi oltre a MT5.
   - Se MT5 rallenta, i bot eseguono in ritardo: **il conto viene prima della diretta**.
2. **Traffico.**
   - A 720p 30 fps, 2.500 kbps: ~27 GB al giorno, ~800 GB al mese in uscita.
   - Controlla nel pannello del provider VPS se il piano ha un limite.
   - Se è stretto: 720p a 15 fps e 1.500 kbps, ~500 GB al mese. Per dei grafici basta.
3. **Regole della prop firm.**
   - Leggi le regole di GOAT Funded sulla condivisione del conto.
   - In diretta NON devono vedersi: numero del conto, login, server, password, la finestra di Algory con la licenza.

## Passo 1: account (dal telefono, 10 minuti)
1. **YouTube:**
   - Su studio.youtube.com, clicca Crea → Trasmetti dal vivo.
   - YouTube chiede la verifica col numero di telefono. La prima volta la diretta si sblocca dopo **fino a 24 ore**: fallo subito.
2. **Twitch:** crea l'account cthe_trader (o simile), con la verifica email e telefono.
3. **Restream:**
   - Crea un account su restream.io, piano gratis: 2 canali insieme.
   - Clicca Add Channel → YouTube, poi Add Channel → Twitch.
   - Restream ti dà un **Server** e una **Stream key**. La chiave è segreta: non mandarla a nessuno, nemmeno a me in chat.

## Passo 2: OBS sulla VPS (30 minuti, in RDP)
1. Scarica OBS Studio da obsproject.com (solo dal sito ufficiale) e installalo.
2. All'avvio scegli «Ottimizza per la trasmissione».
3. **Scena «MT5»:**
   - Aggiungi «Cattura finestra» → terminal64.exe (MT5).
   - Metti MT5 a grafici affiancati: 4-6 grafici dei bot, più la scheda «Commercio» con le posizioni aperte.
   - Prima nascondi il numero del conto: in MT5, Visualizza → togli la barra del conto, oppure copri la zona con un rettangolo nero in OBS.
   - Aggiungi «Testo» in alto: «C — The Trader · bot Algory dal vivo · non è consulenza finanziaria».
   - Aggiungi «Immagine»: il logo MS e C in un angolo.
4. **Impostazioni → Uscita:**
   - Codificatore x264;
   - bitrate 2500 (o 1500);
   - preset «veryfast»;
   - keyframe 2.
5. **Impostazioni → Video:** risoluzione 1280×720, FPS 30 (o 15).
6. **Impostazioni → Trasmissione:**
   - Servizio «Personalizzato»;
   - Server e Stream key da Restream.
   - In «Avanzate» spunta «Riconnetti automaticamente».
7. Clicca «Avvia trasmissione». Controlla su Restream che YouTube e Twitch siano verdi.

## Passo 3: tenerla viva 24/7
- **La trappola dell'RDP.** Se chiudi la finestra RDP con la X, Windows può bloccare la cattura e la diretta diventa nera.
  - Per uscire senza chiuderla: sulla VPS apri Prompt dei comandi come amministratore.
  - Scrivi `query session` e leggi il numero della tua sessione.
  - Poi scrivi `tscon <numero> /dest:console`. La sessione resta attiva e la diretta continua.
- **OBS all'avvio.** Metti un collegamento a OBS nella cartella Esecuzione automatica (`shell:startup`), con le opzioni `--startstreaming --minimize-to-tray`.
- **Il riavvio del lunedì** (quello per le scadenze degli EA): dopo il riavvio controlla che OBS sia ripartito.
- **YouTube** tiene la registrazione solo delle ultime 12 ore di una diretta lunga: va bene, non serve l'archivio.

## Titolo e descrizione
- **Titolo YouTube/Twitch:** «🔴 LIVE 24/7 · 19 bot di trading su un conto da 100.000 $ (Algory)».
- **Descrizione:** chi è C, «i bot girano su Algory», il link in bio alla checklist, l'avviso di rischio. Niente link affiliato finché non c'è; con il link aggiungi #ad.
- **Categoria Twitch:** «Just Chatting» o «Finance».

## Costi
OBS gratis, Restream gratis (2 canali), YouTube e Twitch gratis. L'unico costo possibile è il traffico della VPS.
