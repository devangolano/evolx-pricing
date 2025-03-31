"use client"
import { User, FileText } from "lucide-react"

type StatusType = "EM ANDAMENTO" | "PRONTA" | "LIBERADA PARA CESTA" | "EM ABERTO"

interface StatusConfig {
  label: string
  bgColor: string
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  "EM ANDAMENTO": { label: "EM ANDAMENTO", bgColor: "bg-[#78b6e8]" },
  PRONTA: { label: "PRONTA", bgColor: "bg-[#8fe878]" },
  "LIBERADA PARA CESTA": { label: "LIBERADA PARA CESTA", bgColor: "bg-[#9078e8]" },
  "EM ABERTO": { label: "EM ABERTO", bgColor: "bg-[#decc49]" },
}

interface BasketItemProps {
  id: string
  date: string
  status: StatusType
  description: string
  userName: string
  onClick?: () => void
}

export function BasketItem({ id, date, status, description, userName, onClick }: BasketItemProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-md cursor-pointer w-full" onClick={onClick}>
      {/* ID e Data - Centralizados */}
      <div className="text-center pt-5 pb-3">
        <div className="font-medium text-lg text-[#333333]">#{id}</div>
        <div className="text-sm text-[#646464]">{date}</div>
      </div>

      {/* Status - Centralizado */}
      <div className="flex justify-center mb-4">
        <span className={`inline-block px-6 py-1.5 ${config.bgColor} text-white text-sm font-normal rounded-md`}>
          {config.label}
        </span>
      </div>

      {/* Conteúdo com ícone à esquerda */}
      <div className="px-5 pb-5">
        {/* Descrição com ícone */}
        <div className="flex mb-4">
          <div className="mr-3 mt-0.5 flex-shrink-0">
            <FileText className="h-5 w-5 text-[#646464]" />
          </div>
          <p className="text-sm text-[#333333] leading-normal">{description}</p>
        </div>

        {/* Usuário */}
        <div className="flex items-center text-sm text-[#646464]">
          <User className="w-5 h-5 mr-2" />
          <span className="text-base text-[#555555]">{userName}</span>
        </div>
      </div>
    </div>
  )
}

