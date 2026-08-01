#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

TARGETS=(
  "../webhook-publisher/shared"
  "../repo-checker/shared"
  "../scripts/shared"
)

copy_with_rsync() {
  local dest="$1"
  rsync -a --delete \
    --exclude "$(basename "$0")" \
    --exclude '__pycache__/' \
    --exclude '*.egg-info' \
    --exclude '*.pyc' \
    --exclude '*.pyo' \
    --exclude 'README.md' \
    ./ "$dest/"
  rm -f "$dest/$(basename "$0")"
}

copy_with_cp() {
  local dest="$1"
  mkdir -p "$dest"
  cp -r pyproject.toml src "$dest/"
  rm -f "$dest/$(basename "$0")"
  find "$dest" -type d -name '__pycache__' -prune -exec rm -rf {} +
  find "$dest" -type d -name '*.egg-info' -prune -exec rm -rf {} +
  find "$dest" -type f \( -name '*.pyc' -o -name '*.pyo' \) -delete
  rm -f "$dest/README.md"
}

for dest in "${TARGETS[@]}"; do
  mkdir -p "$dest"
  if command -v rsync >/dev/null 2>&1; then
    copy_with_rsync "$dest"
  else
    copy_with_cp "$dest"
  fi
  echo "Copied shared/ → $dest"
done
