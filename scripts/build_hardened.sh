#!/bin/bash
# ============================================================================
# PROPERTY OF EMERGING DEFENSE SOLUTIONS (EDS-360)
# Automated Hardened Compilation Engine
# ============================================================================

set -e

echo "[+] Initiating secure compilation loop for Outpost Zero..."

# Compile with strict linker flags:
# -s : Removes standard symbol tables and debugging tracking information.
# -w : Disables DWARF debugging parameters (prevents debugger attachment reconstruction).
# -trimpath : Strips all local Codespace directory paths from compiling error strings.
go build -ldflags="-s -w" -trimpath -o bin/outpost-zero cmd/agent/main.go

echo "[+] Compilation successful. Binary symbols fully stripped."