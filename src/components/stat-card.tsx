interface StatCardProps {
    title: string
    value: number | string
  }
  
  export function StatCard({ title, value }: StatCardProps) {
    return (
      <div className="px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg">
        <p className="text-sm text-[#646464]">{title}</p>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    )
  }
  
  