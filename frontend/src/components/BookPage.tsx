import type { Book } from './BookCard'

type BookPageProps = {
  book: Book
  previousBook?: Book
  nextBook?: Book
  onPrevious: () => void
  onNext: () => void
  onBack: () => void
}

function BookPage({ book, previousBook, nextBook, onPrevious, onNext, onBack }: BookPageProps) {
  return (
    <main className="book-page">
      <button className="profile-back book-page-back" type="button" onClick={onBack}>
        ← Каталог
      </button>
      <section className="book-showcase" aria-label={`Страница книги: ${book.title}`}>
        <button
          className="book-nav book-nav-previous"
          type="button"
          aria-label="Предыдущая книга"
          title={previousBook ? `Предыдущая: ${previousBook.title}` : 'Это первая книга'}
          disabled={!previousBook}
          onClick={onPrevious}
        >
          ‹
        </button>
        <img className="book-page-cover" src={book.cover} alt={`Обложка: ${book.title}`} />
        <button
          className="book-nav book-nav-next"
          type="button"
          aria-label="Следующая книга"
          title={nextBook ? `Следующая: ${nextBook.title}` : 'Это последняя книга'}
          disabled={!nextBook}
          onClick={onNext}
        >
          ›
        </button>
      </section>
      <section className="book-page-info">
        <h1>{book.title}</h1>
        <p className="book-page-author">{book.author}</p>
        <h2>Описание</h2>
        <p className="book-description">{book.description}</p>
      </section>
    </main>
  )
}

export default BookPage