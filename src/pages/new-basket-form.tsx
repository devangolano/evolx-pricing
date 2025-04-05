"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  List,
  PieChart,
  Plus,
  User,
  Filter,
  Barcode,
  Upload,
  File,
  FileIcon as FilePdf,
  FileImage,
  FileArchive,
  FileSpreadsheet,
  Trash2,
  Download,
  RefreshCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { notify } from "@/config/toast"
import axios from "axios"
// Importe o novo componente ExpenseElementSelector
import { ExpenseElementSelector } from "@/components/expense-element-selector"

// Interface for file items
interface FileItem {
  name: string
  size: string
  sentDate: string
  type?: string
  file?: File
}

// Interface for basket (em camelCase, como o frontend espera)
interface Basket {
  id: string
  description: string
  expenseElement: string
  contractType: string
  calculationType: string
  requestDate: string
  supportStatus: string
  clientStatus: string
  possession: string
  quotationDeadline: string
  decimals: number
  correctionTarget: string
  correctionIndex: string
  correctionStartDate: string | null
  correctionEndDate: string | null
}

// Função para converter snake_case para camelCase
const snakeToCamel = (str: string) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

// Função para converter um objeto de snake_case para camelCase
const convertKeysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item))
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key)
      acc[camelKey] = convertKeysToCamelCase(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

// Função para converter camelCase para snake_case
const camelToSnake = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

// Função para converter um objeto de camelCase para snake_case
const convertKeysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item))
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = camelToSnake(key)
      acc[snakeKey] = convertKeysToSnakeCase(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

// Função para formatar automaticamente a data no padrão DD/MM/AAAA
const formatDateInput = (value: string): string => {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, "")

  // Formata de acordo com a quantidade de dígitos
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
  }
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

