import { useState } from 'react'
import BookPage from './components/BookPage'
import BookCard, { type Book, type ReadingStatus } from './components/BookCard'
import GenreSidebar from './components/GenreSidebar'
import ProfilePage from './components/ProfilePage'
import SearchBar from './components/SearchBar'
import SortSelect, { type SortOrder } from './components/SortSelect'
import bookCover from './assets/1 (1).webp'
import exitIcon from './assets/exit.svg'
import logo from './assets/logo.svg'
import profileIcon from './assets/profile.svg'
import settingsIcon from './assets/settings.svg'
import './styles.css'

const bookGenres = [
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

const bookTitles = [
  'Книга Ивана Золотого',
  'Тени над городом',
  'Последний маяк',
  'Сад забытых историй',
  'Звёздная пыль',
  'Дом на краю леса',
  'Письма издалека',
  'Ветер перемен',
  'Тайна старого замка',
  'Остров между мирами',
  'Когда зажигаются звёзды',
  'Дорога домой',
  'Хроники северного моря',
  'Музыка тишины',
  'Последняя глава',
]

const bookAuthors = [
  'Иван Золотой',
  'Анна Ветрова',
  'Михаил Орлов',
  'Елена Морозова',
  'Алексей Соколов',
  'Мария Лесная',
  'Дмитрий Волков',
  'Ольга Северова',
  'Николай Беляев',
  'Вера Лунина',
  'Сергей Романов',
  'Полина Зорина',
  'Артём Крылов',
  'Ирина Светлова',
  'Максим Чернов',
]

const bookDescriptions = [
  'История о выборе, который меняет человека и его представление о доме.',
  'Роман о тайнах большого города, случайных встречах и последствиях прошлого.',
  'Путешествие к последнему маяку, где герою предстоит сделать важное открытие.',
  'Тёплая история о памяти, семье и сюжетах, которые находят нас в нужный момент.',
  'Фантастическое приключение о мечте, дружбе и звёздах над далёким миром.',
]

const books: Book[] = Array.from({ length: 15 }, (_, index) => {
  const category = bookGenres[index % bookGenres.length]

  return {
    id: index + 1,
    title: bookTitles[index],
    author: bookAuthors[index],
    genre: category,
    category,
    cover: bookCover,
    description: bookDescriptions[index % bookDescriptions.length],
  }
})

type HeaderProps = {
  isDarkTheme: boolean
  onThemeToggle: () => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onProfileClick: () => void
  onHomeClick: () => void
}

function Header({ isDarkTheme, onThemeToggle, searchQuery, onSearchQueryChange, onProfileClick, onHomeClick }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Starbooks, на главную" onClick={onHomeClick}>
        <img src={logo} alt="" />
        <span>
          STARBOOKS
          <small>Приятного чтения!</small>
        </span>
      </a>

      <SearchBar query={searchQuery} onQueryChange={onSearchQueryChange} />

      <nav className="account-actions" aria-label="Аккаунт">
        <button
          className="theme-toggle"
          type="button"
          title={isDarkTheme ? 'Светлая тема' : 'Тёмная тема'}
          aria-label={isDarkTheme ? 'Включить светлую тему' : 'Включить тёмную тему'}
          aria-pressed={isDarkTheme}
          onClick={onThemeToggle}
        >
          <span aria-hidden="true">{isDarkTheme ? '☀' : '☾'}</span>
          <span>Тема</span>
        </button>
        <button className="icon-action" type="button" title="Настройки">
          <img src={settingsIcon} alt="" />
          <span>Настройки</span>
        </button>
        <button className="icon-action" type="button" title="Выйти">
          <img src={exitIcon} alt="" />
          <span>Выйти</span>
        </button>
        <button className="profile-action" type="button" title="Профиль" onClick={onProfileClick}>
          <img src={profileIcon} alt="" />
          <span>Profile</span>
        </button>
      </nav>
    </header>
  )
}

