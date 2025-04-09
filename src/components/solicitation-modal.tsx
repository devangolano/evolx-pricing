"use client"

import React, { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExpenseElementSelector } from "./expense-element-selector"

interface SolicitationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function SolicitationModal({ isOpen, onClose, onSave }: SolicitationModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    unit: "",
    description: "",
    expenseElement: "",
  })

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove qualquer caractere não numérico
    const onlyNumbers = e.target.value.replace(/[^\d]/g, "")
    setFormData((prev) => ({ ...prev, code: onlyNumbers }))
  }

  const handleSave = () => {
    onSave(formData)
    setFormData({ code: "", unit: "", description: "", expenseElement: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#121212] border-0 shadow-2xl w-full max-w-[95vw] sm:max-w-lg mx-4 p-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-gray-400 cursor-pointer" onClick={onClose} />
            <DialogTitle className="text-white">Solicitar Cadastro</DialogTitle>
          </div>
        </DialogHeader>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-400">
                Código
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={handleCodeChange}
                className="bg-[#1e1e1e] border-[#2a2a2a] text-white"
                placeholder="Digite o código do produto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-gray-400">
                Unidade
              </Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                className="bg-[#1e1e1e] border-[#2a2a2a] text-white"
                placeholder="Digite a unidade do produto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-400">
                Descrição
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-[#1e1e1e] border-[#2a2a2a] text-white"
                placeholder="Digite a descrição do produto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseElement" className="text-gray-400">
                Elemento de Despesa
              </Label>
              <ExpenseElementSelector
                value={formData.expenseElement}
                onChange={(value) => setFormData((prev) => ({ ...prev, expenseElement: value }))}
              />
            </div>
          </div>
        </div>

        {/* Botões fixos */}
        <div className="border-t border-[#2a2a2a] p-4">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-32 border-[#2a2a2a] text-gray-400 hover:bg-[#1e1e1e]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="w-32 bg-[#7baa3d] hover:bg-[#6a9934]"
              disabled={!formData.code || !formData.unit || !formData.description}
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
