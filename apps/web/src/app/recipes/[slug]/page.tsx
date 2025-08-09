import Image from "next/image";
import Link from "next/link";
import { wpClient } from "@/lib/graphql";
import { graphql } from "@/gql";

const POST_BY_SLUG = graphql(`
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      featuredImage { node { sourceUrl altText } }
    }
  }
`);

type PageProps = { params: { slug: string } };

export default async function RecipePage({ params }: PageProps) {
  const { slug } = params;
  const data = await wpClient.request(POST_BY_SLUG, { slug });
  const post = data?.post;
  if (!post) {
    return <main className="p-8">Not found</main>;
  }
  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      {post.featuredImage?.node?.sourceUrl && (
        <Image
          src={post.featuredImage.node.sourceUrl}
          alt={post.featuredImage.node.altText || post.title || ""}
          width={1000}
          height={600}
          className="w-full h-auto rounded-md"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content ?? "" }} />
      <p className="pt-6"><Link href="/recipes">? Back</Link></p>
    </main>
  );
}

// Keep typing simple; you can later fetch slugs from WP if desired
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [];
}

export const dynamicParams = true;
