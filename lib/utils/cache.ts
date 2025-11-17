/**
 * Cache control headers for different scenarios
 */

export const cacheHeaders = {
  // Cache for 5 minutes, stale-while-revalidate for 10 minutes
  short: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
  // Cache for 1 hour, stale-while-revalidate for 2 hours
  medium: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  },
  // Cache for 24 hours, stale-while-revalidate for 48 hours
  long: {
    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
  },
  // No cache for dynamic content
  none: {
    'Cache-Control': 'no-store, must-revalidate',
  },
}

/**
 * Add cache headers to Response
 */
export function withCache(
  data: any,
  cacheType: keyof typeof cacheHeaders = 'short'
): Response {
  return Response.json(data, {
    headers: cacheHeaders[cacheType],
  })
}
