import axios from "axios"
import { convertKeysToCamelCase } from "@/utils/api-helpers"

// Obter a URL base da API de variáveis de ambiente ou usar um valor padrão
const API_BASE_URL = "http://localhost:3000"

// Crie uma instância do axios com configurações base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor para converter snake_case para camelCase nas respostas
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = convertKeysToCamelCase(response.data)
    }
    return response
  },
  (error) => Promise.reject(error),
)

// Função para verificar se a API está disponível
export async function checkApiHealth(): Promise<boolean> {
  try {
    await api.get("/health")
    return true
  } catch (error) {
    console.error("API não está disponível:", error)
    return false
  }
}

export default api
