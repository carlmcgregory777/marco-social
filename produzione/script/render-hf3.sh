#!/bin/bash
# Render locale a pezzi del reel Higgsfield v3 (HF3). Audio già mixato in higgsfield-aff/v3/finale/audio.m4a.
set -e
cd /c/Users/stang/code/marco-social/produzione/remotion-c
FIN=../higgsfield-aff/v3/finale; mkdir -p $FIN/pezzi
npx remotion bundle src/index.ts --public-dir=public-hf3 --out-dir=build-hf3 --log=error
N=$(python -c "import re;print(round((float(re.search(r'FINE_HF3 = ([0-9.]+)',open('src/hf3-parole.ts',encoding='utf-8').read()).group(1))+1.4)*30))")
> $FIN/pezzi/lista.txt
for ((a=0; a<N; a+=420)); do
  b=$((a+419)); [ $b -ge $N ] && b=$((N-1))
  npx remotion render build-hf3 HF3 $FIN/pezzi/p$a.mp4 --frames=$a-$b --concurrency=2 --crf=18 --muted --log=error
  echo "file 'p$a.mp4'" >> $FIN/pezzi/lista.txt
  echo "pezzo $a-$b fatto"
done
ffmpeg -y -v error -f concat -safe 0 -i $FIN/pezzi/lista.txt -c copy $FIN/pezzi/video.mp4
ffmpeg -y -v error -i $FIN/pezzi/video.mp4 -i $FIN/audio.m4a -map 0:v -map 1:a -c:v copy -c:a copy -shortest -movflags +faststart $FIN/HF3-FINALE.mp4
ffmpeg -y -v error -i $FIN/HF3-FINALE.mp4 -c:v libx264 -b:v 1750k -maxrate 2200k -bufsize 4000k -preset slow -c:a aac -b:a 128k -movflags +faststart $FIN/HF3-telefono.mp4
npx remotion still build-hf3 CoverHF3 $FIN/HF3-copertina.png --log=error
ffmpeg -y -v error -i $FIN/HF3-copertina.png -q:v 2 $FIN/HF3-copertina.jpg && rm $FIN/HF3-copertina.png
rm -rf build-hf3
echo "FATTO $FIN/HF3-FINALE.mp4"
