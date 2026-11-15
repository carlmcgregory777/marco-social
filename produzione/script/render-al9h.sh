#!/bin/bash
# Dentro Algory #9 stile Hormozi: render a pezzi muti + audio renderizzato a parte (PC da 7,8 GB).
set -e
cd /c/Users/stang/code/marco-social/produzione/remotion-c
FIN=../algory9-hormozi/finale; mkdir -p $FIN/pezzi
rm -rf build-al9h
npx remotion bundle src/index.ts --public-dir=public-al9h --out-dir=build-al9h --log=error
N=$(python -c "import re;s=open('src/al9h-parole.ts',encoding='utf-8').read();f=float(re.search(r'DURATA_AL9H_S = ([0-9.]+)',s).group(1));print(round((f+0.35+2.6)*30))")
echo "frame: $N"
> $FIN/pezzi/lista.txt
for ((a=0; a<N; a+=600)); do
  b=$((a+599)); [ $b -ge $N ] && b=$((N-1))
  [ -f $FIN/pezzi/p$a.mp4 ] || npx remotion render build-al9h AL9H $FIN/pezzi/p$a.mp4 --frames=$a-$b --concurrency=2 --crf=18 --muted --log=error
  echo "file 'p$a.mp4'" >> $FIN/pezzi/lista.txt; echo "pezzo $a fatto"
done
ffmpeg -nostdin -y -v error -f concat -safe 0 -i $FIN/pezzi/lista.txt -c copy $FIN/pezzi/video.mp4
npx remotion render build-al9h AL9H $FIN/pezzi/audio.wav --codec=wav --log=error
ffmpeg -nostdin -y -v error -i $FIN/pezzi/audio.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k $FIN/pezzi/audio.m4a
ffmpeg -nostdin -y -v error -i $FIN/pezzi/video.mp4 -i $FIN/pezzi/audio.m4a -map 0:v -map 1:a -c copy -shortest -movflags +faststart $FIN/AL9H-FINALE.mp4
ffmpeg -nostdin -y -v error -i $FIN/AL9H-FINALE.mp4 -c:v libx264 -b:v 1750k -maxrate 2200k -bufsize 4000k -preset slow -c:a aac -b:a 128k -movflags +faststart $FIN/AL9H-telefono.mp4
rm -rf build-al9h
echo "FATTO $FIN/AL9H-FINALE.mp4"
