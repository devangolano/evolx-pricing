"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Filter,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  List,
  Trash2,
  Check,
  ChevronDown,
  Plus,
  Download,
  User,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type StatusType = "EM ANDAMENTO" | "PRONTA" | "LIBERADA PARA CESTA" | "EM ABERTO"
type SortOrder = "asc" | "desc"

// Define the interface outside of the JSX
interface BasketDetail {
  id: string
  date: string
  status: StatusType
  description: string
  userName: string
  userNumber?: string
  elementType?: string
  calculationType?: string
  decimals?: number
  supportStatus?: string
  clientStatus?: string
  finalizedDate?: string
  basketDate?: string
  quotationDeadline?: string
  possession?: string
  files?: {
    name: string
    size: string
    sentDate: string
  }[]
  purchaseFiles?: {
    name: string
    size: string
    sentDate: string
  }[]
}

// Update the existing allBasketsData declaration with the proper type
const allBasketsData: BasketDetail[] = [
  {
    id: "56368",
    date: "24/03/2025 20:50",
    status: "PRONTA",
    description: "REGISTRO DE PREÇOS DE GÁS",
    userName: "Fernanda de Medeiros Basilio",
    userNumber: "4",
  },
  {
    id: "55920",
    date: "21/03/2025 00:59",
    status: "LIBERADA PARA CESTA",
    description: "CONTRAT.EMPRESA ESP.PARA ELAB.PROJETOS DE COMBATE AO INCENDIO E PÂNICO - ESCOLAS E FESTIVIDADES",
    userName: "Fernanda de Medeiros Basilio",
    userNumber: "28",
  },
  {
    id: "55441",
    date: "18/03/2025 19:56",
    status: "PRONTA",
    description: "AQUISIÇÃO DE KITS DE HIGIENE BUCAL",
    userName: "João paulo Pereira Domingos",
    userNumber: "1",
    elementType: "LICITAÇÃO",
    calculationType: "MÉDIA ARITMÉTICA",
    decimals: 3,
    supportStatus: "FINALIZADA",
    clientStatus: "PRONTA",
    possession: "CLIENTE",
    finalizedDate: "26/03/2025 20:08",
    basketDate: "26/03/2025",
    files: [
      {
        name: "MAPA DE APURAÇÃO DE PREÇOS.pdf",
        size: "282.65 KB",
        sentDate: "26/03/2025 20h08",
      },
      {
        name: "PESQUISAS UNIFICADAS.pdf",
        size: "209.39 KB",
        sentDate: "26/03/2025 20h08",
      },
      {
        name: "PORTAL NACIONAL DE CONTRATAÇÕES PÚBLICAS.pdf",
        size: "194.84 KB",
        sentDate: "26/03/2025 20h08",
      },
      {
        name: "PORTAL DA TRANSPARÊNCIA - CGU - NFE.pdf",
        size: "194.87 KB",
        sentDate: "26/03/2025 20h08",
      },
      {
        name: "MAPA DE APURAÇÃO DE PREÇOS.xlsx",
        size: "7.76 KB",
        sentDate: "26/03/2025 20h08",
      },
      {
        name: "TERMO DE REFERÊNCIA.xlsx",
        size: "7.48 KB",
        sentDate: "26/03/2025 20h08",
      },
    ],
    purchaseFiles: [
      {
        name: "ITMEDICA.pdf",
        size: "1.93 KB",
        sentDate: "18/03/2025 19h56",
      },
      {
        name: "ARQUIVO PARA ORÇAMENTO - KIT HIGIENE BUCAL.pdf",
        size: "88.88 KB",
        sentDate: "18/03/2025 19h56",
      },
      {
        name: "JFB.pdf",
        size: "199.41 KB",
        sentDate: "18/03/2025 19h56",
      },
    ],
  },
  {
    id: "55425",
    date: "18/03/2025 19:01",
    status: "PRONTA",
    description: "AQUISIÇÃO DE RAÇÕES PARA ATENDER CÃES E GATOS",
    userName: "João paulo Pereira Domingos",
    userNumber: "3",
  },
  {
    id: "55422",
    date: "18/03/2025 18:55",
    status: "PRONTA",
    description: "CONTRATAÇÃO DE EMPRESA ESPECIALIZADA EM ENGENHARIA",
    userName: "João paulo Pereira Domingos",
    userNumber: "2",
  },
]

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
        <Button key={day} onClick={() => handleSelectDate(day)} variant="ghost" className="h-8 w-8 p-0 rounded-full">
          {day}
        </Button>,
      )
    }

    return days
  }

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth} variant="ghost" size="icon" className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <Button onClick={handleNextMonth} variant="ghost" size="icon" className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
          <div key={index} className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      <div className="mt-3 flex justify-end">
        <Button onClick={onClose} variant="ghost" size="sm">
          Cancelar
        </Button>
      </div>
    </div>
  )
}


