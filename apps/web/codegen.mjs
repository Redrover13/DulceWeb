import { existsSync } from "node:fs";
import { config as load } from "dotenv";

/** prefer .env.local, fallback to .env */
if (existsSync(".env.local")) load({ path: ".env.local" });
else load();

const endpoint = process.env.WP_GRAPHQL_ENDPOINT;
if (!endpoint) {
  throw new Error("WP_GRAPHQL_ENDPOINT is not set. Put it in .env.local");
}

/** @type {import("@graphql-codegen/cli").CodegenConfig} */
const config = {
  schema: endpoint,
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "src/gql/": { preset: "client", plugins: [] }
  }
};
export default config;