function App() {
  const [activeGenre, setActiveGenre] = useState('')
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<'catalog' | 'profile' | 'book'>('catalog')
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null)
  const [bookPageOrigin, setBookPageOrigin] = useState<'catalog' | 'profile'>('catalog')
  const [bookStatuses, setBookStatuses] = useState<Record<number, ReadingStatus>>(() => (
    Object.fromEntries(books.map((book) => [book.id, 'none'])) as Record<number, ReadingStatus>
  ))
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase('ru-RU')
  const filteredBooks = books.filter((book) => {
    const matchesGenre = !activeGenre || book.category === activeGenre
    const matchesSearch = !normalizedSearchQuery || [book.title, book.author, book.genre]
      .some((value) => value.toLocaleLowerCase('ru-RU').includes(normalizedSearchQuery))
    return matchesGenre && matchesSearch
  })
  const visibleBooks = [...filteredBooks].sort((firstBook, secondBook) => {
    if (sortOrder === 'oldest') return firstBook.id - secondBook.id
    if (sortOrder === 'az') return firstBook.title.localeCompare(secondBook.title, 'ru')
    if (sortOrder === 'za') return secondBook.title.localeCompare(firstBook.title, 'ru')
    if (sortOrder === 'author-az') {
      const firstSurname = firstBook.author.trim().split(/\s+/).at(-1) ?? ''
      const secondSurname = secondBook.author.trim().split(/\s+/).at(-1) ?? ''
      return firstSurname.localeCompare(secondSurname, 'ru')
    }
    return secondBook.id - firstBook.id
  })
  const selectedBook = books.find((book) => book.id === selectedBookId)
  const selectedBookIndex = selectedBook ? books.findIndex((book) => book.id === selectedBook.id) : -1

  function openBook(book: Book, origin: 'catalog' | 'profile') {
    setSelectedBookId(book.id)
    setBookPageOrigin(origin)
    setView('book')
  }

  return (
    <div className={isDarkTheme ? 'app-shell dark-theme' : 'app-shell'} id="top">
      <Header
        isDarkTheme={isDarkTheme}
        onThemeToggle={() => setIsDarkTheme(!isDarkTheme)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onProfileClick={() => { setSelectedBookId(null); setView('profile') }}
        onHomeClick={() => { setSelectedBookId(null); setView('catalog') }}
      />
      {view === 'book' && selectedBook ? (
        <BookPage
          book={selectedBook}
          previousBook={books[selectedBookIndex - 1]}
          nextBook={books[selectedBookIndex + 1]}
          onPrevious={() => setSelectedBookId(books[selectedBookIndex - 1]?.id ?? null)}
          onNext={() => setSelectedBookId(books[selectedBookIndex + 1]?.id ?? null)}
          onBack={() => { setSelectedBookId(null); setView(bookPageOrigin) }}
        />
      ) : view === 'profile' ? (
        <ProfilePage
          books={books}
          statuses={bookStatuses}
          onStatusChange={(bookId, status) => setBookStatuses((current) => ({ ...current, [bookId]: status }))}
          onBookClick={(book) => openBook(book, 'profile')}
          onBack={() => setView('catalog')}
        />
      ) : (
        <main className="page-content">
          <GenreSidebar activeGenre={activeGenre} onGenreChange={setActiveGenre} />
          <section className="catalog" aria-label="Каталог книг">
            <SortSelect value={sortOrder} onChange={setSortOrder} />
            {visibleBooks.length > 0 ? (
              <div className="book-grid">
                {visibleBooks.map((book) => (
                  <BookCard
                    book={book}
                    key={book.id}
                    status={bookStatuses[book.id]}
                    onStatusChange={(status) => setBookStatuses((current) => ({ ...current, [book.id]: status }))}
                    onBookClick={(book) => openBook(book, 'catalog')}
                  />
                ))}
              </div>
            ) : <p className="empty-state">В этом жанре пока нет книг.</p>}
          </section>
        </main>
      )}
      <footer className="site-footer">
        <p>ООО “ТМЫВ”</p>
        <p>По всем вопросам - huitube@example.com</p>
      </footer>
    </div>
  )
}

export default App
