#!/bin/bash
# Renders all 24 JoyMannersKids videos sequentially
# Usage: ./render-all.sh [start_id] [end_id]
# Example: ./render-all.sh 2 5   (renders videos 2 through 5)
#          ./render-all.sh        (renders all 1-24)

set -e
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome

START=${1:-1}
END=${2:-24}

mkdir -p renders
ORIG_INDEX=""

save_index() {
  if [ -f index.html ]; then
    ORIG_INDEX=$(cat index.html)
  fi
}

restore_index() {
  if [ -n "$ORIG_INDEX" ]; then
    echo "$ORIG_INDEX" > index.html
  fi
}

trap restore_index EXIT

save_index

for i in $(seq "$START" "$END"); do
  VID=$(printf "%02d" "$i")
  OUTPUT="renders/v${VID}.webm"

  if [ "$i" -eq 1 ]; then
    # Video 1 uses index.html directly
    if [ -n "$ORIG_INDEX" ]; then
      echo "$ORIG_INDEX" > index.html
    fi
  else
    # Copy composition to index.html
    cp "compositions/v${VID}.html" index.html
  fi

  echo ""
  echo "=========================================="
  echo "  Rendering video ${VID}/24..."
  echo "=========================================="

  npx hyperframes render --quality draft --output "$OUTPUT"

  if [ -f "$OUTPUT" ]; then
    SIZE=$(du -sh "$OUTPUT" | cut -f1)
    echo "  ✓ v${VID} → $OUTPUT ($SIZE)"
  else
    echo "  ✗ v${VID} render failed!"
  fi
done

echo ""
echo "=========================================="
echo "  All renders complete!"
echo "  Files in renders/"
ls -lh renders/
echo "=========================================="
