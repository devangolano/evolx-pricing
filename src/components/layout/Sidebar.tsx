import { Clock, LayoutGrid, MessageSquare, FileText, ClipboardList, Settings, LogOut, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar tamanho inicial
    checkScreenSize();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Se for mobile e não estiver aberto, não renderiza
  if (isMobile && !isOpen) return null;

  const sidebarClasses = isMobile
    ? "fixed inset-y-0 left-0 z-50 w-[242px] bg-white flex flex-col h-full shadow-lg transform transition-transform duration-300 ease-in-out"
    : "w-[242px] bg-white flex flex-col h-full";

  const menuItems = [
    { icon: Clock, label: "Página Inicial", path: "/inicio" },
    { icon: LayoutGrid, label: "Cestas de Preços", path: "/cestas-precos" },
    { icon: ClipboardList, label: "Catálogo de Produtos", path: "/catalogo-produtos" },
    { icon: MessageSquare, label: "Atendimento", path: "/atendimento" },
    { icon: FileText, label: "Catálogo de Preços", path: "/catalogo-precos" },
  ];

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = '/auth/entrar';
  };

  const handleNavigation = (path: string) => {
    if (isMobile) {
      // Add fade-out animation class
      const sidebar = document.querySelector('.sidebar-container');
      sidebar?.classList.add('animate-fadeOut');

      // Wait for animation and then navigate
      setTimeout(() => {
        navigate(path);
        onClose?.();
      }, 300);
    } else {
      navigate(path);
    }
  };

  return (
    <aside className={`${sidebarClasses} sidebar-container ${
      isOpen ? 'animate-fadeIn' : ''
    }`}>
      {isMobile && (
        <div className="flex justify-end p-2">
          <button 
            onClick={onClose}
            className="text-[#333333] hover:text-[#7baa3d]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center ${
                  location.pathname === item.path
                    ? "bg-[#333333] text-white"
                    : "text-[#333333] hover:bg-[#333333] hover:text-white"
                } cursor-pointer p-2 rounded`}
              >
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo-iturama.png"
            alt="Prefeitura Municipal de Iturama"
            className="max-w-[180px]"
          />
          <div className="text-center text-xs font-semibold text-[#333333]">
            <div>PREFEITURA MUNICIPAL</div>
            <div>DE ITURAMA</div>
          </div>
        </div>

        <ul className="space-y-2">
          <li>
            <Link
              to="/configuracoes"
              className="flex items-center text-[#333333] text-sm hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded"
            >
              <Settings className="w-5 h-5 mr-2" />
              <span>Configurações</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center text-[#333333] text-sm hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}