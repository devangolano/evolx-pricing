"use client"

import React, { useState, useEffect } from "react"
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
import { type Product, type NewProduct } from "@/services/product-service"
import { notify } from "@/config/toast"

interface SolicitationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: NewProduct) => Promise<void>
  productToEdit?: Product
}

export function SolicitationModal({ isOpen, onClose, onSave, productToEdit }: SolicitationModalProps) {
  const [formData, setFormData] = useState<NewProduct>({
    code: "",
    unit: "",
    description: "",
    expenseElement: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        code: productToEdit.code,
        unit: productToEdit.unit,
        description: productToEdit.description,
        expenseElement: productToEdit.expenseElement,
      })
    } else {
      setFormData({
        code: "",
        unit: "",
        description: "",
        expenseElement: "",
      })
    }
  }, [productToEdit])

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove qualquer caractere não numérico
    const onlyNumbers = e.target.value.replace(/[^\d]/g, "")
    setFormData((prev) => ({ ...prev, code: onlyNumbers }))
  }

  const handleSave = async () => {
    // Validar campos obrigatórios
    if (!formData.code || !formData.unit || !formData.description || !formData.expenseElement) {
      notify.error("Todos os campos são obrigatórios")
      return
    }

    try {
      setIsSaving(true)
      await onSave(formData)
      setFormData({ code: "", unit: "", description: "", expenseElement: "" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#121212] border-0 shadow-2xl w-full max-w-[95vw] sm:max-w-lg mx-4 p-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-gray-400 cursor-pointer" onClick={onClose} />
            <DialogTitle className="text-white">
              {productToEdit ? "Editar Produto" : "Solicitar Cadastro"}
            </DialogTitle>
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
                required
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
                required
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
                required
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

        {/* Botões */}
        <div className="p-4 border-t border-[#2a2a2a] flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-[#2a2a2a] text-gray-400 hover:text-white">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#7baa3d] hover:bg-[#6a9934]">
            {isSaving ? (
              <>
                <span className="mr-2">Salvando</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              </>
            ) : (
              productToEdit ? "Salvar" : "Cadastrar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