export default function PriceBaskets() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [selectedBasket, setSelectedBasket] = useState<BasketDetail | null>(null)
  const [filteredBaskets, setFilteredBaskets] = useState(allBasketsData)
  const [visibleBaskets, setVisibleBaskets] = useState<typeof allBasketsData>([])
  const [itemsToShow, setItemsToShow] = useState(10)
  // Add state to control mobile view
  const [showDetailsMobile, setShowDetailsMobile] = useState(false)

  // Filtros
  const [statusFilter, setStatusFilter] = useState<StatusType | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Atualizar a cesta selecionada quando o ID na URL mudar
  useEffect(() => {
    if (id) {
      const basket = allBasketsData.find((basket) => basket.id === id)
      setSelectedBasket(basket || null)
      // Show details on mobile when ID is in URL
      setShowDetailsMobile(!!basket)
    } else {
      setSelectedBasket(null)
      // Hide details on mobile when no ID in URL
      setShowDetailsMobile(false)
    }
  }, [id])

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
  const handleBasketClick = (basket: BasketDetail) => {
    // Atualizar a URL quando uma cesta for selecionada
    navigate(`/basket/${basket.id}`)
    setSelectedBasket(basket)
    // Show details on mobile when basket is clicked
    setShowDetailsMobile(true)
  }

  // Add handler to go back to list on mobile
  const handleBackToList = () => {
    navigate("/cestas-precos")
    setSelectedBasket(null)
    setShowDetailsMobile(false)
  }

  const handleClearFilters = () => {
    setStatusFilter(null)
    setDateFilter(null)
    setSortOrder("desc")
  }

  const handleShowMore = () => {
    setItemsToShow((prev) => prev + 5)
  }

  const getStatusFilterText = () => {
    return statusFilter || "Filtrar por Status"
  }

  const getDateFilterText = () => {
    return dateFilter || "Filtrar por Data"
  }

  const getSortOrderText = () => {
    return sortOrder === "asc" ? "Crescente" : "Decrescente"
  }

  const getStatusBadgeColor = (status: StatusType) => {
    switch (status) {
      case "EM ANDAMENTO":
        return "bg-blue-500 text-white hover:bg-blue-600"
      case "PRONTA":
        return "bg-green-500 text-white hover:bg-green-600"
      case "LIBERADA PARA CESTA":
        return "bg-purple-500 text-white hover:bg-purple-600"
      case "EM ABERTO":
        return "bg-yellow-500 text-white hover:bg-yellow-600"
      default:
        return "bg-gray-500 text-white hover:bg-gray-600"
    }
  }

  return (
    <div className="container mx-auto sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
      {/* Stats Cards - Hide when showing details on mobile */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 ${showDetailsMobile ? "hidden sm:grid" : ""}`}>
        <div className="bg-white shadow rounded-lg p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Cestas Finalizadas</h3>
          <p className="text-xl sm:text-2xl font-bold">5862</p>
        </div>
        <div className="bg-white shadow rounded-lg p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Cestas em andamento</h3>
          <p className="text-xl sm:text-2xl font-bold">25</p>
        </div>
        <div className="bg-white shadow rounded-lg p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Cestas em Abertos</h3>
          <p className="text-xl sm:text-2xl font-bold">69</p>
        </div>
        <div className="bg-white shadow rounded-lg p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Total de Orçamentos</h3>
          <p className="text-xl sm:text-2xl font-bold">521</p>
        </div>
      </div>

      {/* Filter Controls - Hide when showing details on mobile */}
      <div className={`flex flex-wrap gap-2 ${showDetailsMobile ? "hidden sm:flex" : ""}`}>
        {/* Status Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 bg-white h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate max-w-[80px] sm:max-w-none">{getStatusFilterText()}</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("EM ANDAMENTO")}>EM ANDAMENTO</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("PRONTA")}>PRONTA</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("LIBERADA PARA CESTA")}>
              LIBERADA PARA CESTA
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("EM ABERTO")}>EM ABERTO</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter Dropdown with Calendar */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 bg-white h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
            >
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate max-w-[80px] sm:max-w-none">{getDateFilterText()}</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 border-b">
              <Button variant="ghost" className="w-full justify-start text-left" onClick={() => setDateFilter(null)}>
                Todas as datas
              </Button>
            </div>
            <SimpleCalendar onSelectDate={(date) => setDateFilter(date)} onClose={() => {}} />
          </PopoverContent>
        </Popover>

        {/* Sort Order Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 bg-white h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
            >
              <span className="truncate max-w-[80px] sm:max-w-none">Ordenar: {getSortOrderText()}</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setSortOrder("asc")}>Crescente</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("desc")}>Decrescente</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
          onClick={handleClearFilters}
        >
          Limpar Filtros
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
        {/* Left Column - List - Hide when showing details on mobile */}
        <div
          className={`w-full md:w-[345px] bg-white border border-gray-200 flex-shrink-0 flex flex-col rounded-lg overflow-hidden ${
            showDetailsMobile ? "hidden sm:flex" : "flex"
          }`}
        >
          <div className="p-2 sm:p-3 border-b border-gray-200">
            <Button className="w-full bg-[#7baa3d] hover:bg-[#6a9934] text-white h-8 sm:h-9 text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              NOVA CESTA
            </Button>
          </div>

          <ScrollArea className="flex-1 h-[calc(100vh-250px)] sm:h-[calc(100vh-300px)]">
            <div className="divide-y divide-gray-200">
              {visibleBaskets.map((basket) => (
                <div
                  key={basket.id}
                  className={cn(
                    "p-2 sm:p-3 cursor-pointer transition-colors",
                    selectedBasket?.id === basket.id ? "bg-gray-100" : "hover:bg-gray-50",
                  )}
                  onClick={() => handleBasketClick(basket)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">#{basket.id}</span>
                      <span className="ml-2 text-gray-500 text-xs sm:text-sm">{basket.date}</span>
                    </div>
                  </div>

                  <div className="mb-1 sm:mb-2">
                    <Badge className={`${getStatusBadgeColor(basket.status)} text-xs`} variant="secondary">
                      {basket.status}
                    </Badge>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2 line-clamp-2">{basket.description}</div>

                  <div className="flex items-center text-xs text-gray-500">
                    <User size={12} className="mr-1" />
                    <span className="truncate">{basket.userName}</span>
                    {basket.userNumber && <span className="ml-1 flex-shrink-0">#{basket.userNumber}</span>}
                  </div>
                </div>
              ))}

              {visibleBaskets.length < filteredBaskets.length && (
                <div className="p-2 sm:p-3 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleShowMore}
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    Mostrar mais
                  </Button>
                </div>
              )}

              {visibleBaskets.length === 0 && (
                <div className="p-4 sm:p-6 text-center text-gray-500 text-sm">
                  Nenhuma cesta encontrada com os filtros atuais.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column - Details - Show full width on mobile when a basket is selected */}
        <div
          className={`flex-1 bg-white border border-gray-200 flex flex-col rounded-lg overflow-hidden ${
            !selectedBasket && !showDetailsMobile ? "hidden md:flex" : "flex w-full"
          }`}
        >
          {selectedBasket ? (
            <>
              {/* Header with back button */}
              <div className="bg-gray-50 p-2 sm:p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center">
                  <Button
                    onClick={handleBackToList}
                    variant="outline"
                    className="mr-2 text-gray-700 hover:bg-gray-100 flex items-center h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm"
                  >
                    <ChevronLeft size={14} className="mr-0 sm:mr-1" />
                    <span className="hidden sm:inline">Voltar</span>
                  </Button>
                  <h2 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                    <span className="">Detalhes</span>
                  </h2>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-7 w-7 sm:h-8 sm:w-8"
                  >
                    <Trash2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-7 w-7 sm:h-8 sm:w-8"
                  >
                    <Check size={14} />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)]">
                {selectedBasket.id === "55441" ? (
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-md flex items-start">
                      <Info size={14} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-blue-700">
                        Caso necessite de ajuda para elaboração da cesta, mantenha a posse com o SUPORTE, se preferir
                        fazer tudo por conta própria, altere a posse para CLIENTE.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <Button variant="link" className="text-blue-600 p-0 h-auto font-medium text-xs sm:text-sm">
                        <List size={12} className="mr-1.5" />
                        VISUALIZAR/ADICIONAR ITENS
                      </Button>
                      <Button variant="link" className="text-blue-600 p-0 h-auto text-xs sm:text-sm">
                        ADICIONAR OBSERVAÇÃO SOBRE A CESTA
                      </Button>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm italic">Nenhuma observação registrada!</p>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">OBJETO</h3>
                      <div className="p-2 bg-gray-50 rounded-md text-xs sm:text-sm text-gray-700 border border-gray-200">
                        {selectedBasket.description}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">ELEMENTO DE DESPESA</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-8 sm:h-9 text-xs sm:text-sm"
                            >
                              <span className="truncate">MATERIAL DE CONSUMO / HIGIENE</span>
                              <ChevronDown size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>MATERIAL DE CONSUMO</DropdownMenuItem>
                            <DropdownMenuItem>MATERIAL DE HIGIENE</DropdownMenuItem>
                            <DropdownMenuItem>OUTROS</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">TIPO DE CONTRATAÇÃO</h3>
                        <div className="p-2 bg-gray-50 rounded-md text-xs sm:text-sm text-gray-700 border border-gray-200 h-8 sm:h-9 flex items-center">
                          {selectedBasket.elementType}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">TIPO DE CÁLCULO</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-8 sm:h-9 text-xs sm:text-sm"
                            >
                              <span className="truncate">{selectedBasket.calculationType}</span>
                              <ChevronDown size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>MÉDIA ARITMÉTICA</DropdownMenuItem>
                            <DropdownMenuItem>MEDIANA</DropdownMenuItem>
                            <DropdownMenuItem>MENOR PREÇO</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">CASAS DECIMAIS</h3>
                        <div className="flex items-center space-x-3 sm:space-x-4 mt-1 sm:mt-2">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Checkbox
                              id="decimal-2"
                              className="border-gray-300 data-[state=checked]:bg-[#7baa3d] data-[state=checked]:border-[#7baa3d] h-3.5 w-3.5 sm:h-4 sm:w-4"
                            />
                            <label htmlFor="decimal-2" className="text-xs sm:text-sm cursor-pointer text-gray-700">
                              2
                            </label>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Checkbox
                              id="decimal-3"
                              defaultChecked
                              className="border-gray-300 data-[state=checked]:bg-[#7baa3d] data-[state=checked]:border-[#7baa3d] h-3.5 w-3.5 sm:h-4 sm:w-4"
                            />
                            <label htmlFor="decimal-3" className="text-xs sm:text-sm cursor-pointer text-gray-700">
                              3
                            </label>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Checkbox
                              id="decimal-4"
                              className="border-gray-300 data-[state=checked]:bg-[#7baa3d] data-[state=checked]:border-[#7baa3d] h-3.5 w-3.5 sm:h-4 sm:w-4"
                            />
                            <label htmlFor="decimal-4" className="text-xs sm:text-sm cursor-pointer text-gray-700">
                              4
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">DATA DA SOLICITAÇÃO</h3>
                        <div className="p-2 bg-gray-50 rounded-md text-xs sm:text-sm text-gray-700 border border-gray-200 h-8 sm:h-9 flex items-center">
                          18/03/2025 19:56
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">SITUAÇÃO SUPORTE</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-8 sm:h-9 text-xs sm:text-sm"
                            >
                              <span className="truncate">{selectedBasket.supportStatus}</span>
                              <ChevronDown size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>FINALIZADA</DropdownMenuItem>
                            <DropdownMenuItem>EM ANDAMENTO</DropdownMenuItem>
                            <DropdownMenuItem>PENDENTE</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">SITUAÇÃO CLIENTE</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-8 sm:h-9 text-xs sm:text-sm"
                            >
                              <span className="truncate">{selectedBasket.clientStatus}</span>
                              <ChevronDown size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>PRONTA</DropdownMenuItem>
                            <DropdownMenuItem>EM ANÁLISE</DropdownMenuItem>
                            <DropdownMenuItem>AGUARDANDO</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">POSSE</h3>
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="mr-2 py-0.5 sm:py-1 px-1.5 sm:px-2 border-gray-200 text-gray-700 text-xs sm:text-sm"
                          >
                            {selectedBasket.possession}
                          </Badge>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Plus size={10} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">DATA DA FINALIZAÇÃO</h3>
                        <div className="p-2 bg-gray-50 rounded-md text-xs sm:text-sm text-gray-700 border border-gray-200 h-8 sm:h-9 flex items-center">
                          {selectedBasket.finalizedDate}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">DATA DA CESTA</h3>
                        <div className="p-2 bg-gray-50 rounded-md text-xs sm:text-sm text-gray-700 border border-gray-200 h-8 sm:h-9 flex items-center">
                          {selectedBasket.basketDate}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">
                        PRAZO PARA ENVIO DE COTAÇÕES
                      </h3>
                      <div className="p-2 bg-gray-50 rounded-md text-xs sm:text-sm text-gray-700 border border-gray-200 h-8 sm:h-9 flex items-center">
                        {selectedBasket.quotationDeadline || "Não definido"}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">RELATÓRIOS</h3>
                      <div className="p-2 bg-gray-50 rounded-md text-xs sm:text-sm flex items-center justify-between text-gray-700 border border-gray-200">
                        <span className="truncate">MÉDIA DE PREÇOS (MAPA)</span>
                        <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 hover:text-red-600 hover:bg-gray-100"
                          >
                            <FileText size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7 text-green-500 hover:text-green-600 hover:bg-gray-100"
                          >
                            <FileSpreadsheet size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <ChevronDown size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">CORRIGIR VALORES</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <h4 className="text-xs uppercase text-gray-500 mb-1">INCIDIR SOBRE</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-8 sm:h-9 text-xs sm:text-sm"
                              >
                                <span className="truncate">NÃO CORRIGIR</span>
                                <ChevronDown size={12} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>NÃO CORRIGIR</DropdownMenuItem>
                              <DropdownMenuItem>TODOS OS ITENS</DropdownMenuItem>
                              <DropdownMenuItem>ITENS SELECIONADOS</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div>
                          <h4 className="text-xs uppercase text-gray-500 mb-1">ÍNDICE</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-8 sm:h-9 text-xs sm:text-sm"
                              >
                                <span className="truncate">Selecionar</span>
                                <ChevronDown size={12} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>IPCA</DropdownMenuItem>
                              <DropdownMenuItem>INPC</DropdownMenuItem>
                              <DropdownMenuItem>IGP-M</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div>
                          <h4 className="text-xs uppercase text-gray-500 mb-1">DATA INICIAL</h4>
                          <Button
                            variant="outline"
                            className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-8 sm:h-9 text-xs sm:text-sm"
                          >
                            <span className="truncate">Selecionar data</span>
                            <CalendarIcon size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">ARQUIVOS CESTA</h3>
                      <div className="space-y-2">
                        {selectedBasket.files &&
                          selectedBasket.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                              <div className="flex items-center">
                                <FileText size={12} className="text-red-500 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                                  {file.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                                  {file.size} • {file.sentDate}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 sm:h-7 sm:w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                >
                                  <Download size={12} />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-xs font-semibold uppercase text-gray-500">ARQUIVOS COMPRAS</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-gray-200 hover:bg-gray-50 h-6 sm:h-7 text-[10px] sm:text-xs px-1.5 sm:px-2"
                        >
                          <Plus size={10} className="mr-1" />
                          ADICIONAR
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {selectedBasket.purchaseFiles &&
                          selectedBasket.purchaseFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                              <div className="flex items-center">
                                <FileText size={12} className="text-red-500 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                                  {file.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                                  {file.size} • {file.sentDate}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 sm:h-7 sm:w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                >
                                  <Download size={12} />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px]">
                    <div className="text-center text-gray-500 px-4">
                      <h2 className="text-lg sm:text-xl font-medium">
                        Selecione a cesta #55441 para ver os detalhes completos
                      </h2>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 px-4">
                <h2 className="text-lg sm:text-xl font-medium">Selecione uma cesta para ver os detalhes</h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

