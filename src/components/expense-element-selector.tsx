"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Check, FileText, ChevronDown } from "lucide-react"
import { type ExpenseElement, searchExpenseElements, getAllExpenseElements } from "@/services/expense-elements"

interface ExpenseElementSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ExpenseElementSelector({ value, onChange, disabled = false }: ExpenseElementSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [elements, setElements] = useState<ExpenseElement[]>([])
  const [selectedElement, setSelectedElement] = useState<ExpenseElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Carregar elementos iniciais
  useEffect(() => {
    setElements(getAllExpenseElements())
  }, [])

  // Atualizar elementos quando o texto de busca mudar
  useEffect(() => {
    setElements(searchExpenseElements(searchText))
  }, [searchText])

  // Atualizar o elemento selecionado quando o valor mudar
  useEffect(() => {
    const element = getAllExpenseElements().find((el) => el.name === value) || null
    setSelectedElement(element)
  }, [value])

  // Fechar o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelectElement = (element: ExpenseElement) => {
    onChange(element.name)
    setIsOpen(false)
    setSearchText("")
  }

  const handleClearSearch = () => {
    setSearchText("")
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md h-9 px-2 ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center flex-1 truncate">
          <FileText className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <span className="truncate text-sm text-gray-700">{selectedElement?.name || "Selecionar"}</span>
        </div>
        {!disabled && <ChevronDown className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-[350px] flex flex-col">
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7baa3d] focus:border-[#7baa3d]"
              />
              {searchText && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {elements.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between ${element.name === value ? "bg-gray-50" : ""}`}
                    onClick={() => handleSelectElement(element)}
                  >
                    <div>
                      <div className="font-medium text-gray-700">{element.name}</div>
                      {element.subcategory && <div className="text-xs text-gray-500">{element.subcategory}</div>}
                      <div className="text-xs text-gray-400">{element.category}</div>
                    </div>
                    {element.name === value && <Check className="h-4 w-4 text-[#7baa3d]" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-sm text-gray-500">Nenhum elemento encontrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

