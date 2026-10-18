# Passaggio dalla sessione cloud alla sessione locale (17/10/2026)

Leggi in quest'ordine: CLAUDE.md → docs/MEMORIA.md → docs/STATO.md → docs/PIANO-30-GIORNI.md → docs/STORIE-IN-EVIDENZA.md.

## Situazione al 17/10 sera
- Coda Publora piena (3/3): 17/10 carosello «4 test», 18/10 Reel 2 «6 bot», 19/10 carosello «Dentro il mio sistema #1». 11 post rimasti a ottobre (Starter). Publora Pro entro il 25/10.
- Pronti da programmare appena si libera un posto: R3 «Ogni bot ha una scadenza» (20/10) e Vox «costi» (24/10) — link in STATO.md. Poi Sistema #2 (s2.json) il 21/10.
- Crediti Higgsfield: 42 (condivisi con Guido io: ieri erano ~161).
- Pagina link in bio: https://marcostangatrader.netlify.app (sorgente sito/link, Netlify collegato a questo repo, deploy automatico). Regalo: checklist PDF «4 test»; email in Netlify → Forms → «checklist». Le immagini dei caroselli si possono pubblicare da sito/link/p/<nome>/.
- Storie in evidenza: create INIZIA QUI e FAQ; TEST dal 16/10. Prossime: storia del giorno di ogni post (produzione/evidenza/storie/).

## Compiti automatici
- Ogni giorno alle 09:53 parte un compito programmato nella sessione CLOUD (trig_012igWqTcTLDC8A68mrXGbCj) che prepara e programma il post del giorno e manda l'email. Resta attivo: gira anche a PC spento. In locale NON programmare lo stesso giorno due volte: controlla prima STATO.md (git pull).

## Cosa fare in locale (prima volta)
1. `git pull` e lavora sempre su questo repo; a fine lavoro commit + push (la sessione cloud legge da GitHub).
2. Collegamenti MCP da verificare: Publora, Higgsfield, Gmail. Se mancano, guida Marco a collegarli.
3. Strumenti: node + Playwright (gli script importano da /opt/node22/... → cambia l'import col percorso di `npm root -g`), ffmpeg, python3 con Pillow.
4. Telefono (adb, app Instagram): solo @cthe.trader per questo progetto; pubblicare/commentare SOLO con ok esplicito di Marco per ogni azione; mai toccare @guidoio_ o altri account.
5. Velocizzare: storie del giorno con sticker, 15' di commenti alle pagine di docs/PAGINE-COMMENTI.md, risposte ai DM/commenti — sempre con ok di Marco.
