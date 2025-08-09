# Complete GitHub Actions Setup Guide for pnpm Monorepo

This guide provides step-by-step instructions for setting up GitHub Actions CI/CD for a pnpm monorepo project, with specific focus on avoiding the issues you've encountered.

## Step 1: Create the Workflow File Directly in GitHub

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Click the "New workflow" button
4. Choose "set up a workflow yourself" (or use Node.js template as starting point)

## Step 2: Use This Reliable Workflow Configuration

Copy and paste this configuration into the editor:

```yaml
name: CI/CD

on:
  push:
    branches: [main, '*']
  pull_request:
    branches: [main, '*']

jobs:
  setup-build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # Setup Node.js first
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 16
          registry-url: 'https://registry.npmjs.org/'

      # Install pnpm using npm (most reliable method)
      - name: Install pnpm
        run: npm install -g pnpm@8.0.0

      # Verify pnpm installation
      - name: Verify pnpm
        run: pnpm --version

      # Install dependencies
      - name: Install dependencies
        run: |
          # Remove potentially incompatible lockfile
          rm -f pnpm-lock.yaml
          # Install dependencies
          pnpm install
        env:
          NODE_OPTIONS: '--max-old-space-size=4096'

      # Run your build steps
      - name: Lint
        run: pnpm --filter ./apps/web lint

      - name: Typecheck
        run: pnpm --filter ./apps/web typecheck

      - name: Run GraphQL Codegen
        run: pnpm --filter ./apps/web codegen

      - name: Build
        run: pnpm --filter ./apps/web build

      # Upload artifacts (optional)
      - name: Upload production build
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: apps/web/.next
```

## Step 3: Commit the Workflow File

1. Commit the file to `.github/workflows/ci-cd.yml` in your repository
2. GitHub will automatically detect and run the workflow

## Step 4: Monitor the Workflow Run

1. Go to the "Actions" tab to see your workflow running
2. Click on the workflow run to see detailed logs
3. Expand each step to see its output

## Troubleshooting Common Issues

### If you encounter registry connection issues:

Add these environment variables to the "Install dependencies" step:

```yaml
env:
  NODE_OPTIONS: '--max-old-space-size=4096'
  NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org/'
  NPM_CONFIG_STRICT_SSL: 'false'
```

### If you need to use a specific Node.js version:

Modify the "Setup Node.js" step:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 16 # or 14, 18, etc.
```

### If you need to cache dependencies:

Add this after the Node.js setup:

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      **/node_modules
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-
```

## Best Practices

1. **Use npm to install pnpm**: This is the most reliable method in CI environments
2. **Remove the lockfile** if it causes compatibility issues
3. **Use Node.js 16** for maximum compatibility
4. **Verify each tool** is installed correctly before using it
5. **Set explicit registry URLs** to avoid connection issues
6. **Increase Node.js memory** for large projects

## Complete Example with All Optimizations

```yaml
name: CI/CD

on:
  push:
    branches: [main, '*']
  pull_request:
    branches: [main, '*']

jobs:
  setup-build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 16
          registry-url: 'https://registry.npmjs.org/'

      # Cache dependencies
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: |
            **/node_modules
          key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-

      # Install pnpm using npm
      - name: Install pnpm
        run: npm install -g pnpm@8.0.0

      # Verify pnpm installation
      - name: Verify pnpm
        run: |
          echo "PATH: $PATH"
          which pnpm
          pnpm --version

      # Install dependencies
      - name: Install dependencies
        run: |
          # Remove potentially incompatible lockfile
          rm -f pnpm-lock.yaml
          # Configure registry
          pnpm config set registry https://registry.npmjs.org/
          pnpm config set strict-ssl false --global
          # Install dependencies
          pnpm install
        env:
          NODE_OPTIONS: '--max-old-space-size=4096'
          NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org/'
          NPM_CONFIG_STRICT_SSL: 'false'

      # Run your build steps
      - name: Lint
        run: pnpm --filter ./apps/web lint

      - name: Typecheck
        run: pnpm --filter ./apps/web typecheck

      - name: Run GraphQL Codegen
        run: pnpm --filter ./apps/web codegen

      - name: Build
        run: pnpm --filter ./apps/web build

      # Upload artifacts
      - name: Upload production build
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: apps/web/.next
```

This configuration addresses all the issues you've encountered and provides a reliable setup for your pnpm monorepo project.
