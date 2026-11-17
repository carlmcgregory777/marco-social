#!/bin/bash
# 17/11/2026: crea public-<cart>/<cart> per render-schede.sh (asset di episodio.py + labiale + primo fotogramma)
EP=$1; CART=$2
cd /c/Users/stang/code/marco-social/produzione/remotion-c
mkdir -p public-$CART/$CART
cp public/$CART/*.wav public-$CART/$CART/
cp ../attualita/$EP/clip/C-parla.mp4 public-$CART/$CART/C-parla.mp4
ffmpeg -y -v error -i public-$CART/$CART/C-parla.mp4 -frames:v 1 -q:v 2 public-$CART/$CART/cover-frame.png
ls public-$CART/$CART
