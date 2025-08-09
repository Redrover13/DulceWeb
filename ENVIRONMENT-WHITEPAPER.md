# Dulce-Web Monorepo Environment Whitepaper

## Overview

Dulce-Web is a modern, monorepo-based web application environment designed for scalable, maintainable, and high-performance headless CMS-driven websites. The stack leverages Next.js, TypeScript, GraphQL, Tailwind CSS, and a robust CI/CD pipeline with GitHub Actions and Vercel deployment support.

---

## Monorepo Structure

- **Monorepo Tooling:** pnpm workspaces
- **Root Directory:** Contains shared configuration, lockfiles, and workspace management
- **Apps:**
  - `apps/web`: Main Next.js web application

---

## Core Technologies & Dependencies

### JavaScript/TypeScript

- **TypeScript**: Type-safe development
- **Next.js**: React-based framework for SSR, SSG, and API routes
- **React**: UI library

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Prettier**: Code formatter
- **prettier-plugin-tailwindcss**: Sorts Tailwind classes in Prettier

### Linting & Quality

- **ESLint**: Linting for JavaScript/TypeScript
- **eslint-config-next**: Next.js ESLint rules
- **eslint-plugin-jsx-a11y**: Accessibility linting
- **lint-staged**: Runs Prettier on staged files
- **husky**: Git hooks for pre-commit linting/formatting

### GraphQL

- **graphql**: Core GraphQL library
- **graphql-request**: Minimal GraphQL client
- **@graphql-codegen/cli**: Code generation for GraphQL types
- **@graphql-codegen/client-preset**: Client-side codegen preset
- **@graphql-codegen/typescript**: TypeScript codegen plugin
- **@graphql-codegen/typescript-graphql-request**: Typed GraphQL client
- **@graphql-codegen/typescript-operations**: Typed GraphQL operations

### Build & Tooling

- **pnpm**: Fast, disk-efficient package manager
- **dotenv**: Loads environment variables
- **@next/bundle-analyzer**: Bundle analysis for Next.js
- **@parcel/watcher**: File watching for codegen

---

## Configuration & Add-ons

- **.env.example / .env.local**: Environment variable management
- **tsconfig.base.json**: Shared TypeScript config
- **tailwind.config.js**: Tailwind CSS configuration
- **postcss.config.mjs**: PostCSS config for Tailwind
- **.prettierrc / .prettierignore**: Prettier configuration
- **.eslintrc.json**: ESLint configuration
- **.husky/pre-commit**: Pre-commit hook for lint-staged
- **.lintstagedrc.json**: Lint-staged configuration

---

## CI/CD Pipeline

- **GitHub Actions**: Automated workflow for linting, type-checking, codegen, and building
- **Vercel**: Cloud deployment platform with monorepo and environment variable support

### Workflow Steps

1. Checkout code
2. Setup Node.js and pnpm
3. Install dependencies
4. Lint, typecheck, and run codegen
5. Build Next.js app
6. (Optional) Upload build artifact
7. (Optional) Deploy to Vercel

---

## Security & Best Practices

- **Content Security Policy**: Set in `next.config.mjs`
- **Environment Variables**: Never commit secrets; use Vercel dashboard for production
- **Pre-commit Hooks**: Enforce code quality before every commit

---

## Getting Started

1. Clone the repo
2. Run `pnpm install` at the root
3. Add `.env.local` with required variables
4. Run `pnpm --filter ./apps/web dev` to start the app

---

## Summary

This environment is designed for modern, scalable, and maintainable web development with a focus on developer experience, code quality, and deployment automation. All major dependencies and add-ons are documented above for easy onboarding and future reference.
