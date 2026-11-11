#!/usr/bin/env bash
# Render Remotion su Runpod — risolve il problema della RAM (il PC di Marco ha 7,8 GB,
# Remotion ne vuole ~2 liberi e i render morivano a metà).
#
# COME FUNZIONA
#  1. crea un pod CPU (8 vCPU / 32 GB) con Ubuntu
#  2. dentro: installa Node, ffmpeg, le dipendenze del progetto
#  3. carica il progetto (esclusi i media pesanti che non servono al render)
#  4. carica gli asset dell'episodio (clip, voce, musica, sfx)
#  5. lancia il render
#  6. scarica l'mp4
#  7. distrugge il pod
#
# PREREQUISITI: runpodctl configurato (runpodctl config --apiKey ...), rsync o scp, ssh
# USO: bash render-su-runpod.sh A7SABELLA a7sabella A7-sabella
#
# COSTO: ~$0,32/ora. Un episodio da 2 minuti: ~$0,10-0,15.
set -euo pipefail

COMP="${1:?manca la composizione, es. A7SABELLA}"
CARTELLA_PUB="${2:?manca la cartella public, es. a7sabella}"
EP="${3:?manca l'episodio, es. A7-sabella}"

PROGETTO="C:/Users/stang/code/marco-social"
REMOTION="$PROGETTO/produzione/remotion-c"
EPDIR="$PROGETTO/produzione/attualita/$EP"
NOME_POD="render-$CARTELLA_PUB"

echo "=== 1/7 creo il pod CPU (8 vCPU, 32 GB, ~\$0,32/h) ==="
runpodctl pod create \
  --name "$NOME_POD" \
  --computeType CPU \
  --cpuFlavor cpu3g \
  --vcpu 8 \
  --image "runpod/base:1.0.2-ubuntu2404" \
  --disk 40 \
  --ports "22/tcp" \
  --startSsh true \
  --env '{"PUBLIC_KEY":"'"$(cat ~/.ssh/id_ed25519.pub 2>/dev/null || cat ~/.ssh/id_rsa.pub)"'"}' \
  --output json > /tmp/pod.json

POD_ID=$(python -c "import json;print(json.load(open('/tmp/pod.json'))['id'])")
echo "pod: $POD_ID"

echo "=== 2/7 aspetto che sia pronto ==="
for i in $(seq 1 60); do
  STATO=$(runpodctl pod get "$POD_ID" --output json | python -c "import json,sys;d=json.load(sys.stdin);print(d.get('status','?'))")
  echo "  $STATO"
  [ "$STATO" = "RUNNING" ] && break
  sleep 10
done

SSH_CMD=$(runpodctl pod get "$POD_ID" --output json | python -c "
import json,sys
d=json.load(sys.stdin)
s=d.get('ssh') or {}
p=s.get('proxy') or {}
print(p.get('command','') or '')
")
echo "ssh: $SSH_CMD"
[ -z "$SSH_CMD" ] && { echo "niente SSH: il pod non ha la chiave pubblica"; exit 1; }

echo "=== 3/7 installo Node e ffmpeg nel pod ==="
ssh -o StrictHostKeyChecking=no $SSH_CMD 'bash -s' <<'REMOTO'
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl ffmpeg rsync >/dev/null
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
apt-get install -y -qq nodejs >/dev/null
node --version
ffmpeg -version | head -1
REMOTO

echo "=== 4/7 carico il progetto (senza node_modules e media pesanti) ==="
# il render ha bisogno di: src/, package.json, tsconfig, public/<cartella>/
tar -czf /tmp/progetto.tgz -C "$REMOTION" \
  --exclude=node_modules --exclude=.remotion --exclude=out \
  --exclude="public/a4midterm" --exclude="public/a5milano" \
  --exclude="public/a6oracle" --exclude="public/a7sabella" \
  --exclude="public/a8mercato" --exclude="public/a9machine" \
  package.json tsconfig.json src public 2>/dev/null || true
scp -o StrictHostKeyChecking=no /tmp/progetto.tgz $SSH_CMD:/tmp/

echo "=== 5/7 carico gli asset dell'episodio ($CARTELLA_PUB) ==="
tar -czf /tmp/asset.tgz -C "$REMOTION/public/$CARTELLA_PUB" .
scp -o StrictHostKeyChecking=no /tmp/asset.tgz $SSH_CMD:/tmp/

echo "=== 6/7 installo le dipendenze e lancio il render ==="
ssh -o StrictHostKeyChecking=no $SSH_CMD "bash -s" <<REMOTO
set -e
mkdir -p /root/progetto
tar -xzf /tmp/progetto.tgz -C /root/progetto
mkdir -p /root/progetto/public/$CARTELLA_PUB
tar -xzf /tmp/asset.tgz -C /root/progetto/public/$CARTELLA_PUB
cd /root/progetto
npm install --no-audit --no-fund >/dev/null 2>&1
echo "dipendenze installate"
npx remotion render $COMP "/root/progetto/\$COMP.mp4" --concurrency=6 --crf=20 --audio-bitrate=192k
ls -la "/root/progetto/\$COMP.mp4"
REMOTO

echo "=== 7/7 scarico il video ==="
mkdir -p "$EPDIR/finale"
scp -o StrictHostKeyChecking=no $SSH_CMD:"/root/progetto/$COMP.mp4" "$EPDIR/finale/$EP.mp4"
ls -la "$EPDIR/finale/$EP.mp4"

echo "=== distruggo il pod ==="
runpodctl pod delete "$POD_ID"
echo "FATTO: $EPDIR/finale/$EP.mp4"
