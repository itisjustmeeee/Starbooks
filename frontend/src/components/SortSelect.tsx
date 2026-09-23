import { useEffect, useRef, useState } from 'react'
import acceptIcon from '../assets/accept icon.svg'
import accordionClosedIcon from '../assets/Accordion button_closed.svg'
import accordionOpenedIcon from '../assets/accrodion button_opened.svg'

export type SortOrder = 'newest' | 'oldest' | 'az' | 'za' | 'author-az'

type SortOption = {
  value: SortOrder
  label: string
}

type SortSelectProps = {
  value: SortOrder
  onChange: (value: SortOrder) => void
}

const sortOptions: SortOption[] = [
  { value: 'newest', label: 'Сначала новое' },
  { value: 'oldest', label: 'Сначала старое' },
  { value: 'az', label: 'от А до Я' },
  { value: 'za', label: 'от Я до А' },
  { value: 'author-az', label: 'По фамилии автора' },
]

function SortSelect({ value, onChange }: SortSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const selectedOption = sortOptions.find((option) => option.value === value) ?? sortOptions[0]

  useEffect(() => {
    if (!isClosing) return

    const timeoutId = window.setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 180)

    return () => window.clearTimeout(timeoutId)
  }, [isClosing])

  useEffect(() => {
    function closeSelect(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsClosing(true)
      }
    }

    document.addEventListener('mousedown', closeSelect)
    return () => document.removeEventListener('mousedown', closeSelect)
  }, [])

  return (
    <div className={isOpen ? 'sort-select is-open' : 'sort-select'} ref={selectRef}>
      <button
        className="sort-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            setIsClosing(true)
          } else {
            setIsOpen(true)
            setIsClosing(false)
          }
        }}
      >
        <span>{selectedOption.label}</span>
        <img
          className="sort-accordion-icon"
          src={isOpen ? accordionOpenedIcon : accordionClosedIcon}
          alt=""
        />
      </button>
      {isOpen && (
        <div className={isClosing ? 'sort-options is-closing' : 'sort-options'} role="listbox" aria-label="Порядок сортировки">
          {sortOptions.map((option) => (
            <button
              className={option.value === value ? 'sort-option selected' : 'sort-option'}
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value)
                setIsClosing(true)
              }}
            >
              <span>{option.label}</span>
              {option.value === value && <img className="sort-check" src={acceptIcon} alt="" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortSelect
