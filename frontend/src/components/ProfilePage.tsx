import BookCard, { type Book, type ReadingStatus } from './BookCard'
import profileIcon from '../assets/profile.svg'

type ProfilePageProps = {
  books: Book[]
  statuses: Record<number, ReadingStatus>
  onStatusChange: (bookId: number, status: ReadingStatus) => void
  onBookClick: (book: Book) => void
  onBack: () => void
}

const collections: Array<{ status: Exclude<ReadingStatus, 'none'>; label: string }> = [
  { status: 'read', label: 'Прочитано' },
  { status: 'reading', label: 'Читаю' },
  { status: 'want-to-read', label: 'Хочу прочитать' },
  { status: 'dropped', label: 'Брошено' },
]

function ProfilePage({ books, statuses, onStatusChange, onBookClick, onBack }: ProfilePageProps) {
  return (
    <main className="profile-page">
      <button className="profile-back" type="button" onClick={onBack}>
        ← Каталог
      </button>
      <section className="profile-intro" aria-label="Профиль пользователя">
        <img src={profileIcon} alt="" />
        <h1>Nickname</h1>
      </section>
      <section className="collections" aria-label="Коллекции книг">
        <h2>Коллекции</h2>
        {collections.map((collection) => {
          const collectionBooks = books.filter((book) => statuses[book.id] === collection.status)

          return (
            <section className="collection" key={collection.status}>
              <h3>{collection.label}</h3>
              {collectionBooks.length > 0 ? (
                <div className="collection-grid">
                  {collectionBooks.map((book) => (
                    <BookCard
                      book={book}
                      key={book.id}
                      status={statuses[book.id]}
                      onStatusChange={(status) => onStatusChange(book.id, status)}
                      onBookClick={onBookClick}
                    />
                  ))}
                </div>
              ) : <p className="collection-empty">Пока нет книг</p>}
            </section>
          )
        })}
      </section>
    </main>
  )
}

export default ProfilePage