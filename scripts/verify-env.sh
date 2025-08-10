#!/bin/bash

# verify-env.sh - Environment verification script for DulceWeb
# Checks presence and versions of Node, npm, pnpm, and optionally Nx

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS")
            echo -e "${GREEN}✓ PASS${NC}: $message"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
            ;;
        "FAIL")
            echo -e "${RED}✗ FAIL${NC}: $message"
            TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠ WARN${NC}: $message"
            TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
            ;;
        "INFO")
            echo -e "ℹ INFO: $message"
            # INFO messages don't count towards pass/fail
            ;;
    esac
}

echo "🔍 Environment Verification for DulceWeb"
echo "======================================="

# Check Node.js
echo ""
echo "Checking Node.js..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    
    if [ "$NODE_MAJOR" -ge 20 ]; then
        print_status "PASS" "Node.js $NODE_VERSION (>= v20 required)"
    else
        print_status "FAIL" "Node.js $NODE_VERSION (>= v20 required, found v$NODE_MAJOR)"
    fi
else
    print_status "FAIL" "Node.js not found"
fi

# Check npm
echo ""
echo "Checking npm..."
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_status "PASS" "npm $NPM_VERSION"
else
    print_status "FAIL" "npm not found"
fi

# Check pnpm (required for this repo)
echo ""
echo "Checking pnpm..."
if command -v pnpm >/dev/null 2>&1; then
    PNPM_VERSION=$(pnpm --version)
    PNPM_MAJOR=$(echo $PNPM_VERSION | cut -d'.' -f1)
    
    # Check if pnpm version is >= 10 (as specified in packageManager)
    if [ "$PNPM_MAJOR" -ge 10 ]; then
        print_status "PASS" "pnpm $PNPM_VERSION (>= v10 required)"
    else
        print_status "WARN" "pnpm $PNPM_VERSION (>= v10 recommended, found v$PNPM_MAJOR)"
    fi
else
    print_status "FAIL" "pnpm not found - required for this project"
fi

# Check for Nx workspace
echo ""
echo "Checking Nx workspace..."
if [ -f "nx.json" ]; then
    print_status "INFO" "nx.json found - Nx workspace detected"
    
    # Check for local Nx installation
    if [ -f "node_modules/.bin/nx" ]; then
        NX_VERSION=$(node_modules/.bin/nx --version 2>/dev/null || echo "unknown")
        print_status "PASS" "Local Nx installation found (version: $NX_VERSION)"
    elif command -v nx >/dev/null 2>&1; then
        NX_VERSION=$(nx --version 2>/dev/null || echo "unknown")
        print_status "PASS" "Global Nx installation found (version: $NX_VERSION)"
    else
        print_status "FAIL" "Nx workspace detected but nx command not found"
    fi
else
    print_status "INFO" "No nx.json found - not using Nx workspace"
fi

# Check package manager field in package.json
echo ""
echo "Checking package manager configuration..."
if [ -f "package.json" ]; then
    if grep -q "packageManager" package.json; then
        PACKAGE_MANAGER=$(grep "packageManager" package.json | cut -d'"' -f4)
        print_status "PASS" "packageManager field found: $PACKAGE_MANAGER"
    else
        print_status "WARN" "packageManager field not found in package.json"
    fi
else
    print_status "FAIL" "package.json not found"
fi

# Check if dependencies are installed
echo ""
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
    print_status "PASS" "node_modules directory exists"
else
    print_status "WARN" "node_modules directory not found - run 'pnpm install'"
fi

# Summary
echo ""
echo "======================================="
echo "🏁 Summary"
echo "======================================="

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}🎉 All checks passed! ($PASSED_CHECKS/$TOTAL_CHECKS)${NC}"
    exit 0
elif [ $PASSED_CHECKS -gt $((TOTAL_CHECKS * 3 / 4)) ]; then
    echo -e "${YELLOW}⚠️  Most checks passed with some warnings ($PASSED_CHECKS/$TOTAL_CHECKS)${NC}"
    echo "Consider addressing the warnings above."
    exit 0
else
    echo -e "${RED}❌ Some critical checks failed ($PASSED_CHECKS/$TOTAL_CHECKS)${NC}"
    echo "Please fix the failed checks before proceeding."
    exit 1
fi