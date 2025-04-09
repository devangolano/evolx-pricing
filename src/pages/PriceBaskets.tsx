import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Filter,
  CalendarIcon,
  ChevronLeft,
  FileText,
  Info,
  List,
  Trash2,
  Check,
  ChevronDown,
  Plus,
  User,
  ArrowDownToLine,
  X,
  FileSpreadsheet,
  Upload,
  File,
  FileIcon as FilePdf,
  FileImage,
  FileArchive,
} from "lucide-react"
import {
  type BasketDetail,
  type FileItem,
  fetchBaskets,
  updateBasket,
  deleteBasket,
  fetchBasketFiles,
  uploadFiles,
  downloadFile,
  deleteFile,
} from "@/services/basket-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { notify } from "@/config/toast"
import { ExpenseElementSelector } from "@/components/expense-element-selector"

type Status = "CADASTRO" | "EM ANDAMENTO" | "PRONTA" | "LIBERADA PARA CESTA" | "EM ABERTO"

export default function PriceBaskets() {
  const navigate = useNavigate()
  const { basketId } = useParams() // Pegar o ID da URL
  const [selectedBasket, setSelectedBasket] = useState<BasketDetail | null>(null)
  const [filteredBaskets, setFilteredBaskets] = useState<BasketDetail[]>([])
  const [visibleBaskets, setVisibleBaskets] = useState<BasketDetail[]>([])
  const [basketFiles, setBasketFiles] = useState<FileItem[]>([])
  const [purchaseFiles, setPurchaseFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNewBasketMode, setIsNewBasketMode] = useState(false)
  const [showDetailsMobile, setShowDetailsMobile] = useState(false)
  const [itemsToShow, setItemsToShow] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [isDocSearchOpen, setIsDocSearchOpen] = useState(false)
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false)

  // Função para carregar as cestas
  const loadBaskets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const baskets = await fetchBaskets()

      if (!Array.isArray(baskets)) {
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

  useEffect(() => {
    loadBaskets()
  }, [statusFilter, dateFilter, sortOrder, isNewBasketMode])

  useEffect(() => {
    setVisibleBaskets(filteredBaskets.slice(0, itemsToShow))
  }, [filteredBaskets, itemsToShow])

  useEffect(() => {
    if (basketId) {
      const basket = filteredBaskets.find((basket) => basket.id === basketId)
      if (basket) {
        setSelectedBasket(basket)
        setShowDetailsMobile(true)
        loadBasketFiles(basket.id) // Carrega os arquivos quando a cesta é selecionada pela URL
      } else {
        setSelectedBasket(null)
      }
    }
  }, [basketId, filteredBaskets])

  const loadBasketFiles = async (basketId: string) => {
    try {
      const files = await fetchBasketFiles(basketId);
      const basketFiles = files.filter((file) => file.fileCategory === "basket" || !file.fileCategory);
      const purchaseFiles = files.filter((file) => file.fileCategory === "purchase");
      setBasketFiles(basketFiles);
      setPurchaseFiles(purchaseFiles);
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
      notify.error("Erro ao carregar arquivos");
    }
  }

  const handleBasketClick = async (basket: BasketDetail) => {
    navigate(`/cestas-precos/${basket.id}`)
    setSelectedBasket(basket)
    setIsNewBasketMode(false)
    setShowDetailsMobile(true)
    await loadBasketFiles(basket.id) // Carrega os arquivos quando a cesta é clicada
  }

  const handleClearFilters = () => {
    setStatusFilter("")
    setDateFilter("")
    setSortOrder("desc")
  }

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 10)
  }

  const handleSaveBasketChanges = async () => {
    if (!selectedBasket) return;

    try {
      setIsLoading(true);
      setError(null);

      // Atualizar a cesta
      const updatedBasket = await updateBasket(selectedBasket.id, selectedBasket);

      // Atualizar o estado local com os dados atualizados
      setSelectedBasket(updatedBasket);
      
      // Recarregar a lista de cestas para refletir as mudanças
      await loadBaskets();

      notify.success("Cesta atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar cesta:", error);
      notify.error(error.response?.data?.error || "Erro ao atualizar cesta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBasket = async () => {
    if (!selectedBasket) return;
    try {
      setIsLoading(true);
      await deleteBasket(selectedBasket.id);
      setSelectedBasket(null);
      await loadBaskets();
      notify.success("Cesta excluída com sucesso!");
    } catch (error: any) {
      console.error("Erro ao excluir cesta:", error);
      notify.error(error.response?.data?.error || "Erro ao excluir cesta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFiles = () => {
    setIsFileUploadOpen(true)
  }

  const handleUploadFiles = async (newFiles: FileItem[]) => {
    if (!selectedBasket) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fazer o upload usando a API
      await uploadFiles(selectedBasket.id, newFiles.map(f => f.file as File), "basket");

      // Recarregar os arquivos da cesta
      const updatedFiles = await fetchBasketFiles(selectedBasket.id);
      const basketFiles = updatedFiles.filter((file) => file.fileCategory === "basket" || !file.fileCategory);
      setBasketFiles(basketFiles);

      notify.success("Arquivos enviados com sucesso!");
      setIsFileUploadOpen(false);
    } catch (error: any) {
      console.error("Erro ao fazer upload dos arquivos:", error);
      notify.error(error.response?.data?.error || "Erro ao fazer upload dos arquivos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseElementChange = (value: string) => {
    setSelectedBasket((prev) => prev ? { ...prev, expenseElement: value } : null);
  };

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

  const handleRemoveFile = async (fileId: string) => {
    try {
      setIsLoading(true)
      await deleteFile(fileId)

      // Atualizar a lista de arquivos após a remoção
      if (selectedBasket) {
        const files = await fetchBasketFiles(selectedBasket.id);
        const basketFiles = files.filter((file) => file.fileCategory === "basket" || !file.fileCategory);
        const purchaseFiles = files.filter((file) => file.fileCategory === "purchase");
        setBasketFiles(basketFiles);
        setPurchaseFiles(purchaseFiles);
      }

      notify.success("Arquivo removido com sucesso")
    } catch (err) {
      console.error("Erro ao remover arquivo:", err)
      notify.error("Erro ao remover arquivo. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

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
      handleUploadFiles(newFiles)
    }
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

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
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
              <span className="truncate max-w-[80px] sm:max-w-none">Filtrar por Status</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => setStatusFilter("")}>Todos</DropdownMenuItem>
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
              <span className="truncate max-w-[80px] sm:max-w-none">Filtrar por Data</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 border-b">
              <Button variant="ghost" className="w-full justify-start text-left" onClick={() => setDateFilter("")}>
                Todas as datas
              </Button>
            </div>
            <div className="p-2">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
              />
            </div>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 bg-white h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
            >
              <span className="truncate max-w-[80px] sm:max-w-none">Ordenar: {sortOrder === "asc" ? "Crescente" : "Decrescente"}</span>
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
          className="text-destructive hover:text-destructive bg-destructive/10 h-8 sm:h-9 text-xs sm:text-sm"
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
              onClick={() => navigate("/cestas-precos/novo")}
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
                      className={`text-xs ${getStatusBadgeColor(basket.status as Status)}`}
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
                    onClick={handleLoadMore}
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
          {selectedBasket ? (
            <>
              <div className="bg-gray-50 p-2 sm:p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center">
                  <Button
                    onClick={() => navigate("/cestas-precos")}
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
                    onClick={handleSaveBasketChanges}
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
                      <h3 className="text-xs uppercase text-gray-400 mb-1">OBJETO</h3>
                      <div className="p-3 bg-white rounded-md text-xs sm:text-sm text-gray-900 border border-gray-200 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <FileText size={16} className="text-gray-600" />
                        </div>
                        {selectedBasket?.description || "Nenhuma descrição disponível"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs uppercase text-gray-400 mb-1">ELEMENTO DE DESPESA</h3>
                        <ExpenseElementSelector value={selectedBasket?.expenseElement || ""} onChange={handleExpenseElementChange} />
                      </div>

                      <div>
                        <h3 className="text-xs uppercase text-gray-400 mb-1">TIPO DE CONTRATAÇÃO</h3>
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
                        <h3 className="text-xs uppercase text-gray-400 mb-1">TIPO DE CÁLCULO</h3>
                        <select
                          value={selectedBasket?.calculationType || "MÉDIA ARITMÉTICA"}
                          onChange={(e) =>
                            setSelectedBasket((prev) => (prev ? { ...prev, calculationType: e.target.value } : null))
                          }
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
                        <h3 className="text-xs uppercase text-gray-400 mb-1">CASAS DECIMAIS</h3>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedBasket?.decimals === 2 ? "default" : "outline"}
                            onClick={() => setSelectedBasket((prev) => (prev ? { ...prev, decimals: 2 } : null))}
                            className={`flex-1 h-9 ${selectedBasket?.decimals === 2 ? "bg-blue-600 text-white" : "bg-white text-gray-900 border-gray-200"}`}
                          >
                            2
                          </Button>
                          <Button
                            variant={selectedBasket?.decimals === 3 ? "default" : "outline"}
                            onClick={() => setSelectedBasket((prev) => (prev ? { ...prev, decimals: 3 } : null))}
                            className={`flex-1 h-9 ${selectedBasket?.decimals === 3 ? "bg-blue-600 text-white" : "bg-white text-gray-900 border-gray-200"}`}
                          >
                            3
                          </Button>
                          <Button
                            variant={selectedBasket?.decimals === 4 ? "default" : "outline"}
                            onClick={() => setSelectedBasket((prev) => (prev ? { ...prev, decimals: 4 } : null))}
                            className={`flex-1 h-9 ${selectedBasket?.decimals === 4 ? "bg-blue-600 text-white" : "bg-white text-gray-900 border-gray-200"}`}
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
                        <h3 className="text-xs uppercase text-gray-400 mb-1">SITUAÇÃO SUPORTE</h3>
                        <select
                          value={selectedBasket?.supportStatus || "CADASTRO"}
                          onChange={(e) =>
                            setSelectedBasket((prev) => (prev ? { ...prev, supportStatus: e.target.value } : null))
                          }
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                        >
                          <option value="CADASTRO">CADASTRO</option>
                          <option value="FINALIZADA">FINALIZADA</option>
                          <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                          <option value="PENDENTE">PENDENTE</option>
                        </select>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase text-gray-400 mb-1">SITUAÇÃO CLIENTE</h3>
                        <select
                          value={selectedBasket?.clientStatus || "EM ABERTO"}
                          onChange={(e) =>
                            setSelectedBasket((prev) => (prev ? { ...prev, clientStatus: e.target.value } : null))
                          }
                          className="w-full h-9 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-md px-3"
                        >
                          <option value="EM ABERTO">EM ABERTO</option>
                          <option value="PRONTA">PRONTA</option>
                          <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                          <option value="PENDENTE">PENDENTE</option>
                        </select>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase text-gray-400 mb-1">POSSE</h3>
                        <select
                          value={selectedBasket?.possession || "SUPORTE"}
                          onChange={(e) =>
                            setSelectedBasket((prev) => (prev ? { ...prev, possession: e.target.value } : null))
                          }
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
                        <h3 className="text-xs uppercase text-gray-400 mb-1">DOCUMENTOS DAS PESQUISAS</h3>
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
                                <ArrowDownToLine size={14} className="mr-2" />
                                Buscar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Buscar Documentos</DialogTitle>
                              </DialogHeader>
                              <div className="p-4">
                                <p className="text-gray-500 text-xs sm:text-sm italic">Nenhuma funcionalidade implementada!</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase text-gray-400 mb-1">RELATÓRIOS</h3>
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
                        <h3 className="text-xs uppercase text-gray-400 mb-1">CORRIGIR VALORES</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <h3 className="text-xs uppercase text-gray-400 mb-1">INCIDIR SOBRE</h3>
                            <select
                              value={selectedBasket?.correctionTarget || "NÃO CORRIGIR"}
                              onChange={(e) =>
                                setSelectedBasket((prev) => (prev ? { ...prev, correctionTarget: e.target.value } : null))
                              }
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
                              value={selectedBasket?.correctionIndex || "Selecionar"}
                              onChange={(e) =>
                                setSelectedBasket((prev) => (prev ? { ...prev, correctionIndex: e.target.value } : null))
                              }
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
                              onClick={handleAddFiles}
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
                                  className="p-3 flex justify-between items-center"
                                >
                                  <div className="flex items-center">
                                    {getFileIcon(file.type)}
                                    <span className="ml-2 text-sm truncate max-w-[200px]">{file.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-xs text-gray-500 mr-2">{file.size}</span>
                                    <div className="flex">
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
                                        onClick={() => file.id && handleRemoveFile(file.id)}
                                      >
                                        <Trash2 size={16} className="text-red-600" />
                                      </Button>
                                    </div>
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
                              onClick={handleAddFiles}
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
                                  className="p-3 flex justify-between items-center"
                                >
                                  <div className="flex items-center">
                                    {getFileIcon(file.type)}
                                    <span className="ml-2 text-sm truncate max-w-[200px]">{file.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-xs text-gray-500 mr-2">{file.size}</span>
                                    <div className="flex">
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
                                        onClick={() => file.id && handleRemoveFile(file.id)}
                                      >
                                        <Trash2 size={16} className="text-red-600" />
                                      </Button>
                                    </div>
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
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isFileViewerOpen} onOpenChange={setIsFileViewerOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Visualizar Arquivo</DialogTitle>
            </DialogHeader>
            {selectedFile && (
              <div className="p-4">
                <p className="text-gray-500 text-xs sm:text-sm italic">Nenhuma funcionalidade implementada!</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )

  function getStatusBadgeColor(status: Status) {
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
}
