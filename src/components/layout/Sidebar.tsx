import { Clock, LayoutGrid, Heart, MessageSquare, FileText, ClipboardList, Settings, LogOut, X } from "lucide-react"
import { useState, useEffect } from "react"

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <aside className={sidebarClasses}>
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
          <li className="flex items-center text-[#333333] hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded">
            <div className="w-6 h-6 mr-2 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm">Página Inicial</span>
          </li>
          <li className="flex items-center bg-[#333333] text-white cursor-pointer p-2 rounded">
            <div className="w-6 h-6 mr-2 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-sm">Cestas de Preços</span>
          </li>
          <li className="flex items-center text-[#333333] hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded">
            <div className="w-6 h-6 mr-2 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-sm">Cestas</span>
          </li>
          <li className="flex items-center text-[#333333] hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded">
            <div className="w-6 h-6 mr-2 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-sm">Atendimento</span>
          </li>
          <li className="flex items-center text-[#333333] hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded">
            <div className="w-6 h-6 mr-2 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-sm">Catálogo de Preços</span>
          </li>
          <li className="flex items-center text-[#333333] hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded">
            <div className="w-6 h-6 mr-2 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-sm">Catálogo de Produtos</span>
          </li>
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
          <li className="flex items-center text-[#333333] text-sm hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded">
            <Settings className="w-5 h-5 mr-2" />
            <span>Configurações</span>
          </li>
          <li className="flex items-center text-[#333333] text-sm hover:bg-[#333333] hover:text-white cursor-pointer p-2 rounded">
            <LogOut className="w-5 h-5 mr-2" />
            <span>sair</span>
          </li>
        </ul>
      </div>
    </aside>
  )
}