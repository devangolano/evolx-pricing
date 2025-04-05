"use client"

import type React from "react"
import { useState, useEffect, useRef, type ChangeEvent } from "react"
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
  User,
  FileSpreadsheet,
  X,
  Barcode,
  Upload,
  File,
  FileIcon as FilePdf,
  FileImage,
  FileArchive,
  ArrowDownToLine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { notify } from "@/config/toast"
import { NewBasketFormContent } from "@/pages/new-basket-form"
import {
  type BasketDetail,
  type FileItem,
  fetchBaskets,
  fetchBasketById,
  updateBasket,
  deleteBasket,
  fetchBasketFiles,
  uploadFiles,
  deleteFile,
  downloadFile,
} from "@/services/basket-service"
import { formatFileSize } from "@/utils/api-helpers"
import { ExpenseElementSelector } from "@/components/expense-element-selector"

type StatusType = "CADASTRO" | "EM ANDAMENTO" | "PRONTA" | "LIBERADA PARA CESTA" | "EM ABERTO"
type SortOrder = "asc" | "desc"

function SimpleCalendar({ onSelectDate, onClose }: { onSelectDate: (date: string) => void; onClose: () => void }) {
  const [date] = useState(new Date()) // Removido setDate pois não é usado
  const [month, setMonth] = useState(date.getMonth())
  const [year, setYear] = useState(date.getFullYear())

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const getDaysArray = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const daysArray = getDaysArray()

  const handleDayClick = (day: number | null) => {
    if (day !== null) {
      // Garantindo que day seja number
      const selectedDate = `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`
      onSelectDate(selectedDate)
      onClose()
    }
  }

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  return (
    <div className="w-64">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-semibold">
          {new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((day, index) => (
          <div key={index} className="text-xs text-center text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(day)}
            className={`text-sm text-center rounded-full ${
              day ? "hover:bg-gray-100" : "text-gray-300 cursor-default"
            } ${
              day === date.getDate() && month === date.getMonth() && year === date.getFullYear()
                ? "bg-blue-500 text-white"
                : ""
            } py-1`}
            disabled={!day}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

function DocumentSearchModal({ onClose, onSelect }: { onClose: () => void; onSelect: (code: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults] = useState([
    // Removido setSearchResults pois não é usado
    { id: "12345", title: "Documento de Teste 1" },
    { id: "67890", title: "Documento de Teste 2" },
    { id: "54321", title: "Documento de Teste 3" },
  ])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSelect = (code: string) => {
    onSelect(code)
    onClose()
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Pesquisar documentos..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </div>
      <ScrollArea className="max-h-48">
        <div className="divide-y divide-gray-200">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="p-2 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelect(result.id)}
            >
              {result.title} ({result.id})
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  )
}

function FileUploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: (files: FileItem[]) => void }) {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: FileItem[] = []
      Array.from(e.target.files).forEach((file) => {
        const now = new Date()
        const formattedDate = now.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        const fileSize = formatFileSize(file.size)
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || ""
        let fileType = "other"
        if (["pdf"].includes(fileExtension)) fileType = "pdf"
        else if (["doc", "docx"].includes(fileExtension)) fileType = "word"
        else if (["xls", "xlsx"].includes(fileExtension)) fileType = "excel"
        else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) fileType = "image"
        else if (["zip", "rar", "7z"].includes(fileExtension)) fileType = "archive"
        newFiles.push({ name: file.name, size: fileSize, sentDate: formattedDate, type: fileType, file })
      })
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    onUpload(selectedFiles)
    onClose()
  }

  const getFileIcon = (fileType: string | undefined) => {
    switch (fileType) {
      case "pdf":
        return <FilePdf className="h-4 w-4 text-red-500" />
      case "word":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />
      case "image":
        return <FileImage className="h-4 w-4 text-purple-500" />
      case "archive":
        return <FileArchive className="h-4 w-4 text-yellow-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-1">Clique para selecionar arquivos ou arraste e solte aqui</p>
        <p className="text-xs text-gray-500">Suporta PDF, Word, Excel, imagens e outros formatos</p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.rar"
        />
      </div>
      {selectedFiles.length > 0 && (
        <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <div key={index} className="p-3 flex justify-between items-center">
              <div className="flex items-center">
                {getFileIcon(file.type)} <span className="ml-2 text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">{file.size}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-gray-100"
                  onClick={() => handleRemoveFile(index)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0}
          className="bg-[#7baa3d] hover:bg-[#6a9934] text-white"
        >
          Enviar {selectedFiles.length > 0 && `(${selectedFiles.length})`}
        </Button>
      </div>
    </div>
  )
}

function FileViewerModal({ file, onClose }: { file: FileItem; onClose: () => void }) {
  const getFileComponent = (file: FileItem) => {
    switch (file.type) {
      case "pdf":
        return (
          <embed src={URL.createObjectURL(file.file as Blob)} type="application/pdf" className="w-full h-[600px]" />
        )
      case "image":
        return (
          <img
            src={URL.createObjectURL(file.file as Blob) || "/placeholder.svg"}
            alt={file.name}
            className="w-full max-h-[600px]"
          />
        )
      default:
        return (
          <div className="text-center p-4">
            <File className="mx-auto h-12 w-12 text-gray-500" />
            <p className="text-sm text-gray-500 mt-2">Visualização não disponível para este tipo de arquivo.</p>
          </div>
        )
    }
  }

  return (
    <div className="p-4">
      {file.file ? (
        getFileComponent(file)
      ) : (
        <div className="text-center p-4">
          <File className="mx-auto h-12 w-12 text-gray-500" />
          <p className="text-sm text-gray-500 mt-2">Arquivo não encontrado.</p>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  )
}

export default function PriceBaskets() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isNewBasketMode, setIsNewBasketMode] = useState(false)
  const [selectedBasket, setSelectedBasket] = useState<BasketDetail | null>(null)
  const [filteredBaskets, setFilteredBaskets] = useState<BasketDetail[]>([])
  const [visibleBaskets, setVisibleBaskets] = useState<BasketDetail[]>([])
  const [itemsToShow, setItemsToShow] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDetailsMobile, setShowDetailsMobile] = useState(false)
  const [isDocSearchOpen, setIsDocSearchOpen] = useState(false)
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false)
  const [fileUploadType, setFileUploadType] = useState<"basket" | "purchase">("basket")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [isFileViewerOpen, setIsFileViewerOpen] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<StatusType | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [expenseElement, setExpenseElement] = useState<string>("")
  const [calculationType, setCalculationType] = useState<string>("")
  const [supportStatus, setSupportStatus] = useState<string>("")
  const [clientStatus, setClientStatus] = useState<string>("")
  const [correctionTarget, setCorrectionTarget] = useState<string>("")
  const [correctionIndex, setCorrectionIndex] = useState<string>("")
  const [correctionStartDate, setCorrectionStartDate] = useState<string | null>(null)
  const [correctionEndDate, setCorrectionEndDate] = useState<string | null>(null)
  const [decimals, setDecimals] = useState<number>(3)
  const [researchDocuments, setResearchDocuments] = useState<string>("")
  const [possession, setPossession] = useState<string>("")
  const [quotationDeadline, setQuotationDeadline] = useState<string | null>(null)
  const [basketFiles, setBasketFiles] = useState<FileItem[]>([])
  const [purchaseFiles, setPurchaseFiles] = useState<FileItem[]>([])

  useEffect(() => {
    async function loadBaskets() {
      try {
        setIsLoading(true)
        setError(null)
        const baskets = await fetchBaskets()

        // Verificar se os dados estão sendo recebidos corretamente
        console.log("Dados recebidos da API:", baskets)

        if (!baskets || !Array.isArray(baskets)) {
          throw new Error("Formato de dados inválido recebido da API")
        }

        let filtered = [...baskets]

        if (statusFilter) {
          filtered = filtered.filter((basket) => basket.status === statusFilter)
        }

        if (dateFilter) {
          filtered = filtered.filter((basket) => {
            const basketDate = basket.requestDate ? new Date(basket.requestDate) : null
            const filterDate = new Date(dateFilter)
            return basketDate && basketDate.toDateString() === filterDate.toDateString()
          })
        }

        filtered.sort((a, b) => {
          if (sortOrder === "asc") {
            return Number.parseInt(a.id) - Number.parseInt(b.id)
          }
          return Number.parseInt(b.id) - Number.parseInt(a.id)
        })

        setFilteredBaskets(filtered)
      } catch (err) {
        console.error("Erro ao carregar cestas:", err)
        setError("Não foi possível carregar as cestas. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }
    loadBaskets()
  }, [statusFilter, dateFilter, sortOrder, isNewBasketMode]) // Adicionado isNewBasketMode para recarregar quando uma nova cesta é criada

  useEffect(() => {
    async function loadBasketDetails(basketId: string) {
      try {
        setIsLoading(true)
        setError(null)
        const basket = await fetchBasketById(basketId)
        const files = await fetchBasketFiles(basketId)

        // Log para depuração
        console.log("Detalhes da cesta recebidos:", basket)

        const basketFiles = files.filter((file) => file.fileCategory === "basket" || !file.fileCategory)
        const purchaseFiles = files.filter((file) => file.fileCategory === "purchase")

        setSelectedBasket(basket)
        setBasketFiles(basketFiles)
        setPurchaseFiles(purchaseFiles)

        // Atualizar estados com os dados exatos da API, sem usar || para valores null
        setCalculationType(basket.calculationType)
        setSupportStatus(basket.supportStatus)
        setClientStatus(basket.clientStatus)
        setDecimals(basket.decimals)
        setExpenseElement(basket.expenseElement)
        setResearchDocuments(basket.researchDocuments ?? "")
        setCorrectionIndex(basket.correctionIndex ?? "")
        setCorrectionTarget(basket.correctionTarget ?? "")
        setCorrectionStartDate(basket.correctionStartDate ?? null)
        setCorrectionEndDate(basket.correctionEndDate ?? null)
        setPossession(basket.possession)
        setQuotationDeadline(basket.quotationDeadline ?? null)
        setShowDetailsMobile(true)
      } catch (err) {
        console.error("Erro ao carregar detalhes da cesta:", err)
        setError("Não foi possível carregar os detalhes da cesta. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }
    if (id) {
      if (id === "novo") {
        setIsNewBasketMode(true)
        setSelectedBasket(null)
        setShowDetailsMobile(false)
      } else {
        setIsNewBasketMode(false)
        loadBasketDetails(id)
      }
    } else {
      setIsNewBasketMode(false)
      setSelectedBasket(null)
      setShowDetailsMobile(false)
    }
  }, [id])

  useEffect(() => {
    setVisibleBaskets(filteredBaskets.slice(0, itemsToShow))
  }, [filteredBaskets, itemsToShow])

  const handleBasketClick = (basket: BasketDetail) => {
    navigate(`/basket/${basket.id}`)
    setSelectedBasket(basket)
    setIsNewBasketMode(false)
    setShowDetailsMobile(true)
  }

  const handleNewBasketClick = () => {
    setIsNewBasketMode(true)
    setSelectedBasket(null)
    navigate("/basket/novo")
  }

  const handleBackToList = () => {
    navigate("/cestas-precos")
    setSelectedBasket(null)
    setShowDetailsMobile(false)
    setIsNewBasketMode(false)
  }

  const handleClearFilters = () => {
    setStatusFilter(null)
    setDateFilter(null)
    setSortOrder("desc")
  }

  const handleShowMore = () => {
    setItemsToShow((prev) => prev + 3)
  }

  const handleSaveBasket = async () => {
    if (!selectedBasket) return
    try {
      setIsLoading(true)
      const basketData: Partial<BasketDetail> = {
        ...selectedBasket,
        calculationType,
        supportStatus,
        clientStatus,
        decimals,
        expenseElement,
        possession,
        quotationDeadline,
        researchDocuments,
        correctionIndex,
        correctionTarget,
        correctionStartDate,
        correctionEndDate,
      }
      const updatedBasket = await updateBasket(selectedBasket.id, basketData)
      setSelectedBasket(updatedBasket)
      notify.success("Cesta atualizada com sucesso!")
      
      // Recarregar a lista de cestas após atualização
      const baskets = await fetchBaskets()
      let filtered = [...baskets]
      if (statusFilter) {
        filtered = filtered.filter((basket) => basket.status === statusFilter)
      }
      if (dateFilter) {
        filtered = filtered.filter((basket) => {
          const basketDate = basket.requestDate ? new Date(basket.requestDate) : null
          const filterDate = new Date(dateFilter)
          return basketDate && basketDate.toDateString() === filterDate.toDateString()
        })
      }
      filtered.sort((a, b) => {
        if (sortOrder === "asc") {
          return Number.parseInt(a.id) - Number.parseInt(b.id)
        }
        return Number.parseInt(b.id) - Number.parseInt(a.id)
      })
      setFilteredBaskets(filtered)
    } catch (err) {
      console.error("Erro ao salvar cesta:", err)
      notify.error("Erro ao salvar cesta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBasket = async () => {
    if (!selectedBasket) return
    if (!confirm("Tem certeza que deseja excluir esta cesta?")) return
    try {
      setIsLoading(true)
      await deleteBasket(selectedBasket.id)
      notify.success("Cesta excluída com sucesso!")
      setFilteredBaskets((prev) => prev.filter((basket) => basket.id !== selectedBasket.id))
      navigate("/cestas-precos")
      setSelectedBasket(null)
      setShowDetailsMobile(false)
    } catch (err) {
      console.error("Erro ao excluir cesta:", err)
      notify.error("Erro ao excluir cesta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveBasketFile = async (index: number, fileId?: string) => {
    try {
      if (fileId) {
        setIsLoading(true)
        await deleteFile(fileId)
      }
      setBasketFiles((prev) => prev.filter((_, i) => i !== index))
      notify.success("Arquivo removido com sucesso")
    } catch (err) {
      console.error("Erro ao remover arquivo:", err)
      notify.error("Erro ao remover arquivo. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePurchaseFile = async (index: number, fileId?: string) => {
    try {
      if (fileId) {
        setIsLoading(true)
        await deleteFile(fileId)
      }
      setPurchaseFiles((prev) => prev.filter((_, i) => i !== index))
      notify.success("Arquivo removido com sucesso")
    } catch (err) {
      console.error("Erro ao remover arquivo:", err)
      notify.error("Erro ao remover arquivo. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFiles = (type: "basket" | "purchase") => {
    setFileUploadType(type)
    setIsFileUploadOpen(true)
  }

  const handleFileUpload = async (files: FileItem[]) => {
    if (!selectedBasket) return
    try {
      setIsLoading(true)
      const fileObjects = files.map((f) => f.file).filter((f) => f !== undefined) as File[]
      if (fileObjects.length === 0) {
        notify.error("Nenhum arquivo válido selecionado")
        return
      }
      const uploadedFiles = await uploadFiles(selectedBasket.id, fileObjects, fileUploadType)
      if (fileUploadType === "basket") setBasketFiles((prev) => [...prev, ...uploadedFiles])
      else setPurchaseFiles((prev) => [...prev, ...uploadedFiles])
      notify.success(`${uploadedFiles.length} arquivo(s) adicionado(s) com sucesso`)
    } catch (err) {
      console.error("Erro ao fazer upload de arquivos:", err)
      notify.error("Erro ao fazer upload de arquivos. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewFile = (file: FileItem) => {
    setSelectedFile(file)
    setIsFileViewerOpen(true)
  }

  const handleDownloadFile = async (file: FileItem) => {
    if (!file.id) {
      notify.error("ID do arquivo não disponível")
      return
    }
    try {
      notify.loading(`Preparando download de ${file.name}...`)
      const blob = await downloadFile(file.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      notify.success(`Download do arquivo ${file.name} iniciado`)
    } catch (err) {
      console.error("Erro ao baixar arquivo:", err)
      notify.error("Erro ao baixar arquivo. Tente novamente.")
    }
  }

  const getStatusFilterText = () => statusFilter || "Filtrar por Status"
  const getDateFilterText = () => dateFilter || "Filtrar por Data"
  const getSortOrderText = () => (sortOrder === "asc" ? "Crescente" : "Decrescente")

  const getStatusBadgeColor = (status: StatusType) => {
    switch (status) {
      case "CADASTRO":
        return "bg-blue-500 text-white hover:bg-blue-600"
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
    <div className="container mx-auto py-3 sm:py-4 space-y-3 sm:space-y-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p>{error}</p>
          <Button variant="outline" className="mt-2 text-red-600 border-red-300" onClick={() => setError(null)}>
            Tentar novamente
          </Button>
        </div>
      )}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 ${showDetailsMobile ? "hidden sm:grid" : ""}`}>
        <div className="bg-white shadow rounded-lg p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Cestas Finalizadas</h3>
          <p className="text-xl sm:text-2xl font-bold">{filteredBaskets.filter((b) => b.status === "PRONTA").length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Cestas em andamento</h3>
          <p className="text-xl sm:text-2xl font-bold">
            {filteredBaskets.filter((b) => b.status === "EM ANDAMENTO").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Cestas em Abertos</h3>
          <p className="text-xl sm:text-2xl font-bold">
            {filteredBaskets.filter((b) => b.status === "EM ABERTO").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Total de Orçamentos</h3>
          <p className="text-xl sm:text-2xl font-bold">{filteredBaskets.length}</p>
        </div>
      </div>
      <div className={`flex flex-wrap gap-2 ${showDetailsMobile ? "hidden sm:flex" : ""}`}>
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
            <DropdownMenuItem onClick={() => setStatusFilter("CADASTRO")}>CADASTRO</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("EM ANDAMENTO")}>EM ANDAMENTO</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("PRONTA")}>PRONTA</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("LIBERADA PARA CESTA")}>
              LIBERADA PARA CESTA
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("EM ABERTO")}>EM ABERTO</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          className="text-destructive hover:text-destructive bg-destructive/10 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
          onClick={handleClearFilters}
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
          Limpar Filtros
        </Button>
      </div>
      <div className={`flex flex-col md:flex-row gap-3 sm:gap-4`}>
        <div
          className={`w-full md:w-[345px] bg-white border border-gray-200 flex-shrink-0 flex flex-col rounded-lg overflow-hidden ${showDetailsMobile ? "hidden sm:flex" : "flex"}`}
        >
          <div className="p-2 sm:p-3 border-b border-gray-200">
            <Button
              className="w-full bg-[#7baa3d] hover:bg-[#6a9934] text-white h-8 sm:h-9 text-xs sm:text-sm"
              onClick={handleNewBasketClick}
            >
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
                    <Badge
                      className={`${getStatusBadgeColor(basket.status as StatusType)} text-xs`}
                      variant="secondary"
                    >
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
        <div className="flex-1 bg-white border border-gray-200 flex flex-col rounded-lg overflow-hidden">
          {isNewBasketMode ? (
            <NewBasketFormContent
              onSave={() => {
                notify.success("Cesta cadastrada com sucesso!")
                setIsNewBasketMode(false)
              }}
              onCancel={() => setIsNewBasketMode(false)}
            />
          ) : selectedBasket ? (
            <>
              <div className="bg-gray-50 p-2 sm:p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center">
                  <Button
                    onClick={handleBackToList}
                    variant="outline"
                    className="mr-2 text-gray-700 hover:bg-gray-100 flex items-center h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm"
                  >
                    <ChevronLeft size={14} className="mr-0 sm:mr-1" />
                  </Button>
                  <h2 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                    <span>Detalhes da Cesta #{selectedBasket.id}</span>
                  </h2>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-7 w-7 sm:h-8 sm:w-8"
                    onClick={handleDeleteBasket}
                  >
                    <Trash2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-7 w-7 sm:h-8 sm:w-8"
                    onClick={handleSaveBasket}
                  >
                    <Check size={14} />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)]">
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

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                          <FileText size={14} className="text-gray-600" />
                        </div>
                        OBJETO
                      </h3>
                      <div className="p-3 bg-white rounded-md text-xs sm:text-sm text-gray-900 border border-gray-200 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <FileText size={16} className="text-gray-600" />
                        </div>
                        {selectedBasket?.description || "Nenhuma descrição disponível"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <List size={14} className="text-gray-600" />
                          </div>
                          ELEMENTO DE DESPESA
                        </h3>
                        <ExpenseElementSelector value={expenseElement} onChange={setExpenseElement} />
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-600" />
                          </div>
                          TIPO DE CONTRATAÇÃO
                        </h3>
                        <select
                          value={selectedBasket?.elementType || "LICITAÇÃO"}
                          onChange={(e) =>
                            setSelectedBasket((prev) => (prev ? { ...prev, elementType: e.target.value } : null))
                          }
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                        >
                          <option value="LICITAÇÃO">LICITAÇÃO</option>
                          <option value="DISPENSA">DISPENSA</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-600" />
                          </div>
                          TIPO DE CÁLCULO
                        </h3>
                        <select
                          value={calculationType}
                          onChange={(e) => setCalculationType(e.target.value)}
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                        >
                          <option value="MÉDIA ARITMÉTICA">MÉDIA ARITMÉTICA</option>
                          <option value="MEDIANA">MEDIANA</option>
                          <option value="MENOR PREÇO POR ITEM">MENOR PREÇO POR ITEM</option>
                          <option value="MENOR PREÇO POR ITEM (APENAS FORNECEDORES)">MENOR PREÇO POR ITEM (APENAS FORNECEDORES)</option>
                          <option value="MENOR PREÇO POR LOTE (APENAS FORNECEDORES)">MENOR PREÇO POR LOTE (APENAS FORNECEDORES)</option>
                        </select>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-600" />
                          </div>
                          CASAS DECIMAIS
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant={decimals === 2 ? "default" : "outline"}
                            onClick={() => setDecimals(2)}
                            className={`flex-1 h-9 ${decimals === 2 ? "bg-blue-600 text-white" : "bg-white text-gray-900 border-gray-200"}`}
                          >
                            2
                          </Button>
                          <Button
                            variant={decimals === 3 ? "default" : "outline"}
                            onClick={() => setDecimals(3)}
                            className={`flex-1 h-9 ${decimals === 3 ? "bg-blue-600 text-white" : "bg-white text-gray-900 border-gray-200"}`}
                          >
                            3
                          </Button>
                          <Button
                            variant={decimals === 4 ? "default" : "outline"}
                            onClick={() => setDecimals(4)}
                            className={`flex-1 h-9 ${decimals === 4 ? "bg-blue-600 text-white" : "bg-white text-gray-900 border-gray-200"}`}
                          >
                            4
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase text-gray-400 mb-1">DATA DA SOLICITAÇÃO</h3>
                        <Input
                          type="text"
                          value={selectedBasket?.requestDate || ""}
                          readOnly
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 px-3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-600" />
                          </div>
                          SITUAÇÃO SUPORTE
                        </h3>
                        <select
                          value={supportStatus}
                          onChange={(e) => setSupportStatus(e.target.value)}
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                        >
                          <option value="CADASTRO">CADASTRO</option>
                          <option value="FINALIZADA">FINALIZADA</option>
                          <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                          <option value="PENDENTE">PENDENTE</option>
                        </select>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-600" />
                          </div>
                          SITUAÇÃO CLIENTE
                        </h3>
                        <select
                          value={clientStatus}
                          onChange={(e) => setClientStatus(e.target.value)}
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                        >
                          <option value="EM ABERTO">EM ABERTO</option>
                          <option value="PRONTA">PRONTA</option>
                          <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                          <option value="PENDENTE">PENDENTE</option>
                        </select>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <User size={14} className="text-gray-600" />
                          </div>
                          POSSE
                        </h3>
                        <select
                          value={possession}
                          onChange={(e) => setPossession(e.target.value)}
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                        >
                          <option value="SUPORTE">SUPORTE</option>
                          <option value="CLIENTE">CLIENTE</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs uppercase text-gray-400 mb-1">DATA DA FINALIZAÇÃO</h3>
                        <Input
                          type="text"
                          value={selectedBasket?.finalizedDate || ""}
                          readOnly
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 px-3"
                        />
                      </div>

                      <div>
                        <h3 className="text-xs uppercase text-gray-400 mb-1">DATA DA CESTA</h3>
                        <Input
                          type="text"
                          value={selectedBasket?.basketDate || ""}
                          readOnly
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 px-3"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-4">RELATÓRIOS</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 h-9 bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                            onClick={() => handleViewFile({ name: "MÉDIA DE PREÇOS (MAPA)", size: "", sentDate: "" })}
                          >
                            <FileText size={14} className="mr-2" />
                            MÉDIA DE PREÇOS (MAPA)
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-600" />
                          </div>
                          DOCUMENTOS DAS PESQUISAS
                        </h3>
                        <div className="flex gap-2">
                          <div
                            className="flex-1 h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 px-3 rounded-md flex items-center gap-2 cursor-pointer"
                            onClick={() =>
                              handleViewFile({ name: selectedBasket?.researchDocuments || "", size: "", sentDate: "" })
                            }
                          >
                            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                              <FileText size={14} className="text-gray-600" />
                            </div>
                            {selectedBasket?.researchDocuments || "Nenhum documento anexado"}
                          </div>
                          <Dialog open={isDocSearchOpen} onOpenChange={setIsDocSearchOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-9 px-3 bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                              >
                                <Barcode size={14} className="mr-2" />
                                Buscar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Buscar Documentos</DialogTitle>
                              </DialogHeader>
                              <DocumentSearchModal
                                onClose={() => setIsDocSearchOpen(false)}
                                onSelect={(code) => setResearchDocuments(code)}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-600" />
                          </div>
                          RELATÓRIOS
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 h-9 bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                          >
                            <FileText size={14} className="mr-2" />
                            MÉDIA DE PREÇOS (MAPA)
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <FileText size={14} className="text-gray-600" />
                          </div>
                          CORRIGIR VALORES
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <h3 className="text-xs uppercase text-gray-400 mb-1">INCIDIR SOBRE</h3>
                            <select
                              value={correctionTarget}
                              onChange={(e) => setCorrectionTarget(e.target.value)}
                              className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                            >
                              <option value="NÃO CORRIGIR">NÃO CORRIGIR</option>
                              <option value="ITENS SELECIONADOS">ITENS SELECIONADOS</option>
                              <option value="TODOS OS ITENS">TODOS OS ITENS</option>
                            </select>
                          </div>
                          <div>
                            <h3 className="text-xs uppercase text-gray-400 mb-1">ÍNDICE</h3>
                            <select
                              value={correctionIndex}
                              onChange={(e) => setCorrectionIndex(e.target.value)}
                              className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                            >
                              <option value="Selecionar">Selecionar</option>
                              <option value="IGP-M">IGP-M</option>
                              <option value="IPCA">IPCA</option>
                            </select>
                          </div>
                          <div>
                            <h3 className="text-xs uppercase text-gray-400 mb-1">DATA INICIAL</h3>
                            <Input
                              type="text"
                              placeholder="Data Inicial"
                              value={selectedBasket?.correctionStartDate || ""}
                              readOnly
                              className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 px-3"
                            />
                          </div>
                          <div>
                            <h3 className="text-xs uppercase text-gray-400 mb-1">DATA FINAL</h3>
                            <Input
                              type="text"
                              placeholder="Data Final"
                              value={selectedBasket?.correctionEndDate || ""}
                              readOnly
                              className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 px-3"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-4 flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                                <FileText size={14} className="text-gray-600" />
                              </div>
                              ARQUIVOS CESTA
                            </div>
                            <Button
                              variant="link"
                              className="text-blue-600 p-0 h-auto text-xs"
                              onClick={() => handleAddFiles("basket")}
                            >
                              <Plus size={14} className="mr-1" />
                              ADICIONAR
                            </Button>
                          </h3>
                          <div className="space-y-2">
                            {basketFiles.length > 0 ? (
                              basketFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-1 bg-white border border-gray-200 rounded-md"
                                >
                                  <div className="flex items-center gap-1">
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                      <FileText size={16} className="text-gray-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-900">{file.name}</p>
                                      <p className="text-xs text-gray-500">{file.size}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleDownloadFile(file)}
                                    >
                                      <ArrowDownToLine size={16} className="text-gray-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleRemoveBasketFile(index, file.id)}
                                    >
                                      <Trash2 size={16} className="text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-2">
                                <p className="text-sm text-gray-500">Nenhum arquivo da cesta adicionado</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-4 flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                                <FileText size={14} className="text-gray-600" />
                              </div>
                              ARQUIVOS COMPRAS
                            </div>
                            <Button
                              variant="link"
                              className="text-blue-600 p-0 h-auto text-xs"
                              onClick={() => handleAddFiles("purchase")}
                            >
                              <Plus size={14} className="mr-1" />
                              ADICIONAR
                            </Button>
                          </h3>
                          <div className="space-y-2">
                            {purchaseFiles.length > 0 ? (
                              purchaseFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-1 bg-white border border-gray-200 rounded-md"
                                >
                                  <div className="flex items-center gap-1">
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                      <FileText size={16} className="text-gray-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-900">{file.name}</p>
                                      <p className="text-xs text-gray-500">{file.size}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleDownloadFile(file)}
                                    >
                                      <ArrowDownToLine size={16} className="text-gray-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleRemovePurchaseFile(index, file.id)}
                                    >
                                      <Trash2 size={16} className="text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-sm text-gray-500">Nenhum arquivo de compras adicionado</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
      <div>
        <Dialog
          open={isFileUploadOpen}
          onOpenChange={setIsFileUploadOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Arquivos</DialogTitle>
            </DialogHeader>
            <FileUploadModal
              onClose={() => setIsFileUploadOpen(false)}
              onUpload={handleFileUpload}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isFileViewerOpen} onOpenChange={setIsFileViewerOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Visualizar Arquivo</DialogTitle>
            </DialogHeader>
            {selectedFile && (
              <FileViewerModal
                file={selectedFile}
                onClose={() => setIsFileViewerOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
