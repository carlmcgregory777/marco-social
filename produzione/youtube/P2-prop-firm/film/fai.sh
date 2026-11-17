#!/bin/bash
# uso: bash fai.sh nN  (Nano Banana 2 Edit 16:9 2k + Seedance 1.5 Pro 5 s 720p camera mobile; salta se già fatte)
cd "$(dirname "$0")"; k=$1; S=../../../script; T=../trailer
r=$(cat set/rif-$k.txt); rif=$T/set/manichino-rif.png; [ "$r" = cc ] && rif=../../P1-prototipo/set/C-studio.png,$T/set/manichino-rif.png
[ -f set/$k.png ] || RUNPOD_B64=1 python $S/runpod_pe.py set "$rif" set/prompt-$k.txt set/$k.png 16:9 2k > set/$k.log 2>&1
[ -f set/$k.png ] || { echo "$k IMMAGINE FALLITA"; tail -2 set/$k.log; exit 1; }
[ -f clip/$k.mp4 ] || CAMERA_MOVE=1 RUNPOD_B64=1 python $S/runpod_pe.py clip set/$k.png clip/prompt-$k.txt clip/$k.mp4 5 720p > clip/$k.log 2>&1
[ -f clip/$k.mp4 ] && echo "$k ok" || { echo "$k CLIP FALLITA"; tail -2 clip/$k.log; }
