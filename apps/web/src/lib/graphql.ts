import { GraphQLClient } from "graphql-request";

export const wpClient = new GraphQLClient(
  process.env.WP_GRAPHQL_ENDPOINT!,
  { headers: { "Content-Type": "application/json" } }
);
