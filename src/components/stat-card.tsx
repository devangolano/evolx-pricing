import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  change?: string
  description?: string
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, change, description, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={`border border-gray-200 shadow-sm ${className}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex justify-between items-start">
          <div className="p-2 rounded-lg bg-gray-50">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          {change && <span className="text-xs font-medium text-green-500">{change}</span>}
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</span>
          </div>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

