import Image from "next/image";
import { notFound } from "next/navigation";
import { wpClient } from "../../../lib/graphql";
import { graphql } from "../../../gql";

const RECIPE_BY_SLUG = graphql(`
  query RecipeBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      featuredImage { node { sourceUrl altText } }
    }
  }
`);

type Params = { params: { slug: string } };

export default async function RecipePage({ params }: Params) {
  const { post } = await wpClient.request(RECIPE_BY_SLUG, { slug: params.slug });
  if (!post) return notFound();

  return (
    <article className="prose prose-invert max-w-3xl mx-auto p-8">
      <h1>{post.title}</h1>
      {post.featuredImage?.node?.sourceUrl && (
        <Image
          src={post.featuredImage.node.sourceUrl}
          alt={post.featuredImage.node.altText || post.title || ""}
          width={1000}
          height={600}
          className="w-full h-auto rounded-md"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
    </article>
  );
}
