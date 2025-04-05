// Definição dos tipos para o serviço de cestas
export interface BasketDetail {
  id: string
  date: string
  status: string
  description: string
  userId?: number
  userName?: string
  userNumber?: string
  elementType?: string
  calculationType: string
  decimals: number
  supportStatus: string
  clientStatus: string
  finalizedDate?: string | null
  basketDate?: string | null
  quotationDeadline?: string | null
  possession: string
  expenseElement: string
  requestDate: string
  correctionIndex?: string | null
  correctionTarget?: string | null
  correctionStartDate?: string | null
  correctionEndDate?: string | null
  researchDocuments?: string | null
  createdAt?: string
  updatedAt?: string
  files?: FileItem[]
}

export interface FileItem {
  id?: string
  name: string
  size: string
  sentDate: string
  type?: string
  path?: string
  basketId?: string
  fileCategory?: string
  createdAt?: string
  updatedAt?: string
  file?: File
}

// Vamos melhorar o mapeamento dos dados da API para garantir que usamos exatamente o que vem da API:

// Função para buscar todas as cestas
export const fetchBaskets = async (): Promise<BasketDetail[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/baskets", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Falha ao buscar cestas")
    }

    const data = await response.json()
    console.log("Dados brutos da API:", data)

    // Mapeamento dos dados da API para o formato esperado pelo frontend
    // Mantendo os valores originais sem substituir por padrões
    return data.map((basket: any) => ({
      id: basket.id || "",
      date: basket.date || basket.created_at || "",
      status: basket.status || "",
      description: basket.description || "",
      userId: basket.user_id,
      userName: basket.user_name || "",
      userNumber: basket.user_number || "",
      elementType: basket.element_type,
      calculationType: basket.calculation_type || "",
      decimals: basket.decimals,
      supportStatus: basket.support_status || "",
      clientStatus: basket.client_status || "",
      finalizedDate: basket.finalized_date,
      basketDate: basket.basket_date,
      quotationDeadline: basket.quotation_deadline,
      possession: basket.possession || "",
      expenseElement: basket.expense_element || "",
      requestDate: basket.request_date || "",
      correctionIndex: basket.correction_index,
      correctionTarget: basket.correction_target,
      correctionStartDate: basket.correction_start_date,
      correctionEndDate: basket.correction_end_date,
      researchDocuments: basket.research_documents,
      createdAt: basket.created_at || basket.createdAt,
      updatedAt: basket.updated_at || basket.updatedAt,
      files: basket.files ? mapFiles(basket.files) : [],
    }))
  } catch (error) {
    console.error("Erro ao buscar cestas:", error)
    throw error
  }
}

