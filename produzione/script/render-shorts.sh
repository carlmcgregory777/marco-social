#!/bin/bash
# Render locale a pezzi del reel «Shorts Studio» con C (SHORTSC). Audio già mixato in higgsfield-aff/shorts/finale/audio.m4a.
set -e
cd /c/Users/stang/code/marco-social/produzione/remotion-c
FIN=../higgsfield-aff/shorts/finale; mkdir -p $FIN/pezzi
npx remotion bundle src/index.ts --public-dir=public-shorts --out-dir=build-shorts --log=error
N=$(python -c "import re;print(round((float(re.search(r'FINE_SHORTS = ([0-9.]+)',open('src/shorts-parole.ts',encoding='utf-8').read()).group(1))+1.3)*30))")
echo "frame totali: $N"
> $FIN/pezzi/lista.txt
for ((a=0; a<N; a+=400)); do
  b=$((a+399)); [ $b -ge $N ] && b=$((N-1))
  [ -f $FIN/pezzi/p$a.mp4 ] || npx remotion render build-shorts SHORTSC $FIN/pezzi/p$a.mp4 --frames=$a-$b --concurrency=2 --crf=18 --muted --log=error
  echo "file 'p$a.mp4'" >> $FIN/pezzi/lista.txt
  echo "pezzo $a-$b fatto"
done
ffmpeg -y -v error -f concat -safe 0 -i $FIN/pezzi/lista.txt -c copy $FIN/pezzi/video.mp4
ffmpeg -y -v error -i $FIN/pezzi/video.mp4 -i $FIN/audio.m4a -map 0:v -map 1:a -c:v copy -c:a copy -shortest -movflags +faststart $FIN/SHORTS-FINALE.mp4
ffmpeg -y -v error -i $FIN/SHORTS-FINALE.mp4 -c:v libx264 -b:v 1750k -maxrate 2200k -bufsize 4000k -preset slow -c:a aac -b:a 128k -movflags +faststart $FIN/SHORTS-telefono.mp4
npx remotion still build-shorts CoverSHORTSC $FIN/SHORTS-copertina.png --log=error
ffmpeg -y -v error -i $FIN/SHORTS-copertina.png -q:v 2 $FIN/SHORTS-copertina.jpg
ffmpeg -y -v error -i $FIN/SHORTS-copertina.png -vf "crop=1080:1350:0:285" -q:v 2 $FIN/SHORTS-copertina-griglia.jpg
rm -rf $FIN/SHORTS-copertina.png $FIN/pezzi build-shorts
echo "FATTO $FIN/SHORTS-FINALE.mp4"
