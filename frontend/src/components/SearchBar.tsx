import searchIcon from '../assets/search.svg'

type SearchBarProps = {
  query: string
  onQueryChange: (query: string) => void
}

function SearchBar({ query, onQueryChange }: SearchBarProps) {

  return (
    <label className="search-field">
      <span className="sr-only">Поиск книг</span>
      <input
        type="search"
        placeholder="Поиск книг"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <button type="button" aria-label="Найти" title="Найти">
        <img src={searchIcon} alt="" />
      </button>
    </label>
  )
}

export default SearchBar
