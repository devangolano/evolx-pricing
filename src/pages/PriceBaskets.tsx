"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Filter, ChevronDown, X, User, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { StatCard } from "../components/stat-card"
import { BasketItem } from "../components/Card"

// Dados de exemplo
const statsData = [
  { title: "Cestas Finalizadas", value: 5862 },
  { title: "Cestas em andamento", value: 25 },
  { title: "Cestas em Abertos", value: 69 },
  { title: "Total de Orçamentos", value: 521 },
]

const allBasketsData = [
  {
    id: "598555",
    date: "29/03/2025",
    status: "EM ANDAMENTO" as const,
    description: "Prestação de Serviço especializada de Assessoria e Consultoria para a equipe de assistência Social",
    userName: "Vitor Santos Junior",
  },
  {
    id: "598556",
    date: "29/03/2025",
    status: "PRONTA" as const,
    description: "Prestação de Serviço especializada de Assessoria e Consultoria para a equipe de assistência Social",
    userName: "Vitor Santos Junior",
  },
  {
    id: "598557",
    date: "29/03/2025",
    status: "LIBERADA PARA CESTA" as const,
    description: "Prestação de Serviço especializada de Assessoria e Consultoria para a equipe de assistência Social",
    userName: "Vitor Santos Junior",
  },
  {
    id: "598558",
    date: "29/03/2025",
    status: "EM ABERTO" as const,
    description: "Prestação de Serviço especializada de Assessoria e Consultoria para a equipe de assistência Social",
    userName: "Vitor Santos Junior",
  },
  {
    id: "598559",
    date: "28/03/2025",
    status: "EM ANDAMENTO" as const,
    description: "Aquisição de materiais de escritório para o departamento administrativo",
    userName: "Ana Silva",
  },
  {
    id: "598560",
    date: "27/03/2025",
    status: "PRONTA" as const,
    description: "Contratação de serviços de manutenção predial para a sede administrativa",
    userName: "Carlos Oliveira",
  },
]

type StatusType = "EM ANDAMENTO" | "PRONTA" | "LIBERADA PARA CESTA" | "EM ABERTO"
type SortOrder = "asc" | "desc"

// Componente de Dropdown personalizado
interface DropdownProps {
  trigger: React.ReactNode
  children: (close: () => void) => React.ReactNode
}

function CustomDropdown({ trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeDropdown = () => setIsOpen(false)

  // Fechar dropdown quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 rounded-md bg-white shadow-lg border border-[#e0e0e0]">
          {children(closeDropdown)}
        </div>
      )}
    </div>
  )
}

