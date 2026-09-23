import { useEffect, useRef, useState } from 'react'

export type Book = {
  id: number
  title: string
  author: string
  genre: string
  category: string
  cover: string
}

type BookCardProps = {
  book: Book
}

type ReadingStatus = 'none' | 'reading' | 'want-to-read' | 'read' | 'dropped'

const statuses: Array<{ value: ReadingStatus; label: string; icon: string }> = [
  { value: 'none', label: 'Без статуса', icon: '/assets/plus.svg' },
  { value: 'reading', label: 'Читаю', icon: '/assets/reading.svg' },
  { value: 'want-to-read', label: 'Хочу прочитать', icon: '/assets/love.svg' },
  { value: 'read', label: 'Прочитано', icon: '/assets/read.svg' },
  { value: 'dropped', label: 'Брошено', icon: '/assets/dead.svg' },
]

function BookCard({ book }: BookCardProps) {
  const [status, setStatus] = useState<ReadingStatus>('none')
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const statusMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [])

  const selectedStatus = statuses.find((item) => item.value === status)

  return (
    <article className="book-card" ref={statusMenuRef}>
      <img className="book-cover" src={book.cover} alt={`Обложка: ${book.title}`} />
      <div className="book-details">
        <h2>{book.title}</h2>
        <div className="book-meta">
          <span>{book.author}</span>
          <span>{book.genre}</span>
        </div>
        <button
          className="favorite-button"
          type="button"
          title="Изменить статус книги"
          aria-label="Изменить статус книги"
          aria-expanded={isStatusMenuOpen}
          onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
        >
          <img src={selectedStatus?.icon ?? '/assets/plus.svg'} alt="" />
        </button>
      </div>
      {isStatusMenuOpen && (
        <div className="status-menu" role="radiogroup" aria-label="Статус книги">
          {statuses.map((item) => (
            <label className="status-option" key={item.value}>
              <span>{item.label}</span>
              <input
                type="radio"
                name={`book-status-${book.id}`}
                value={item.value}
                checked={status === item.value}
                onChange={() => {
                  setStatus(item.value)
                  setIsStatusMenuOpen(false)
                }}
              />
            </label>
          ))}
        </div>
      )}
    </article>
  )
}

export default BookCard
