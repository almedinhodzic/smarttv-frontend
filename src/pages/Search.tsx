import { useState, useEffect } from 'preact/hooks'
import { focusFirst, setOnBack } from '@/spatial'
import { route } from 'preact-router'

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    focusFirst()
    setOnBack(() => route('/'))
  }, [])

  return (
    <div class="page page-search page-with-sidebar">
      <h1 class="page-title">Search</h1>
      <div class="search-container">
        <input
          class="search-input"
          type="text"
          placeholder="Search channels, movies, series..."
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          data-focusable
        />
      </div>
      <div class="search-results">
        {results.length === 0 && query && (
          <p style={{ color: '#888' }}>No results found.</p>
        )}
      </div>
    </div>
  )
}
