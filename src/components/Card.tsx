"use client"

import type React from "react"

type StatusType = "EM ANDAMENTO" | "PRONTA" | "LIBERADA PARA CESTA" | "EM ABERTO"

interface BasketItemProps {
  id: string
  date: string
  status: StatusType
  description: string
  userName: string
  userNumber?: string
  onClick: () => void
  isSelected?: boolean
}

export const BasketItem: React.FC<BasketItemProps> = ({
  id,
  date,
  status,
  description,
  userName,
  userNumber,
  onClick,
  isSelected = false,
}) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "EM ANDAMENTO":
        return "bg-[#78b6e8]"
      case "PRONTA":
        return "bg-[#8fe878]"
      case "LIBERADA PARA CESTA":
        return "bg-[#9078e8]"
      case "EM ABERTO":
        return "bg-[#decc49]"
      default:
        return "bg-gray-400"
    }
  }

  // Extract just the date part if the date includes time
  const displayDate = date.includes(" ") ? date.split(" ")[0] : date

  return (
    <div
      className={`border-b border-[#3a3a3a] pb-3 cursor-pointer hover:bg-[#333333] p-2 rounded ${isSelected ? "bg-[#333333]" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <span className="font-bold text-gray-200">#{id}</span>
          <span className="ml-2 text-gray-400 text-sm">{displayDate}</span>
        </div>
        <div className="text-xs text-gray-300">
          {userName} {userNumber && <span className="text-gray-400">{userNumber}</span>}
        </div>
      </div>
      <div className="mb-1">
        <span className={`text-xs px-2 py-0.5 rounded-sm ${getStatusColor(status)} text-white`}>{status}</span>
      </div>
      <div className="text-sm text-gray-300 line-clamp-2">{description}</div>
    </div>
  )
}

