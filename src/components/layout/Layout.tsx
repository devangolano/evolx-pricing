import { Outlet } from 'react-router-dom'
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

export function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}