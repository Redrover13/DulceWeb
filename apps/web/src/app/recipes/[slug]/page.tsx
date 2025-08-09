import Image from "next/image";
import Link from "next/link";
import { wpClient } from "@/lib/graphql";

// Plain string query (no graphql() helper)
const POST_BY_SLUG = /* GraphQL */ `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      featuredImage { node { sourceUrl altText } }
    }
  }
`;

type PostBySlugResult = {
  post?: {
    title?: string | null
    content?: string | null
    featuredImage?: { node?: { sourceUrl?: string | null; altText?: string | null } | null } | null
  } | null
};
type PostBySlugVars = { slug: string };

type PageProps = { params: Promise<{ slug: string }> };

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await wpClient.request<PostBySlugResult, PostBySlugVars>(POST_BY_SLUG, { slug });
  const post = data?.post;
  if (!post) return <main className="p-8">Not found</main>;

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

export function generateStaticParams(): Array<{ slug: string }> { return []; }
export const dynamicParams = true;
