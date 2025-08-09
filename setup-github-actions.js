#!/usr/bin/env node

/**
 * GitHub Actions Setup Script for pnpm Monorepo
 *
 * This script automates the setup of GitHub Actions for a pnpm monorepo.
 * It creates the necessary workflow file in the .github/workflows directory.
 *
 * Usage:
 * ```
 * node setup-github-actions.js
 * ```
 */

const fs = require('fs');
const path = require('path');

/**
 * Creates the GitHub Actions workflow file
 * @returns {Promise<void>}
 */
async function setupGitHubActions() {
  try {
    // Create directories if they don't exist
    const workflowsDir = path.join(process.cwd(), '.github', 'workflows');

    if (!fs.existsSync(path.join(process.cwd(), '.github'))) {
      fs.mkdirSync(path.join(process.cwd(), '.github'));
    }

    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir);
    }

    // Modern GitHub Actions workflow configuration
    const workflowContent = `# GitHub Actions CI/CD for Dulce-Web
# This workflow installs dependencies, lints, typechecks, builds, and runs codegen for the monorepo.
# It is triggered on push and pull request to main and all branches.

name: CI/CD

on:
  push:
    branches: [main, "*"]
  pull_request:
    branches: [main, "*"]

jobs:
  setup-build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # Setup Node.js with pnpm caching
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      # Enable and activate pnpm via Corepack (built into Node.js)
      - name: Enable Corepack
        run: corepack enable

      - name: Activate pnpm
        run: corepack prepare pnpm@latest --activate

      # Verify pnpm installation
      - name: Verify pnpm
        run: pnpm --version

      # Install dependencies
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Lint
      - name: Lint
        run: pnpm --filter ./apps/web lint

      # Typecheck
      - name: Typecheck
        run: pnpm --filter ./apps/web typecheck

      # Run GraphQL Codegen
      - name: Run GraphQL Codegen
        run: pnpm --filter ./apps/web codegen

      # Build
      - name: Build
        run: pnpm --filter ./apps/web build

      # Upload build artifacts
      - name: Upload production build
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: apps/web/.next
`;

    // Write the workflow file
    fs.writeFileSync(path.join(workflowsDir, 'ci-cd.yml'), workflowContent);

    console.log('✅ GitHub Actions workflow created successfully!');
    console.log(`📁 File created: ${path.join(workflowsDir, 'ci-cd.yml')}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Commit and push the changes to your repository');
    console.log('2. Go to the Actions tab in your GitHub repository to see the workflow run');
  } catch (error) {
    console.error('❌ Error setting up GitHub Actions:', error.message);
    process.exit(1);
  }
}

// Run the setup function
setupGitHubActions().catch(console.error);
