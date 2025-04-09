import api from "./api"

export interface Product {
  id: string
  code: string
  description: string
  unit: string
  expenseElement: string
  reviewed?: boolean
}

export interface NewProduct {
  code: string
  description: string
  unit: string
  expenseElement: string
}

// Função para buscar todos os produtos
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/api/products")
  return response.data
}

// Função para criar um novo produto
export const createProduct = async (product: NewProduct): Promise<Product> => {
  const response = await api.post<Product>("/api/products", product)
  return response.data
}

// Função para atualizar um produto
export const updateProduct = async (id: string, product: NewProduct): Promise<Product> => {
  const response = await api.put<Product>(`/api/products/${id}`, product)
  return response.data
}

// Função para excluir um produto
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/api/products/${id}`)
}
