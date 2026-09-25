import { useEffect, useRef, useState } from 'react'
import deadIcon from '../assets/dead.svg'
import loveIcon from '../assets/love.svg'
import plusIcon from '../assets/plus.svg'
import readIcon from '../assets/read.svg'
import readingIcon from '../assets/reading.svg'

export type Book = {
  id: number
  title: string
  author: string
  genre: string
  category: string
  cover: string
  description: string
}

export type ReadingStatus = 'none' | 'reading' | 'want-to-read' | 'read' | 'dropped'

type BookCardProps = {
  book: Book
  status: ReadingStatus
  onStatusChange: (status: ReadingStatus) => void
  onBookClick?: (book: Book) => void
}

const statuses: Array<{ value: ReadingStatus; label: string; icon: string }> = [
  { value: 'none', label: 'Без статуса', icon: plusIcon },
  { value: 'reading', label: 'Читаю', icon: readingIcon },
  { value: 'want-to-read', label: 'Хочу прочитать', icon: loveIcon },
  { value: 'read', label: 'Прочитано', icon: readIcon },
  { value: 'dropped', label: 'Брошено', icon: deadIcon },
]

function BookCard({ book, status, onStatusChange, onBookClick }: BookCardProps) {
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
    <article
      className="book-card"
      ref={statusMenuRef}
      role={onBookClick ? 'button' : undefined}
      tabIndex={onBookClick ? 0 : undefined}
      onClick={() => onBookClick?.(book)}
      onKeyDown={(event) => {
        if (onBookClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onBookClick(book)
        }
      }}
    >
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
          onClick={(event) => {
            event.stopPropagation()
            setIsStatusMenuOpen(!isStatusMenuOpen)
          }}
        >
          <img key={status} src={selectedStatus?.icon ?? plusIcon} alt="" />
        </button>
      </div>
      {isStatusMenuOpen && (
        <div className="status-menu" role="radiogroup" aria-label="Статус книги" onClick={(event) => event.stopPropagation()}>
          {statuses.map((item) => (
            <label className="status-option" key={item.value}>
              <span>{item.label}</span>
              <input
                type="radio"
                name={`book-status-${book.id}`}
                value={item.value}
                checked={status === item.value}
                onChange={() => {
                  onStatusChange(item.value)
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
