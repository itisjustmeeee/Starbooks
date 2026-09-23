import { useState } from 'react'
import BookCard, { type Book } from './components/BookCard'
import GenreSidebar from './components/GenreSidebar'
import SearchBar from './components/SearchBar'
import SortSelect, { type SortOrder } from './components/SortSelect'
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

const books: Book[] = Array.from({ length: 15 }, (_, index) => {
  const category = bookGenres[index % bookGenres.length]

  return {
    id: index + 1,
    title: bookTitles[index],
    author: bookAuthors[index],
    genre: category,
    category,
    cover: '/assets/1%20(1).webp',
  }
})

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Starbooks, на главную">
        <img src="/assets/logo.svg" alt="" />
        <span>
          STARBOOKS
          <small>ЧИТАЙ СТАНОВИСЬ</small>
        </span>
      </a>

      <SearchBar />

      <nav className="account-actions" aria-label="Аккаунт">
        <button className="icon-action" type="button" title="Настройки">
          <img src="/assets/settings.svg" alt="" />
          <span>Настройки</span>
        </button>
        <button className="icon-action" type="button" title="Выйти">
          <img src="/assets/exit.svg" alt="" />
          <span>Выйти</span>
        </button>
        <button className="profile-action" type="button" title="Профиль">
          <img src="/assets/profile.svg" alt="" />
          <span>Profile</span>
        </button>
      </nav>
    </header>
  )
}

function App() {
  const [activeGenre, setActiveGenre] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const filteredBooks = activeGenre ? books.filter((book) => book.category === activeGenre) : books
  const visibleBooks = [...filteredBooks].sort((firstBook, secondBook) => {
    if (sortOrder === 'oldest') return firstBook.id - secondBook.id
    if (sortOrder === 'az') return firstBook.title.localeCompare(secondBook.title, 'ru')
    if (sortOrder === 'za') return secondBook.title.localeCompare(firstBook.title, 'ru')
    return secondBook.id - firstBook.id
  })

  return (
    <div className="app-shell" id="top">
      <Header />
      <main className="page-content">
        <GenreSidebar activeGenre={activeGenre} onGenreChange={setActiveGenre} />
        <section className="catalog" aria-label="Каталог книг">
          <SortSelect value={sortOrder} onChange={setSortOrder} />
          {visibleBooks.length > 0 ? (
            <div className="book-grid">
              {visibleBooks.map((book) => <BookCard book={book} key={book.id} />)}
            </div>
          ) : <p className="empty-state">В этом жанре пока нет книг.</p>}
        </section>
      </main>
      <footer className="site-footer">
        <p>ООО “ТЫК”</p>
        <p>По всем вопросам - huitube@example.com</p>
      </footer>
    </div>
  )
}

export default App