// Componente para o modal de upload de arquivos
function FileUploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: (files: FileItem[]) => void }) {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: FileItem[] = []

      Array.from(e.target.files).forEach((file) => {
        const now = new Date()
        const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}h${String(now.getMinutes()).padStart(2, "0")}`

        // Converter bytes para formato legível
        const fileSize =
          file.size < 1024
            ? `${file.size} B`
            : file.size < 1024 * 1024
              ? `${(file.size / 1024).toFixed(2)} KB`
              : `${(file.size / (1024 * 1024)).toFixed(2)} MB`

        // Determinar o tipo de arquivo
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || ""
        let fileType = "other"

        if (["pdf"].includes(fileExtension)) fileType = "pdf"
        else if (["doc", "docx"].includes(fileExtension)) fileType = "word"
        else if (["xls", "xlsx"].includes(fileExtension)) fileType = "excel"
        else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) fileType = "image"
        else if (["zip", "rar", "7z"].includes(fileExtension)) fileType = "archive"

        newFiles.push({
          name: file.name,
          size: fileSize,
          sentDate: formattedDate,
          type: fileType,
          file: file,
        })
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
                {getFileIcon(file.type)}
                <span className="ml-2 text-sm truncate max-w-[200px]">{file.name}</span>
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

// Função auxiliar para obter o ícone do arquivo com base no tipo
const getFileIcon = (fileType: string | undefined) => {
  switch (fileType) {
    case "pdf":
      return <FilePdf className="flex-shrink-0 text-red-500" />
    case "word":
      return <FileText className="flex-shrink-0 text-blue-500" />
    case "excel":
      return <FileSpreadsheet className="flex-shrink-0 text-green-500" />
    case "image":
      return <FileImage className="flex-shrink-0 text-purple-500" />
    case "archive":
      return <FileArchive className="flex-shrink-0 text-yellow-500" />
    default:
      return <File className="flex-shrink-0 text-gray-500" />
  }
}

export function NewBasketFormContent({
  onSave,
  onCancel,
}: {
  onSave: () => void
  onCancel: () => void
}) {
  // Estados para os campos do formulário
  const [description, setDescription] = useState("")
  const [expenseElement, setExpenseElement] = useState("")
  const [contractType, setContractType] = useState("")
  const [calculationType, setCalculationType] = useState("")
  const [requestDate] = useState(new Date().toLocaleDateString("pt-BR"))
  const [supportStatus] = useState("CADASTRO")
  const [clientStatus] = useState("EM ABERTO")
  const [possession, setPossession] = useState("CLIENTE")
  const [quotationDeadline, setQuotationDeadline] = useState("")
  const [decimals, setDecimals] = useState(3)
  const [correctionTarget, setCorrectionTarget] = useState("")
  const [correctionIndex, setCorrectionIndex] = useState("")
  const [correctionStartDate, setCorrectionStartDate] = useState("")
  const [correctionEndDate, setCorrectionEndDate] = useState("")

  // Estados para gerenciar os arquivos
  const [purchaseFiles, setPurchaseFiles] = useState<FileItem[]>([])
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false)

  // Verificar se os campos de correção devem estar desabilitados
  const isCorrectionDisabled = correctionTarget === ""

  const handleBackToList = () => {
    onCancel()
  }

  // Função para salvar a cesta no backend
  const handleSaveBasket = async () => {
    try {
      // Montar os dados da cesta
      const basketData: Partial<Basket> = {
        description,
        expenseElement,
        contractType,
        calculationType,
        requestDate,
        supportStatus,
        clientStatus,
        possession,
        quotationDeadline,
        decimals,
        correctionTarget,
        correctionIndex,
        correctionStartDate,
        correctionEndDate,
      }

      // Converter os dados para snake_case
      const dataToSend = convertKeysToSnakeCase(basketData)

      // Fazer a requisição para criar a cesta
      const response = await axios.post("https://ovolx-api-1.onrender.com/api/baskets", dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      
      const newBasket = convertKeysToCamelCase(response.data)

      // Se houver arquivos de compra, fazer o upload
      if (purchaseFiles.length > 0) {
        const formData = new FormData()
        purchaseFiles.forEach((file) => {
          if (file.file) {
            formData.append("files", file.file)
          }
        })
        formData.append("file_category", "purchase")

        await axios.post(`https://ovolx-api-1.onrender.com/api/baskets/${newBasket.id}/files`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        })
      }

      notify.success("Cesta cadastrada com sucesso!")
      onSave()
    } catch (error) {
      console.error("Erro ao cadastrar cesta:", error)
      notify.error("Erro ao cadastrar cesta")
    }
  }

  // Funções para gerenciar arquivos
  const handleAddFiles = () => {
    setIsFileUploadOpen(true)
  }

  const handleFileUpload = (files: FileItem[]) => {
    setPurchaseFiles((prev) => [...prev, ...files])
    notify.success(`${files.length} arquivo(s) adicionado(s) com sucesso`)
  }

  const handleRemoveFile = (index: number) => {
    setPurchaseFiles((prev) => prev.filter((_, i) => i !== index))
    notify.success("Arquivo removido com sucesso")
  }

  const handleDownloadFile = (file: FileItem) => {
    // Como os arquivos ainda não estão no backend, vamos simular o download
    notify.loading(`Preparando download de ${file.name}...`)

    setTimeout(() => {
      notify.success(`Download do arquivo ${file.name} iniciado`)
    }, 1500)
  }

  return (
    <>
      <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            onClick={handleBackToList}
            variant="outline"
            className="mr-2 text-gray-700 hover:bg-gray-100 flex items-center h-8 px-2 text-sm"
          >
            <ChevronLeft size={16} className="mr-1" />
          </Button>
          <h2 className="text-lg font-medium text-gray-900">Cadastrar Cesta</h2>
        </div>
        <Button onClick={handleSaveBasket} className="bg-[#7baa3d] hover:bg-[#6a9934] text-white">
          Salvar
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-150px)]">
        <div className="bg-blue-50 p-3 rounded-md flex items-start">
          <Info size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Caso necessite de ajuda para elaboração da cesta, mantenha a posse com o SUPORTE, se preferir fazer tudo por
            conta própria, altere a posse para CLIENTE.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">OBJETIVO</h3>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px] bg-gray-50 border-gray-200 text-sm"
            placeholder="Descreva o objetivo da cesta"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">ELEMENTO DE DESPESA</h3>
            <ExpenseElementSelector value={expenseElement} onChange={setExpenseElement} />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">TIPO DE CONTRATAÇÃO</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-9 text-sm pl-7 relative"
                >
                  <List className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <span className="truncate">{contractType}</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setContractType("LICITAÇÃO")}>LICITAÇÃO</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setContractType("DISPENSA/INEXIGIBILIDADE")}>
                  DISPENSA/INEXIGIBILIDADE
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">TIPO DE CÁLCULO</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-9 text-sm pl-7 relative"
                >
                  <PieChart className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <span className="truncate">{calculationType}</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCalculationType("MÉDIA ARITMÉTICA")}>
                  MÉDIA ARITMÉTICA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalculationType("MEDIANA")}>MEDIANA</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalculationType("MENOR PREÇO POR ITEM")}>
                  MENOR PREÇO POR ITEM
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalculationType("MENOR PREÇO POR ITEM (APENAS FORNECEDORES)")}>
                  MENOR PREÇO POR ITEM (APENAS FORNECEDORES)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalculationType("MENOR PREÇO POR LOTE (APENAS FORNECEDORES)")}>
                  MENOR PREÇO POR LOTE (APENAS FORNECEDORES)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">DATA DA SOLICITAÇÃO</h3>
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={requestDate}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 h-9 text-sm pl-7 rounded-md cursor-not-allowed opacity-60"
                placeholder="DD/MM/AAAA"
                maxLength={10}
                disabled
              />
              <Popover>
                <PopoverTrigger asChild disabled>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 cursor-not-allowed opacity-60"
                    disabled
                  >
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </PopoverTrigger>
              </Popover>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">CASAS DECIMAIS</h3>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="decimal-2"
                  checked={decimals === 2}
                  onCheckedChange={() => setDecimals(2)}
                  className="border-gray-300 data-[state=checked]:bg-[#7baa3d] data-[state=checked]:border-[#7baa3d] h-4 w-4"
                />
                <label htmlFor="decimal-2" className="text-sm cursor-pointer text-gray-700">
                  2
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="decimal-3"
                  checked={decimals === 3}
                  onCheckedChange={() => setDecimals(3)}
                  className="border-gray-300 data-[state=checked]:bg-[#7baa3d] data-[state=checked]:border-[#7baa3d] h-4 w-4"
                />
                <label htmlFor="decimal-3" className="text-sm cursor-pointer text-gray-700">
                  3
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="decimal-4"
                  checked={decimals === 4}
                  onCheckedChange={() => setDecimals(4)}
                  className="border-gray-300 data-[state=checked]:bg-[#7baa3d] data-[state=checked]:border-[#7baa3d] h-4 w-4"
                />
                <label htmlFor="decimal-4" className="text-sm cursor-pointer text-gray-700">
                  4
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">PRAZO PARA ENVIO DE COTAÇÕES</h3>
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={quotationDeadline || ""}
                onChange={(e) => {
                  const formattedValue = formatDateInput(e.target.value)
                  setQuotationDeadline(formattedValue)
                }}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 h-9 text-sm pl-7 rounded-md"
                placeholder="DD/MM/AAAA"
                maxLength={10}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  >
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <SimpleCalendar onSelectDate={(date) => setQuotationDeadline(date)} onClose={() => {}} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">SITUAÇÃO SUPORTE</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-9 text-sm pl-7 relative cursor-not-allowed opacity-60"
                  disabled
                >
                  <Info className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <span className="truncate">CADASTRO</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">SITUAÇÃO CLIENTE</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-9 text-sm pl-7 relative cursor-not-allowed opacity-60"
                  disabled
                >
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <span className="truncate">EM ABERTO</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">POSSE</h3>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2 py-1 px-2 border-gray-200 text-gray-700 text-sm">
                {possession}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => setPossession(possession === "CLIENTE" ? "SUPORTE" : "CLIENTE")}
              >
                <RefreshCcw size={12} />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">CORRIGIR VALORES</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <h4 className="text-xs uppercase text-gray-500 mb-1">INCIDIR SOBRE</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-9 text-sm pl-7 relative"
                  >
                    <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <span className="truncate">{correctionTarget}</span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCorrectionTarget("")}>NÃO CORRIGIR</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCorrectionTarget("TODOS OS ITENS")}>
                    TODOS OS ITENS
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCorrectionTarget("ITENS SELECIONADOS")}>
                    ITENS SELECIONADOS
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <h4 className="text-xs uppercase text-gray-500 mb-1">ÍNDICE</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between bg-gray-50 border-gray-200 text-gray-700 h-9 text-sm pl-7 relative ${isCorrectionDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
                    disabled={isCorrectionDisabled}
                  >
                    <Barcode className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <span className="truncate">{correctionIndex}</span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCorrectionIndex("IPCA")}>IPCA</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCorrectionIndex("INPC")}>INPC</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCorrectionIndex("IGP-M")}>IGP-M</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <h4 className="text-xs uppercase text-gray-500 mb-1">DATA INICIAL</h4>
              <div className="relative">
                <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={correctionStartDate || ""}
                  onChange={(e) => {
                    const formattedValue = formatDateInput(e.target.value)
                    setCorrectionStartDate(formattedValue)
                  }}
                  className={`w-full bg-gray-50 border border-gray-200 text-gray-700 h-9 text-sm pl-7 rounded-md ${isCorrectionDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
                  placeholder="DD/MM/AAAA"
                  disabled={isCorrectionDisabled}
                  maxLength={10}
                />
                {!isCorrectionDisabled && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      >
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <SimpleCalendar onSelectDate={(date) => setCorrectionStartDate(date)} onClose={() => {}} />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase text-gray-500 mb-1">DATA FINAL</h4>
              <div className="relative">
                <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={correctionEndDate || ""}
                  onChange={(e) => {
                    const formattedValue = formatDateInput(e.target.value)
                    setCorrectionEndDate(formattedValue)
                  }}
                  className={`w-full bg-gray-50 border border-gray-200 text-gray-700 h-9 text-sm pl-7 rounded-md ${isCorrectionDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
                  placeholder="DD/MM/AAAA"
                  disabled={isCorrectionDisabled}
                  maxLength={10}
                />
                {!isCorrectionDisabled && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      >
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <SimpleCalendar onSelectDate={(date) => setCorrectionEndDate(date)} onClose={() => {}} />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">ARQUIVOS COMPRAS</h3>
          {purchaseFiles.length > 0 ? (
            <div className="space-y-2">
              {purchaseFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center flex-1 truncate">
                    {getFileIcon(file.type)}
                    <span className="ml-2 text-xs sm:text-sm text-gray-700 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                      {file.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap hidden xs:inline">
                      {file.size} • {file.sentDate}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-7 sm:w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <Download size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 hover:text-red-700 hover:bg-gray-100"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-gray-500 text-sm border border-dashed border-gray-200 rounded-md">
              Nenhum arquivo adicionado
            </div>
          )}
          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-gray-200 hover:bg-gray-50 h-7 text-xs px-2"
              onClick={handleAddFiles}
            >
              <Plus size={10} className="mr-1" />
              ADICIONAR
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isFileUploadOpen} onOpenChange={setIsFileUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Arquivos</DialogTitle>
          </DialogHeader>
          <FileUploadModal onClose={() => setIsFileUploadOpen(false)} onUpload={handleFileUpload} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function NewBasketForm() {
  const navigate = useNavigate()

  const handleSave = () => {
    navigate("/cestas-precos")
  }

  const handleCancel = () => {
    navigate("/cestas-precos")
  }

  return (
    <div className="container mx-auto py-3 sm:py-4 space-y-3 sm:space-y-4">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
        <div className="flex-1 bg-white border border-gray-200 flex flex-col rounded-lg overflow-hidden">
          <NewBasketFormContent onSave={handleSave} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
