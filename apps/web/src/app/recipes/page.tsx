import Image from "next/image";
import Link from "next/link";
import { wpClient } from "../../lib/graphql";
import { graphql } from "../../gql";

const RECIPES_QUERY = graphql(`
  query Recipes {
    posts(first: 12) {
      nodes {
        id
        slug
        title
        excerpt
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`);

export default async function RecipesPage() {
  const data = await wpClient.request(RECIPES_QUERY);
  const posts = data.posts?.nodes ?? [];
  return (
    <main className="max-w-5xl mx-auto p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(p => (
        <Link key={p!.id} href={`/recipes/${p!.slug}`} className="rounded-xl border p-4 hover:opacity-90">
          {p?.featuredImage?.node?.sourceUrl && (
            <Image
              src={p.featuredImage.node.sourceUrl}
              alt={p.featuredImage.node.altText || p.title || ""}
              width={640} height={400} className="w-full h-auto rounded-md"
            />
          )}
          <h3 className="mt-3 text-lg font-semibold">{p?.title}</h3>
          <div className="opacity-70" dangerouslySetInnerHTML={{ __html: p?.excerpt || "" }} />
        </Link>
      ))}
    </main>
  );
}
