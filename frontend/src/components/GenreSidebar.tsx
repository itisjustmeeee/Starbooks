const genres = [
  'Классическая литература',
  'Зарубежная литература',
  'Русская литература',
  'Детские книги',
  'Фэнтези',
  'Фантастика',
  'Современная проза',
  'Приключения',
  'Ужасы',
  'Публицистика',
  'Любовные романы',
  'Боевики',
  'Поэзия',
]

type GenreSidebarProps = {
  activeGenre: string
  onGenreChange: (genre: string) => void
}

function GenreSidebar({ activeGenre, onGenreChange }: GenreSidebarProps) {
  return (
    <aside className="genre-sidebar">
      <h1><span />Жанры<span /></h1>
      <div className="genre-list">
        <button
          className={activeGenre === '' ? 'genre-button all-books-button active' : 'genre-button all-books-button'}
          type="button"
          onClick={() => onGenreChange('')}
        >
          Все книги
        </button>
        {genres.map((genre) => (
          <button
            className={activeGenre === genre ? 'genre-button active' : 'genre-button'}
            key={genre}
            type="button"
            onClick={() => onGenreChange(activeGenre === genre ? '' : genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default GenreSidebar
