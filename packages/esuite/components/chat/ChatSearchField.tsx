import { useSearchQueryParams } from '@/lib/api/threads'
import { SearchField } from '../ui/SearchField'

export const ChatSearchField = () => {
  const [searchTextValue, setSearchTextValue] = useSearchQueryParams()

  return <SearchField value={searchTextValue} onValueChange={setSearchTextValue} className="w-52" />
}
