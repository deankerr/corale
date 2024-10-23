import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'

export const useSearchQueryParams = () => {
  return useQueryState('search', parseAsString.withDefault(''))
}

export const useRoleQueryParam = () => {
  return useQueryState('role', parseAsStringLiteral(['user', 'assistant', 'system'] as const))
}
