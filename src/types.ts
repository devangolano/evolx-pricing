export type StatusType = "EM ANDAMENTO" | "PRONTA" | "LIBERADA PARA CESTA" | "EM ABERTO"

export interface BasketDetail {
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
}

