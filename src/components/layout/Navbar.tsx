import { Search, ChevronDown, Menu } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-[#333333] text-white px-4 sm:px-6 py-4">
        {/* Desktop Layout */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="h-6 w-6 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <img src="/logo2.png" alt="EVOLX" className="h-8" />
          </div>

          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#646464]" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar"
                className="bg-white text-[#333333] rounded-full py-2 pl-10 pr-4 w-full focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white rounded-full flex items-center justify-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ3ztWTGwSgvZJvsA49k950OqfYRhhssQqaw&s"
                alt="User Avatar"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[#7baa3d] text-base">Conta de Usuário</span>
              <div className="flex items-center text-sm text-gray-300">
                <button onClick={handleProfileClick}>Meu Perfil</button>
                <span className="mx-2">|</span>
                <button>SAIR</button>
              </div>
            </div>
            <div className="relative ml-1 sm:ml-2">
              <button 
                className="bg-transparent"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <ChevronDown className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#646464]" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar"
              className="bg-white text-[#333333] rounded-full py-2 pl-10 pr-4 w-full focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-[#444444] rounded-md p-4">
            <div className="flex flex-col space-y-3">
              <span className="text-[#7baa3d]">Conta de Usuário</span>
              <button onClick={handleProfileClick}>Meu Perfil</button>
              <button>SAIR</button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  )
}