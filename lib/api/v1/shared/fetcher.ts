// khoofiya-frontend/lib/api/v1/shared/fetcher.ts

/**
 * Base fetcher for WPGraphQL Content API.
 * Uses Next.js extended fetch with caching capabilities.
 */
export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  cacheConfig: RequestCache = 'force-cache'
): Promise<T> {
  const wpUrl = process.env.WPGRAPHQL_URL;
  if (!wpUrl) throw new Error('WPGRAPHQL_URL is missing in environment variables.');

  const res = await fetch(wpUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: cacheConfig,
    next: { revalidate: cacheConfig === 'force-cache' ? 3600 : undefined },
  });

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL Error:', json.errors);
    throw new Error('Failed to fetch GraphQL API');
  }
  return json.data as T;
}

/**
 * Base fetcher for WooCommerce Store API.
 * Defaults to 'no-store' as commerce operations are highly dynamic.
 */
export async function fetchCommerce<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, any>
): Promise<T> {
  const wcUrl = process.env.WC_STORE_API_URL;
  if (!wcUrl) throw new Error('WC_STORE_API_URL is missing in environment variables.');

  // The Store API uses Nonce or Session tokens typically via headers for frontend Cart management.
  // We will build this out further in the Cart phase.
  const res = await fetch(`${wcUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
    cache: 'no-store', // Commerce data must always be fresh
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('WooCommerce API Error:', errorData);
    throw new Error(`Failed to fetch Commerce API: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
