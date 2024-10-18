import { useThreadTextSearchQueryParams } from '@/lib/api/threads'
import { SearchField } from '../ui/SearchField'

export const ChatSearchField = () => {
  const {
    search: [searchTextValue, setSearchTextValue],
  } = useThreadTextSearchQueryParams()

  return <SearchField value={searchTextValue} onValueChange={setSearchTextValue} className="w-52" />
}
