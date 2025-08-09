import type { CodegenConfig } from "@graphql-codegen/cli";
const config: CodegenConfig = {
  schema: process.env.WP_GRAPHQL_ENDPOINT,
  documents: ["src/**/*.{ts,tsx}"],
  generates: { "src/gql/": { preset: "client", plugins: [] } }
};
export default config;
