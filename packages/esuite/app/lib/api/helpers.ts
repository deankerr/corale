import { useQuery as useQueryPrimitive } from 'convex-helpers/react/cache/hooks'

import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'

export function useCachedQuery<T extends FunctionReference<'query'>>(
  query: T,
  args: FunctionArgs<T> | 'skip',
): FunctionReturnType<T> | undefined {
  return useQueryPrimitive<T>(query, args)
}
