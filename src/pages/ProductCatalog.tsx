"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { SolicitationModal } from "@/components/solicitation-modal"
import { ExpenseElementSelector } from "@/components/expense-element-selector"

interface Product {
  id: string
  code: string
  quantity?: string
  description: string
  reviewed: boolean
  status?: string
  unit?: string
  expenseElement?: string
}

interface NewProduct {
  code: string
  unit: string
  description: string
  expenseElement: string
}

const units = ["UN", "COMPRIMIDO", "PACOTE", "CAIXA"]

export function ProductCatalog() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [unitSearch, setUnitSearch] = useState("")
  const [selectedExpenseElement, setSelectedExpenseElement] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [visibleProducts, setVisibleProducts] = useState(15)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento dos produtos
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const filteredUnits = units.filter((unit) => unit.toLowerCase().includes(unitSearch.toLowerCase()))

  // Sample data - replace with your actual data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      code: "#123456",
      quantity: "(14)",
      description: "ABACAVIR SULFATO, DOSAGEM/CONCENTRAÇÃO: 300 MG",
      reviewed: true,
      status: "COMPRIMIDO",
      unit: "COMPRIMIDO",
      expenseElement: "MEDICAMENTOS",
    },
    {
      id: "2",
      code: "#234567",
      quantity: "(4)",
      description: "ABAFADOR IMPRESSORA, TIPO: GABINETE",
      reviewed: false,
      status: "UN",
      unit: "UN",
      expenseElement: "MATERIAL DE ESCRITÓRIO",
    },
    {
      id: "3",
      code: "#939281",
      quantity: "(14)",
      description: "ABACAVIR SULFATO, DOSAGEM/CONCENTRAÇÃO: 300 MG",
      reviewed: true,
      status: "COMPRIMIDO",
      unit: "COMPRIMIDO",
      expenseElement: "MEDICAMENTOS",
    },
    {
      id: "4",
      code: "#1125720",
      quantity: "(4)",
      description: "ABAFADOR IMPRESSORA, TIPO: GABINETE",
      reviewed: false,
      status: "UN",
      unit: "UN",
      expenseElement: "MATERIAL DE ESCRITÓRIO",
    },
  ])

  const filteredProducts = products.filter((product) => {
    const searchMatch =
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    const unitMatch = !unitSearch || product.unit?.toLowerCase().includes(unitSearch.toLowerCase())
    const expenseElementMatch = !selectedExpenseElement || product.expenseElement === selectedExpenseElement

    return searchMatch && unitMatch && expenseElementMatch
  })

  const displayedProducts = filteredProducts.slice(0, visibleProducts)
  const hasMoreProducts = filteredProducts.length > visibleProducts

  const handleClearFilters = () => {
    setUnitSearch("")
    setSelectedExpenseElement("")
    setSearchTerm("")
  }

  const handleSaveSolicitation = (data: NewProduct) => {
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      code: `#${data.code.padStart(6, "0")}`,
      description: data.description,
      reviewed: false,
      status: data.unit,
      unit: data.unit,
      expenseElement: data.expenseElement,
    }

    setProducts((prev) => [product, ...prev])
    setIsDialogOpen(false)
  }

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 15)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Cabeçalho */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2 px-2 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => navigate("/inicio")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">Produtos</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hidden sm:flex"
              onClick={handleClearFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-[#7baa3d] hover:bg-[#6a9934]"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Novo Produto</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Área de Filtros */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-[49px] sm:top-[73px] z-10">
        <div className="p-2 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1 sm:max-w-[300px]">
            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-9 pr-4 py-2 h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 sm:hidden"
              onClick={handleClearFilters}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="UNIDADE"
                className="bg-white"
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
              />
              {unitSearch && filteredUnits.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md border shadow-lg">
                  <div className="py-1">
                    {filteredUnits.map((unit) => {
                      return (
                        <button
                          key={unit}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => {
                            setUnitSearch(unit)
                          }}
                        >
                          {unit}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full sm:w-[200px]">
              <ExpenseElementSelector
                value={selectedExpenseElement}
                onChange={setSelectedExpenseElement}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 sm:p-4">
            {isLoading && (
              <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Carregando...</p>
                </div>
              </div>
            )}
            {filteredProducts.length > 0 ? (
              <div className="space-y-2">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group rounded p-3 shadow-sm transition-all relative ${
                      product.reviewed
                        ? "bg-white border-l-4 border-[#7baa3d] hover:shadow-md hover:scale-[1.01]"
                        : "bg-white opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${!product.reviewed ? "text-gray-400" : "text-[#7baa3d] font-medium"}`}>{product.code}</span>
                          {product.quantity && <span className="text-xs text-gray-400">{product.quantity}</span>}
                        </div>
                        <p className={`text-sm ${product.reviewed ? "text-gray-700" : "text-gray-600"}`}>{product.description}</p>
                        {product.expenseElement && (
                          <div className="mt-1">
                            <span className={`text-xs ${product.reviewed ? "text-[#7baa3d]" : "text-gray-400"}`}>{product.expenseElement}</span>
                          </div>
                        )}
                      </div>
                      {product.status && (
                        <span className="text-xs text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">
                          {product.status}
                        </span>
                      )}
                    </div>
                    {!product.reviewed && (
                      <div className="absolute hidden group-hover:block bg-white text-gray-700 px-2 py-0.5 rounded text-xs -top-2 left-1/2 transform -translate-x-1/2 border border-gray-200 shadow-sm whitespace-nowrap">
                        Não revisado
                      </div>
                    )}
                  </div>
                ))}
                {hasMoreProducts && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      className="text-[#7baa3d] hover:text-[#6a9934] hover:bg-[#1e1e1e] border-[#7baa3d]"
                    >
                      Ver mais
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <p className="text-gray-500 mb-4 text-center">Nenhum item encontrado</p>
                <Button
                  className="bg-[#7baa3d] hover:bg-[#6a9934] text-white"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Solicitar cadastro de produto
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Modal de Cadastro */}
      <SolicitationModal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={handleSaveSolicitation} />
    </div>
  )
}