// Componente de Calendário Simples
function SimpleCalendar({ onSelectDate, onClose }: { onSelectDate: (date: string) => void; onClose: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const formattedDate = `${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${selectedDate.getFullYear()}`
    onSelectDate(formattedDate)
    onClose()
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())

    const days = []

    // Adicionar dias vazios para alinhar com o dia da semana correto
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleSelectDate(day)}
          className="h-8 w-8 rounded-full hover:bg-[#f5f6fa] flex items-center justify-center text-sm"
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-1">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-medium">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button onClick={handleNextMonth} className="p-1">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
          <div key={index} className="h-8 w-8 flex items-center justify-center text-xs text-[#646464]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      <div className="mt-3 flex justify-end">
        <button onClick={onClose} className="px-3 py-1 text-sm text-[#646464] hover:bg-[#f5f6fa] rounded">
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function PriceBaskets() {
  const [selectedBasket, setSelectedBasket] = useState<any>(null)
  const [filteredBaskets, setFilteredBaskets] = useState(allBasketsData)
  const [visibleBaskets, setVisibleBaskets] = useState<typeof allBasketsData>([])
  const [itemsToShow, setItemsToShow] = useState(4)

  // Filtros
  const [statusFilter, setStatusFilter] = useState<StatusType | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...allBasketsData]

    // Filtrar por status
    if (statusFilter) {
      result = result.filter((basket) => basket.status === statusFilter)
    }

    // Filtrar por data
    if (dateFilter) {
      result = result.filter((basket) => basket.date === dateFilter)
    }

    // Ordenar por ID
    result.sort((a, b) => {
      const idA = Number.parseInt(a.id)
      const idB = Number.parseInt(b.id)
      return sortOrder === "asc" ? idA - idB : idB - idA
    })

    setFilteredBaskets(result)
  }, [statusFilter, dateFilter, sortOrder])

  // Atualizar cestas visíveis com base na paginação
  useEffect(() => {
    setVisibleBaskets(filteredBaskets.slice(0, itemsToShow))
  }, [filteredBaskets, itemsToShow])

  // Handlers
  const handleBasketClick = (basket: any) => {
    setSelectedBasket(basket)
  }

  const handleClearFilters = () => {
    setStatusFilter(null)
    setDateFilter(null)
    setSortOrder("desc")
  }

  const handleShowMore = () => {
    setItemsToShow((prev) => prev + 4)
  }

  // Obter o texto do filtro atual
  const getStatusFilterText = () => {
    return statusFilter || "Filtrar por Status"
  }

  const getDateFilterText = () => {
    return dateFilter || "Filtrar por Data"
  }

  const getSortOrderText = () => {
    return sortOrder === "asc" ? "Crescente" : "Decrescente"
  }

  return (
      <div className="flex flex-col">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} />
          ))}
        </div>

        {/* Filter Controls */}
        <div className="grid sm:flex grid-cols-2 sm:col-span-0  gap-2 mb-6">
          {/* Status Filter Dropdown */}
          <CustomDropdown
            trigger={
              <button className="flex items-center justify-between px-3 py-2 bg-white border border-[#e0e0e0] rounded">
                <Filter className="h-5 w-5 text-[#646464] mr-2" />
                <span className="text-sm">{getStatusFilterText()}</span>
                <ChevronDown className="h-4 w-4 text-[#646464] ml-2" />
              </button>
            }
          >
            {(close) => (
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5f6fa]"
                  onClick={() => {
                    setStatusFilter(null)
                    close()
                  }}
                >
                  Todos
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5f6fa]"
                  onClick={() => {
                    setStatusFilter("EM ANDAMENTO")
                    close()
                  }}
                >
                  EM ANDAMENTO
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5f6fa]"
                  onClick={() => {
                    setStatusFilter("PRONTA")
                    close()
                  }}
                >
                  PRONTA
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5f6fa]"
                  onClick={() => {
                    setStatusFilter("LIBERADA PARA CESTA")
                    close()
                  }}
                >
                  LIBERADA PARA CESTA
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5f6fa]"
                  onClick={() => {
                    setStatusFilter("EM ABERTO")
                    close()
                  }}
                >
                  EM ABERTO
                </button>
              </div>
            )}
          </CustomDropdown>

          {/* Date Filter Dropdown with Calendar */}
          <CustomDropdown
            trigger={
              <button className="flex items-center justify-between px-3 py-2 bg-white border border-[#e0e0e0] rounded">
                <CalendarIcon className="h-5 w-5 text-[#646464] mr-2" />
                <span className="text-sm">{getDateFilterText()}</span>
                <ChevronDown className="h-4 w-4 text-[#646464] ml-2" />
              </button>
            }
          >
            {(close) => (
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5f6fa]"
                  onClick={() => {
                    setDateFilter(null)
                    close()
                  }}
                >
                  Todas as datas
                </button>
                <div className="border-t border-[#e0e0e0] mt-1 pt-1">
                  <SimpleCalendar
                    onSelectDate={(date) => {
                      setDateFilter(date)
                    }}
                    onClose={close}
                  />
                </div>
              </div>
            )}
          </CustomDropdown>

          {/* Sort Order Dropdown */}
          <CustomDropdown
            trigger={
              <button className="flex items-center justify-between px-3 py-2 bg-white border border-[#e0e0e0] rounded">
                <span className="text-sm">Ordenar: {getSortOrderText()}</span>
                <ChevronDown className="h-4 w-4 text-[#646464] ml-2" />
              </button>
            }
          >
            {(close) => (
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5f6fa]"
                  onClick={() => {
                    setSortOrder("asc")
                    close()
                  }}
                >
                  Crescente
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5f6fa]"
                  onClick={() => {
                    setSortOrder("desc")
                    close()
                  }}
                >
                  Decrescente
                </button>
              </div>
            )}
          </CustomDropdown>

          <button className="flex items-center text-[#ea0234] text-sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar Filtros
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - List */}
          <div className="w-full bg-white p-4 rounded-lg lg:w-[300px] flex-shrink-0">
            <button className="w-full bg-[#7baa3d] text-white py-3 rounded mb-4 font-medium">NOVA CESTA</button>

            <div className="space-y-4">
              {visibleBaskets.map((basket) => (
                <BasketItem
                  key={basket.id}
                  id={basket.id}
                  date={basket.date}
                  status={basket.status}
                  description={basket.description}
                  userName={basket.userName}
                  onClick={() => handleBasketClick(basket)}
                />
              ))}

              {visibleBaskets.length < filteredBaskets.length && (
                <div className="flex justify-center">
                  <button className="px-4 py-2 bg-[#EBF0FA] text-[#302f2f] font-bold rounded text-sm" onClick={handleShowMore}>
                    Mostrar mais
                  </button>
                </div>
              )}

              {visibleBaskets.length === 0 && (
                <div className="text-center py-4 text-[#646464]">Nenhuma cesta encontrada com os filtros atuais.</div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-1 flex items-center justify-center bg-white border border-[#e0e0e0] rounded min-h-[400px]">
            {selectedBasket ? (
              <div className="p-6 w-full">
                <h2 className="text-xl font-medium mb-4">Detalhes da Cesta #{selectedBasket.id}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#646464] mb-1">Status:</p>
                    <span
                      className={`inline-block px-3 py-1 ${STATUS_CONFIG[selectedBasket.status as keyof typeof STATUS_CONFIG].bgColor} text-white text-xs rounded`}
                    >
                      {selectedBasket.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#646464] mb-1">Data:</p>
                    <p>{selectedBasket.date}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-[#646464] mb-1">Descrição:</p>
                    <p>{selectedBasket.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#646464] mb-1">Responsável:</p>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{selectedBasket.userName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <h2 className="text-2xl text-[#646464] font-medium">Aqui os detalhes de cada cesta</h2>
            )}
          </div>
        </div>
      </div>
  )
}

const STATUS_CONFIG = {
  "EM ANDAMENTO": { label: "EM ANDAMENTO", bgColor: "bg-[#78b6e8]" },
  PRONTA: { label: "PRONTA", bgColor: "bg-[#8fe878]" },
  "LIBERADA PARA CESTA": { label: "LIBERADA PARA CESTA", bgColor: "bg-[#9078e8]" },
  "EM ABERTO": { label: "EM ABERTO", bgColor: "bg-[#decc49]" },
}

