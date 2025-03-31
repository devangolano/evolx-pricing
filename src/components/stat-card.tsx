import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  change?: string
  icon?: LucideIcon
  className?: string
  description?: string
}

export function StatCard({ title, value, change, icon: Icon, className }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && <span className="text-sm text-green-500">{change}</span>}
        </div>
        {Icon && <Icon className={`w-8 h-8 ${className}`} />}
      </div>
    </div>
  )
}
  
  