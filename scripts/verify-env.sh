#!/usr/bin/env bash
# scripts/verify-env.sh
# Verifies Node, npm, pnpm (if used), and workspace dependencies are installed & discoverable.

set -u  # no -e so we can collect all errors
ERRORS=0

say() { printf "\n\033[1m%s\033[0m\n" "$1"; }
ok()  { printf "  ✔ %s\n" "$1"; }
warn(){ printf "  ⚠ %s\n" "$1"; }
err() { printf "  ✖ %s\n" "$1"; ERRORS=$((ERRORS+1)); }

# Ensure we're at a project root with package.json
if [[ ! -f "package.json" ]]; then
  err "No package.json found in current directory. Run from repo root."
  echo
  echo "Summary: $ERRORS error(s)."
  exit 1
fi

say "Reading project metadata"
PKG_MANAGER="$(node -e "try{console.log(require('./package.json').packageManager||'');}catch(e){console.log('');}" 2>/dev/null || true)"
ENGINE_NODE="$(node -e "try{console.log((require('./package.json').engines||{}).node||'');}catch(e){console.log('');}" 2>/dev/null || true)"

[[ -n "$PKG_MANAGER" ]] && ok "packageManager: $PKG_MANAGER" || warn "No packageManager field in package.json"
[[ -n "$ENGINE_NODE" ]] && ok "engines.node: $ENGINE_NODE" || warn "No engines.node specified"

say "Checking Node.js"
if command -v node >/dev/null 2>&1; then
  NODE_V="$(node -v 2>/dev/null || true)"
  ok "node found ($NODE_V)"
else
  err "node is not installed or not on PATH"
fi

say "Checking npm"
if command -v npm >/dev/null 2>&1; then
  NPM_V="$(npm -v 2>/dev/null || true)"
  ok "npm found (v$NPM_V)"
else
  err "npm is not installed or not on PATH"
fi

USE_PNPM=false
if [[ -f "pnpm-lock.yaml" ]] || [[ "$PKG_MANAGER" == pnpm@* ]]; then
  USE_PNPM=true
fi

if $USE_PNPM; then
  say "Checking pnpm (repo appears to use pnpm)"
  if command -v pnpm >/dev/null 2>&1; then
    PNPM_V="$(pnpm -v 2>/dev/null || true)"
    ok "pnpm found (v$PNPM_V)"
  else
    warn "pnpm not found on PATH"
    if command -v corepack >/dev/null 2>&1; then
      warn "Try: corepack enable"
    fi
    err "pnpm required but missing"
  fi
else
  say "pnpm check"
  ok "Repo does not appear to require pnpm (no lockfile/packageManager=pnpm)"
fi

say "Checking workspace dependencies"
# This is a pnpm monorepo, not an Nx workspace, so we check for proper dependency installation
if [[ -d "node_modules" ]]; then
  ok "node_modules directory found"
  
  # Check if this looks like a properly installed pnpm workspace
  if [[ -f "pnpm-workspace.yaml" ]]; then
    ok "pnpm workspace detected (pnpm-workspace.yaml found)"
  fi
  
  # Verify key dependencies are installed
  if [[ -f "node_modules/.pnpm/lock.yaml" ]] || [[ -f "node_modules/.modules.yaml" ]]; then
    ok "Dependencies appear to be properly installed"
  else
    warn "Dependencies may not be fully installed"
  fi
else
  warn "node_modules directory not found"
  if $USE_PNPM; then
    warn "Run 'pnpm install' to install dependencies"
  else
    warn "Run 'npm install' to install dependencies"
  fi
  err "Dependencies not installed"
fi

say "Summary"
if [[ $ERRORS -eq 0 ]]; then
  ok "Environment looks good ✅"
  exit 0
else
  err "$ERRORS issue(s) found. See messages above."
  exit 1
fi