"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Filter, Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { SolicitationModal } from "@/components/solicitation-modal"
import { ExpenseElementSelector } from "@/components/expense-element-selector"
import { notify } from "@/config/toast"
import { fetchProducts, createProduct, deleteProduct, updateProduct, type Product, type NewProduct } from "@/services/product-service"

const units = ["UN", "COMPRIMIDO", "PACOTE", "CAIXA"]

export function ProductCatalog() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [unitSearch, setUnitSearch] = useState("")
  const [selectedExpenseElement, setSelectedExpenseElement] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [visibleProducts, setVisibleProducts] = useState(15)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      notify.error("Erro ao carregar produtos")
      console.error("Erro ao buscar produtos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUnits = units.filter((unit) => unit.toLowerCase().includes(unitSearch.toLowerCase()))

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

  const handleSaveSolicitation = async (data: NewProduct): Promise<void> => {
    try {
      setIsLoading(true)
      if (selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct.id, data)
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p))
        notify.success("Produto atualizado com sucesso!")
      } else {
        const newProduct = await createProduct(data)
        setProducts(prev => [newProduct, ...prev])
        notify.success("Produto criado com sucesso!")
      }
      setIsDialogOpen(false)
      setSelectedProduct(undefined)
    } catch (error) {
      notify.error(selectedProduct ? "Erro ao atualizar produto" : "Erro ao criar produto")
      console.error("Erro ao salvar produto:", error)
      throw error // Propaga o erro para o modal mostrar o estado de erro
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 15)
  }

  const handleDelete = async (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        setIsLoading(true)
        await deleteProduct(productId)
        setProducts(prev => prev.filter(p => p.id !== productId))
        notify.success("Produto excluído com sucesso!")
      } catch (error) {
        notify.error("Erro ao excluir produto")
        console.error("Erro ao excluir produto:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando...</p>
          </div>
        </div>
      )}

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
                    {filteredUnits.map((unit) => (
                      <button
                        key={unit}
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                        onClick={() => setUnitSearch(unit)}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <ExpenseElementSelector
              value={selectedExpenseElement}
              onChange={setSelectedExpenseElement}
            />
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <ScrollArea className="flex-1">
        <div className="p-2 sm:p-6">
          {!isLoading && displayedProducts.length > 0 ? (
            <>
              <div className="grid gap-4">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white py-2 px-3 rounded-lg border border-gray-200 hover:border-[#7baa3d] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">{product.code}</span>
                          {product.reviewed && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Revisado
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                          {product.description}
                        </h3>
                        <p className="text-sm text-gray-600">{product.expenseElement}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium text-gray-900">{product.unit}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-gray-100 text-gray-500 hover:text-gray-900"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-red-100 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {hasMoreProducts && (
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" onClick={handleLoadMore}>
                    Carregar mais
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 mb-4">
                  {searchTerm ? `Nenhum produto encontrado para "${searchTerm}"` : "Nenhum produto cadastrado"}
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#7baa3d] hover:bg-[#6a9934]"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Novo Produto
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Modal de Nova Solicitação */}
      <SolicitationModal
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedProduct(undefined)
        }}
        onSave={handleSaveSolicitation}
        productToEdit={selectedProduct}
      />
    </div>
  )
}
