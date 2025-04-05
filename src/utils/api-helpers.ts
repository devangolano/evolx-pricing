// Função para formatar o tamanho do arquivo
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// Função para converter snake_case para camelCase
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// Função para converter camelCase para snake_case
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

// Função para converter um objeto de snake_case para camelCase
export const convertKeysToCamelCase = (obj: any): any => {
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

// Função para converter um objeto de camelCase para snake_case
export const convertKeysToSnakeCase = (obj: any): any => {
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

