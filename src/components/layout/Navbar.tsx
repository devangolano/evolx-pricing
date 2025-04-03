"use client"

import { Search, ChevronDown, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import axios from "axios"

// Configuração da API
const api = axios.create({
  baseURL: "https://ovolx-api-1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
})

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Função para buscar dados do usuário da API
  const fetchUserData = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    setIsLoading(true)
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      const response = await api.get("/auth/users/profile")
      const user = response.data

      // Atualiza o localStorage com os dados mais recentes
      localStorage.setItem("user", JSON.stringify(user))

      setUserData(user)

      // Define a imagem de perfil se disponível
      if (user.photo) {
        setProfileImage(`${api.defaults.baseURL}/uploads/${user.photo}`)
      } else {
        setProfileImage(null)
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)

      // Tenta usar dados do localStorage como fallback
      const cachedUser = localStorage.getItem("user")
      if (cachedUser) {
        setUserData(JSON.parse(cachedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Busca dados do usuário ao montar o componente
  useEffect(() => {
    fetchUserData()

    // Adiciona um listener para atualizar os dados quando o usuário retorna à página
    window.addEventListener("focus", fetchUserData)

    // Cleanup
    return () => {
      window.removeEventListener("focus", fetchUserData)
    }
  }, [])

  // Adiciona um listener para o evento personalizado de atualização de perfil
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserData()
    }

    window.addEventListener("profileUpdated", handleProfileUpdate)

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate)
    }
  }, [])

  const handleProfileClick = () => {
    navigate("/profile")
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    setUserData(null)
    setProfileImage(null)
    window.location.href = "/auth/entrar"
  }

  return (
    <>
      <header className="bg-[#333333] text-white px-4 sm:px-6 py-4">
        {/* Desktop Layout */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="h-6 w-6 md:hidden">
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
            <div className="bg-white rounded-full flex items-center justify-center overflow-hidden h-8 w-8 sm:h-10 sm:w-10">
              {profileImage ? (
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={userData?.name || "Perfil"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ3ztWTGwSgvZJvsA49k950OqfYRhhssQqaw&s"
                  alt="Avatar Padrão"
                  className="h-full w-full rounded-full"
                />
              )}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[#7baa3d] text-base font-medium truncate max-w-[150px]">
                {isLoading ? "Carregando..." : userData?.name || "Conta de Usuário"}
              </span>
              <div className="flex items-center text-sm text-gray-300">
                <button onClick={handleProfileClick} className="hover:text-[#7baa3d] transition-colors">
                  Meu Perfil
                </button>
                <span className="mx-2">|</span>
                <button onClick={handleLogout} className="hover:text-[#7baa3d] transition-colors">
                  SAIR
                </button>
              </div>
            </div>
            <div className="relative ml-1 sm:ml-2">
              <button
                className="bg-transparent hover:bg-[#444444] rounded-full p-1 transition-colors"
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
          <div className="md:hidden mt-4 bg-[#444444] rounded-md p-4 absolute right-4 left-4 z-10 shadow-lg">
            <div className="flex flex-col space-y-3">
              <span className="text-[#7baa3d] font-medium">
                {isLoading ? "Carregando..." : userData?.name || "Conta de Usuário"}
              </span>
              <button onClick={handleProfileClick} className="text-left hover:text-[#7baa3d] transition-colors py-1">
                Meu Perfil
              </button>
              <button onClick={handleLogout} className="text-left hover:text-[#7baa3d] transition-colors py-1">
                SAIR
              </button>
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

