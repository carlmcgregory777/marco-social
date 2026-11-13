#!/bin/bash
# uso: bash fai_scene.sh sNN   (immagine Nano Banana + clip Seedance 1.5 Pro 5 s 720p; salta se già fatte)
cd "$(dirname "$0")"; k=$1; S=../../../script
rif=set/manichino-rif.png; [ "$k" = s12 ] && rif=../../P1-prototipo/set/C-studio.png
[ -f set/$k.png ] || RUNPOD_B64=1 python $S/runpod_pe.py set $rif set/prompt-$k.txt set/$k.png 16:9 2k > set/$k.log 2>&1
[ -f set/$k.png ] || { echo "$k IMMAGINE FALLITA"; exit 1; }
[ -f clip/$k.mp4 ] || RUNPOD_B64=1 python $S/runpod_pe.py clip set/$k.png clip/prompt-$k.txt clip/$k.mp4 5 720p > clip/$k.log 2>&1
[ -f clip/$k.mp4 ] && echo "$k ok" || echo "$k CLIP FALLITA"
