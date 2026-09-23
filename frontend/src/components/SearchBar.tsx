import { useState } from 'react'

function SearchBar() {
  const [query, setQuery] = useState('')

  return (
    <label className="search-field">
      <span className="sr-only">Поиск книг</span>
      <input
        type="search"
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="button" aria-label="Найти" title="Найти">
        <img src="/assets/search.svg" alt="" />
      </button>
    </label>
  )
}

export default SearchBar
