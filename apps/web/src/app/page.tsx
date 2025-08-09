import { wpClient } from "../lib/graphql";
import { graphql } from "../gql";

const SITE_TITLE_QUERY = graphql(`
  query SiteTitle {
    generalSettings {
      title
      description
    }
  }
`);

export default async function HomePage() {
  let title = "?";
  let err: string | null = null;

  try {
    const data = await wpClient.request(SITE_TITLE_QUERY);
    title = data.generalSettings?.title ?? "No title";
  } catch (e) {
    err = (e as Error).message;
  }

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Dulce de Saigon</h1>
        {err ? (
          <p className="text-red-600">GraphQL error: {err}</p>
        ) : (
          <p className="opacity-70">WP title: {title}</p>
        )}
      </div>
    </main>
  );
}
