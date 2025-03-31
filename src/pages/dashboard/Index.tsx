import { 
  ShoppingBasket, Users, Database, 
  Package, TrendingUp, Bell, Search
} from "lucide-react"
import { StatCard } from "../../components/stat-card"

const metricsData = [
  {
    title: "Cestas de Preços",
    value: "24",
    change: "+3",
    description: "Últimos 30 dias",
    icon: ShoppingBasket,
    color: "text-blue-500"
  },
  {
    title: "Cestas Ativas",
    value: "156",
    change: "+12",
    description: "Em operação",
    icon: Package,
    color: "text-green-500"
  },
  {
    title: "Atendimentos",
    value: "47",
    change: "+5",
    description: "Em andamento",
    icon: Users,
    color: "text-purple-500"
  },
  {
    title: "Produtos Catalogados",
    value: "1,234",
    change: "+8",
    description: "Total atual",
    icon: Database,
    color: "text-yellow-500"
  }
]

const recentActivities = [
  { id: 1, user: "Setor Comercial", action: "Nova cesta de preços criada", time: "2 min atrás", priority: "high" },
  { id: 2, user: "Atendimento", action: "Novo chamado registrado", time: "15 min atrás", priority: "medium" },
  { id: 3, user: "Cadastro", action: "Produto adicionado ao catálogo", time: "1 hora atrás", priority: "low" },
  { id: 4, user: "Comercial", action: "Atualização de preços", time: "2 horas atrás", priority: "medium" }
]

const catalogOverview = [
  { id: 1, title: "Total de Produtos", value: "1,234", status: "success", trend: "+12% mês" },
  { id: 2, title: "Cestas Ativas", value: "156", status: "warning", trend: "+5% mês" },
  { id: 3, title: "Atendimentos Abertos", value: "47", status: "info", trend: "-2% mês" }
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          </div>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <StatCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            description={metric.description}
            icon={metric.icon}
            className={`${metric.color} shadow-sm hover:shadow-md transition-shadow duration-200`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Catalog Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Visão Geral do Catálogo</h2>
              <p className="text-sm text-gray-500">Atualizado há 5 minutos</p>
            </div>
            <Database className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {catalogOverview.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b">
                <div>
                  <span className="font-medium text-gray-700">{item.title}</span>
                  <p className="text-sm text-gray-500">{item.trend}</p>
                </div>
                <span className={`font-bold text-lg ${
                  item.status === 'success' ? 'text-green-500' :
                  item.status === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Atividades Recentes</h2>
              <p className="text-sm text-gray-500">Últimas 24 horas</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.priority === 'high' ? 'bg-red-500' :
                    activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-800">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}