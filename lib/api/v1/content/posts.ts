import { fetchGraphQL } from "../shared/fetcher";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    }
  };
}

export async function getPosts(): Promise<Post[]> {
  const query = `
    query GetPosts {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{ posts: { nodes: Post[] } }>(query);
  return data?.posts?.nodes || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        slug
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{ post: Post }>(query, { slug });
  return data?.post || null;
}
