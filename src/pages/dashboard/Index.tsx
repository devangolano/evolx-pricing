"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  Bell,
  RefreshCcw,
  Plus,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchBaskets } from "@/services/basket-service"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import {  formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Notification {
  id: string
  type: "finalizacao" | "atualizacao" | "nova_cesta"
  title: string
  message: string
  basketId: string
  userName: string
  clientStatus?: string
  status: string
  createdAt: Date
  read: boolean
}

export default function Dashboard() {
  const navigate = useNavigate()
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState({
    finalized: 0,
    inProgress: 0,
    open: 0,
    total: 0
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>("todas")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    loadBaskets()
    loadNotifications()
  }, [])

  const loadBaskets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const baskets = await fetchBaskets()

      setMetrics({
        finalized: baskets.filter(b => b.status === "PRONTA").length,
        inProgress: baskets.filter(b => b.status === "EM ANDAMENTO").length,
        open: baskets.filter(b => b.status === "EM ABERTO").length,
        total: baskets.length
      })
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err)
      setError("Não foi possível carregar os dados. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadNotifications = async () => {
    try {
      const baskets = await fetchBaskets()
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '{}')
      
      // Converter as cestas em notificações
      const newNotifications: Notification[] = baskets.map(basket => ({
        id: `${basket.id}-${basket.status}`,
        type: basket.status === "PRONTA" ? "finalizacao" : basket.status === "EM ANDAMENTO" ? "atualizacao" : "nova_cesta",
        title: basket.status === "PRONTA" ? "Cesta Finalizada" : basket.status === "EM ANDAMENTO" ? "Cesta Atualizada" : "Nova Cesta Criada",
        message: basket.status === "PRONTA" ? "A cesta foi finalizada com sucesso" : basket.status === "EM ANDAMENTO" ? "A cesta foi atualizada com novos itens" : "Uma nova cesta de preços foi criada",
        basketId: basket.id,
        userName: basket.userName || "Usuário não especificado",
        clientStatus: basket.clientStatus || "Status do cliente não especificado",
        status: basket.status,
        createdAt: new Date(basket.createdAt || Date.now()),
        read: readNotifications[`${basket.id}-${basket.status}`] || false
      }))

      setNotifications(newNotifications)
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
    }
  }

  const markAsRead = (notifId: string) => {
    // Atualizar estado local
    setNotifications(prev => prev.map(notif => 
      notif.id === notifId ? { ...notif, read: true } : notif
    ))

    // Persistir no localStorage
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '{}')
    readNotifications[notifId] = true
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'finalizacao':
        return CheckCircle2
      case 'atualizacao':
        return RefreshCcw
      case 'nova_cesta':
        return Plus
      default:
        return AlertCircle
    }
  }

  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  }

  const filteredNotifications = useMemo(() => {
    let filtered = notifications
    
    // Aplicar filtro por tipo
    if (selectedFilter === "todas") {
      filtered = notifications
    } else if (selectedFilter === "nao_lidas") {
      filtered = notifications.filter(notif => !notif.read)
    } else {
      filtered = notifications.filter(notif => notif.type === selectedFilter)
    }

    // Ordenar: não lidas primeiro, depois por data
    return filtered.sort((a, b) => {
      if (!a.read && b.read) return -1
      if (a.read && !b.read) return 1
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  }, [notifications, selectedFilter])

  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredNotifications.slice(startIndex, endIndex)
  }, [filteredNotifications, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      notificationsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedFilter])

  const metricsData = [
    {
      title: "Cestas Finalizadas",
      value: metrics.finalized.toString(),
      description: "Status: PRONTA",
      icon: null,
      color: "text-green-500",
      bgColor: "bg-white",
      borderColor: "border-l-4 border-green-500",
      hoverEffect: "hover:border-green-600 hover:shadow-md",
    },
    {
      title: "Cestas em Andamento",
      value: metrics.inProgress.toString(),
      description: "Status: EM ANDAMENTO",
      icon: null,
      color: "text-blue-500",
      bgColor: "bg-white",
      borderColor: "border-l-4 border-blue-500",
      hoverEffect: "hover:border-blue-600 hover:shadow-md",
    },
    {
      title: "Cestas em Aberto",
      value: metrics.open.toString(),
      description: "Status: EM ABERTO",
      icon: null,
      color: "text-yellow-500",
      bgColor: "bg-white",
      borderColor: "border-l-4 border-yellow-500",
      hoverEffect: "hover:border-yellow-600 hover:shadow-md",
    },
  ]

  const scrollToNotifications = () => {
    notificationsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id)
    navigate(`/cestas-precos/${notif.basketId}`)
  }

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando...</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Acompanhamento em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#7baa3d] hover:bg-[#6a9934] text-white" onClick={() => navigate('/cestas-precos/novo')} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Cesta
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={scrollToNotifications}
          >
            <Bell className="h-4 w-4" />
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
              >
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p>{error}</p>
          <Button variant="outline" className="mt-2 text-red-600 border-red-300" onClick={loadBaskets}>
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metricsData.map((metric, index) => (
          <Card 
            key={index} 
            className={`${metric.bgColor} ${metric.borderColor} ${metric.hoverEffect} transition-all cursor-pointer`}
            onClick={() => navigate('/cestas-precos')}
          >
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${metric.color}`}>{metric.title}</h3>
                </div>
                <div className="text-4xl font-bold mb-2">{metric.value}</div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  Ver detalhes
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white border shadow-sm" ref={notificationsRef}>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Notificações</CardTitle>
              <p className="text-sm text-gray-500">
                {notifications.filter(n => !n.read).length} não lidas
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${selectedFilter === 'todas' ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedFilter('todas')}
              >
                Todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${selectedFilter === 'nao_lidas' ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedFilter('nao_lidas')}
              >
                Não Lidas
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${selectedFilter === 'finalizacao' ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedFilter('finalizacao')}
              >
                Finalizadas
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${selectedFilter === 'atualizacao' ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedFilter('atualizacao')}
              >
                Atualizadas
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${selectedFilter === 'nova_cesta' ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedFilter('nova_cesta')}
              >
                Novas Cestas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] md:h-[500px] rounded-md border p-4">
            <div className="space-y-4">
              {paginatedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-lg border ${
                    !notif.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  } hover:shadow-md transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`${!notif.read ? 'text-blue-500' : 'text-gray-400'}`}>
                          {(() => {
                            const NotificationIcon = getNotificationIcon(notif.type)
                            return <NotificationIcon className="h-5 w-5" />
                          })()}
                        </div>
                        <h4 className="font-semibold">{notif.title}</h4>
                        {!notif.read && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Nova
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>Por: {notif.userName}</span>
                        <span>•</span>
                        <span>Status: {notif.status}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(notif.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={notif.type === 'finalizacao' ? 'secondary' : 'outline'}
                        className={
                          notif.type === 'finalizacao'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : notif.type === 'atualizacao'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                        }
                      >
                        {notif.type === 'finalizacao'
                          ? 'Finalizada'
                          : notif.type === 'atualizacao'
                          ? 'Atualizada'
                          : 'Nova'}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredNotifications.length > itemsPerPage && (
              <div className="mt-4">
                <div className="flex justify-center mb-2 text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else {
                          if (currentPage <= 3) {
                            pageNumber = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i
                          } else {
                            pageNumber = currentPage - 2 + i
                          }
                        }
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
