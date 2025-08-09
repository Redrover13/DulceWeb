import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_API_URL || 'https://dulcedesaigon.com/graphql',
  documents: ['./**/*.{ts,tsx}'],
  generates: {
    './generated/': {
      preset: 'client',
      plugins: [],
    },
  },
  watch: true,
};

export default config;
