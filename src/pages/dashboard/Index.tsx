"use client"

import {
  ShoppingBasket,
  Users,
  Database,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const metricsData = [
  {
    title: "Cestas de Preços",
    value: "24",
    change: "+3",
    description: "Últimos 30 dias",
    icon: ShoppingBasket,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    trend: "up",
  },
  {
    title: "Cestas Ativas",
    value: "156",
    change: "+12",
    description: "Em operação",
    icon: Package,
    color: "text-green-500",
    bgColor: "bg-green-50",
    trend: "up",
  },
  {
    title: "Atendimentos",
    value: "47",
    change: "+5",
    description: "Em andamento",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    trend: "up",
  },
  {
    title: "Produtos",
    value: "1,234",
    change: "+8",
    description: "Total atual",
    icon: Database,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    trend: "up",
  },
]

const recentActivities = [
  { id: 1, user: "Setor Comercial", action: "Nova cesta de preços criada", time: "2 min atrás", priority: "high" },
  { id: 2, user: "Atendimento", action: "Novo chamado registrado", time: "15 min atrás", priority: "medium" },
  { id: 3, user: "Cadastro", action: "Produto adicionado ao catálogo", time: "1 hora atrás", priority: "low" },
  { id: 4, user: "Comercial", action: "Atualização de preços", time: "2 horas atrás", priority: "medium" },
]

const catalogOverview = [
  { id: 1, title: "Total de Produtos", value: "1,234", status: "success", trend: "+12% mês" },
  { id: 2, title: "Cestas Ativas", value: "156", status: "warning", trend: "+5% mês" },
  { id: 3, title: "Atendimentos Abertos", value: "47", status: "info", trend: "-2% mês" },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto py-3 sm:py-4 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Bem-vindo ao seu painel de controle</p>
        </div>
        <Button className="h-8 sm:h-9 text-xs sm:text-sm bg-[#7baa3d] hover:bg-[#6a9934] text-white">
          Exportar Relatório
        </Button>
      </div>

      {/* Metrics Cards - Compact Version */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metricsData.map((metric, index) => (
          <Card key={index} className="border bg-white border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <CardContent className="p-3 flex items-center">
              <div className={`${metric.bgColor} p-2 rounded-lg mr-3`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500 truncate">{metric.title}</p>
                  <div className="flex items-center ml-1">
                    <span
                      className={`text-xs font-medium ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}
                    >
                      {metric.change}
                    </span>
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Left Column - Catalog Overview */}
        <Card className="border bg-white border-gray-200 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">Visão Geral do Catálogo</CardTitle>
                <CardDescription className="text-xs text-gray-500">Atualizado há 5 minutos</CardDescription>
              </div>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <div className="space-y-2">
              {catalogOverview.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={`mr-2 ${
                        item.status === "success"
                          ? "border-green-200 bg-green-50 text-green-600"
                          : item.status === "warning"
                            ? "border-yellow-200 bg-yellow-50 text-yellow-600"
                            : "border-blue-200 bg-blue-50 text-blue-600"
                      }`}
                    >
                      {item.trend}
                    </Badge>
                    <span className="font-medium text-sm text-gray-700">{item.title}</span>
                  </div>
                  <span className="font-bold text-lg">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7baa3d] hover:text-[#6a9934] hover:bg-green-50 text-xs"
              >
                Ver detalhes
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Activities */}
        <Card className="border bg-white border-gray-200 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">Atividades Recentes</CardTitle>
                <CardDescription className="text-xs text-gray-500">Últimas 24 horas</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <ScrollArea className="h-[220px] pr-4">
              <div className="space-y-2">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-gray-100">
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                        activity.priority === "high"
                          ? "bg-red-500"
                          : activity.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm text-gray-800">{activity.user}</p>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{activity.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{activity.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-3 pt-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7baa3d] hover:text-[#6a9934] hover:bg-green-50 text-xs"
              >
                Ver todas
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