// Função para buscar uma cesta específica por ID
export const fetchBasketById = async (id: string): Promise<BasketDetail> => {
  try {
    const response = await fetch(`http://localhost:3000/api/baskets/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Falha ao buscar detalhes da cesta")
    }

    const basket = await response.json()
    console.log("Detalhes brutos da cesta:", basket)

    // Mapeamento dos dados da API para o formato esperado pelo frontend
    // Mantendo os valores originais sem substituir por padrões
    return {
      id: basket.id || "",
      date: basket.date || basket.created_at || "",
      status: basket.status || "",
      description: basket.description || "",
      userId: basket.user_id,
      userName: basket.user_name || "",
      userNumber: basket.user_number || "",
      elementType: basket.element_type,
      calculationType: basket.calculation_type || "",
      decimals: basket.decimals,
      supportStatus: basket.support_status || "",
      clientStatus: basket.client_status || "",
      finalizedDate: basket.finalized_date,
      basketDate: basket.basket_date,
      quotationDeadline: basket.quotation_deadline,
      possession: basket.possession || "",
      expenseElement: basket.expense_element || "",
      requestDate: basket.request_date || "",
      correctionIndex: basket.correction_index,
      correctionTarget: basket.correction_target,
      correctionStartDate: basket.correction_start_date,
      correctionEndDate: basket.correction_end_date,
      researchDocuments: basket.research_documents,
      createdAt: basket.created_at || basket.createdAt,
      updatedAt: basket.updated_at || basket.updatedAt,
      files: basket.files ? mapFiles(basket.files) : [],
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes da cesta:", error)
    throw error
  }
}

// Função para atualizar uma cesta
export const updateBasket = async (id: string, data: Partial<BasketDetail>): Promise<BasketDetail> => {
  try {
    // Converter camelCase para snake_case para a API
    const apiData = Object.entries(data).reduce(
      (acc, [key, value]) => {
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
        acc[snakeKey] = value
        return acc
      },
      {} as Record<string, any>,
    )

    const response = await fetch(`http://localhost:3000/api/baskets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(apiData),
    })

    if (!response.ok) {
      throw new Error("Falha ao atualizar cesta")
    }

    const updatedBasket = await response.json()

    // Mapeamento dos dados da API para o formato esperado pelo frontend
    return {
      id: updatedBasket.id || "",
      date: updatedBasket.date || updatedBasket.created_at || "",
      status: updatedBasket.status || "EM ANDAMENTO",
      description: updatedBasket.description || "",
      userId: updatedBasket.user_id,
      userName: updatedBasket.user_name || "",
      userNumber: updatedBasket.user_number || "",
      elementType: updatedBasket.element_type,
      calculationType: updatedBasket.calculation_type || "MÉDIA ARITMÉTICA",
      decimals: updatedBasket.decimals || 3,
      supportStatus: updatedBasket.support_status || "CADASTRO",
      clientStatus: updatedBasket.client_status || "EM ABERTO",
      finalizedDate: updatedBasket.finalized_date,
      basketDate: updatedBasket.basket_date,
      quotationDeadline: updatedBasket.quotation_deadline,
      possession: updatedBasket.possession || "CLIENTE",
      expenseElement: updatedBasket.expense_element || "MATERIAL DE CONSUMO",
      requestDate: updatedBasket.request_date || "",
      correctionIndex: updatedBasket.correction_index,
      correctionTarget: updatedBasket.correction_target,
      correctionStartDate: updatedBasket.correction_start_date,
      correctionEndDate: updatedBasket.correction_end_date,
      researchDocuments: updatedBasket.research_documents,
      createdAt: updatedBasket.created_at || updatedBasket.createdAt,
      updatedAt: updatedBasket.updated_at || updatedBasket.updatedAt,
    }
  } catch (error) {
    console.error("Erro ao atualizar cesta:", error)
    throw error
  }
}

// Função para excluir uma cesta
export const deleteBasket = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/api/baskets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Falha ao excluir cesta")
    }
  } catch (error) {
    console.error("Erro ao excluir cesta:", error)
    throw error
  }
}

// Função para buscar arquivos de uma cesta
export const fetchBasketFiles = async (basketId: string): Promise<FileItem[]> => {
  try {
    const response = await fetch(`http://localhost:3000/api/baskets/${basketId}/files`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Falha ao buscar arquivos da cesta")
    }

    const files = await response.json()
    return mapFiles(files)
  } catch (error) {
    console.error("Erro ao buscar arquivos da cesta:", error)
    throw error
  }
}

// Função para fazer upload de arquivos
export const uploadFiles = async (basketId: string, files: File[], fileCategory = "basket"): Promise<FileItem[]> => {
  try {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })
    formData.append("file_category", fileCategory)

    const response = await fetch(`http://localhost:3000/api/baskets/${basketId}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Falha ao fazer upload de arquivos")
    }

    const uploadedFiles = await response.json()
    return mapFiles(uploadedFiles)
  } catch (error) {
    console.error("Erro ao fazer upload de arquivos:", error)
    throw error
  }
}

// Função para excluir um arquivo
export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Falha ao excluir arquivo")
    }
  } catch (error) {
    console.error("Erro ao excluir arquivo:", error)
    throw error
  }
}

// Função para baixar um arquivo
export const downloadFile = async (fileId: string): Promise<Blob> => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/${fileId}/download`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Falha ao baixar arquivo")
    }

    return await response.blob()
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error)
    throw error
  }
}

// Função auxiliar para mapear arquivos da API para o formato do frontend
const mapFiles = (files: any[]): FileItem[] => {
  return files.map((file) => ({
    id: file.id?.toString(),
    name: file.name || "",
    size: file.size || "",
    sentDate: file.sent_date || "",
    type: file.type || "other",
    path: file.path,
    basketId: file.basket_id,
    fileCategory: file.file_category,
    createdAt: file.created_at || file.createdAt,
    updatedAt: file.updated_at || file.updatedAt,
  }))
}

// Função para formatar o tamanho do arquivo
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

