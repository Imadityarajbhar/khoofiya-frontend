// khoofiya-frontend/lib/api/v1/content/pages.ts
import { fetchGraphQL } from '../shared/fetcher';

export interface PageContent {
  title: string;
  content: string;
  slug: string;
  seo: {
    title: string;
    metaDesc: string;
  };
}

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  const query = `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        title
        content
        slug
        seo {
          title
          metaDesc
        }
      }
    }
  `;

  const data = await fetchGraphQL<{ page: PageContent }>(query, { slug });
  return data?.page || null;
}
