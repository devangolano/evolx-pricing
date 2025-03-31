import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

type LayoutProps = {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}