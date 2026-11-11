#!/bin/bash
# Render locale a pezzi di un episodio SchedeC (il PC ha 7,8 GB: niente render audio di Remotion).
# Uso: bash render-schede.sh <COMP> <cartella_public> <EP> <nome_file>
set -e
COMP=$1; CART=$2; EP=$3; NOME=$4
cd /c/Users/stang/code/marco-social/produzione/remotion-c
FIN=../attualita/$EP/finale; mkdir -p $FIN/pezzi
npx remotion bundle src/index.ts --public-dir=public-$CART --out-dir=build-$CART --log=error
# stessa formula di durataEpisodio() in SchedeC.tsx
N=$(python -c "import re;s=open('src/$CART-schede.ts',encoding='utf-8').read();f=float(re.search(r'FINE_VOCE = ([0-9.]+)',s).group(1));print(round((f+0.35+2.2)*30))")
DUR=$(python -c "print($N/30)")
echo "frame totali: $N"
> $FIN/pezzi/lista.txt
for ((a=0; a<N; a+=600)); do
  b=$((a+599)); [ $b -ge $N ] && b=$((N-1))
  [ -f $FIN/pezzi/p$a.mp4 ] || npx remotion render build-$CART $COMP $FIN/pezzi/p$a.mp4 --frames=$a-$b --concurrency=2 --crf=18 --muted --log=error
  echo "file 'p$a.mp4'" >> $FIN/pezzi/lista.txt
  echo "pezzo $a-$b fatto"
done
ffmpeg -y -v error -f concat -safe 0 -i $FIN/pezzi/lista.txt -c copy $FIN/pezzi/video.mp4
P=public-$CART/$CART
ffmpeg -y -v error -i $P/voce.wav -i $P/musica.wav -i $P/sfx.wav -filter_complex "[0]volume=1[a];[1]volume=0.06[b];[2]volume=0.35[c];[a][b][c]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=$DUR,loudnorm=I=-14:TP=-1.5:LRA=11[o]" -map "[o]" -ar 48000 -c:a aac -b:a 192k $FIN/pezzi/audio.m4a
ffmpeg -y -v error -i $FIN/pezzi/video.mp4 -i $FIN/pezzi/audio.m4a -map 0:v -map 1:a -c:v copy -c:a copy -shortest -movflags +faststart $FIN/$NOME-FINALE.mp4
ffmpeg -y -v error -i $FIN/$NOME-FINALE.mp4 -c:v libx264 -b:v 1750k -maxrate 2200k -bufsize 4000k -preset slow -c:a aac -b:a 128k -movflags +faststart $FIN/$NOME-telefono.mp4
rm -rf build-$CART
echo "FATTO $FIN/$NOME-FINALE.mp4"
