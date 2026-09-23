import { useEffect, useRef, useState } from 'react'

export type SortOrder = 'newest' | 'oldest' | 'az' | 'za'

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
]

function SortSelect({ value, onChange }: SortSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const selectedOption = sortOptions.find((option) => option.value === value) ?? sortOptions[0]

  useEffect(() => {
    function closeSelect(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
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
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <img
          className="sort-accordion-icon"
          src={isOpen ? '/assets/accrodion%20button_opened.svg' : '/assets/Accordion%20button_closed.svg'}
          alt=""
        />
      </button>
      {isOpen && (
        <div className="sort-options" role="listbox" aria-label="Порядок сортировки">
          {sortOptions.map((option) => (
            <button
              className={option.value === value ? 'sort-option selected' : 'sort-option'}
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              <span>{option.label}</span>
              {option.value === value && <img className="sort-check" src="/assets/accept%20icon.svg" alt="" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortSelect
