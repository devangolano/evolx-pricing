import { RefreshCw, Trash2, Copy, SaveAll, Eye, EyeOff, Lock, User2, Building2 } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import { notify } from "../config/toast";
import axios from "axios";

const api = axios.create({
  baseURL: "https://ovolx-api-1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    document: "",
    currentPassword: "",
    newPassword: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          setIsLoading(true);
          // Ajustado para usar o prefixo /auth nas rotas
          const response = await api.get('/auth/users/profile');
          const userData = response.data;
          
          setFormData({
            name: userData.name || "",
            client: userData.prefecture || "", // corresponde ao campo do backend
            document: formatCpfCnpj(userData.document || ""),
            currentPassword: "",
            newPassword: "",
          });

          if (userData.photo) {
            setProfileImage(`${api.defaults.baseURL}/uploads/${userData.photo}`);
          }
        } catch (error: any) {
          notify.error(error.response?.data?.error || "Erro ao carregar dados do perfil");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserData();
  }, []);

  // Função para upload de imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      // Ajustado para usar o prefixo /auth nas rotas
      const response = await api.put('/auth/users/profile', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data?.photo) {
        setProfileImage(`${api.defaults.baseURL}/uploads/${response.data.photo}`);
        notify.success("Foto atualizada com sucesso!");
      }
    } catch (error: any) {
      notify.error(error.response?.data?.error || "Erro ao atualizar foto");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para salvar alterações no perfil
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updateData: any = {
        name: formData.name,
        document: formData.document.replace(/\D/g, ''),
        prefecture: formData.client, // corresponde ao campo do backend
      };

      // Se estiver atualizando a senha
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }


      notify.success("Perfil atualizado com sucesso!");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (error: any) {
      notify.error(error.response?.data?.error || "Falha ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar CPF/CNPJ
  function formatCpfCnpj(value: string) {
    value = value.replace(/\D/g, "")
  
    if (value.length > 14) return value.slice(0, 14)
    if (value.length > 11) {
      return value
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
    }
  
    return value
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})(\d)/, "$1-$2")
  }
  
  // Função para lidar com alterações nos inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'document') {
      setFormData(prev => ({
        ...prev,
        [name]: formatCpfCnpj(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Estado para controlar visibilidade das senhas
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false
  });

  // Função para alternar visibilidade das senhas
  const togglePasswordVisibility = (field: 'current' | 'new') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Função para excluir foto
  const handleDeletePhoto = async () => {
    if (!profileImage) return;
    
    setIsLoading(true);
    try {
      // Ajustado para usar o prefixo /auth nas rotas
      await api.delete('/auth/user/delete-photo');
      setProfileImage(null);
      
      notify.success("Foto removida com sucesso!");
    } catch (error: any) {
      notify.error(error.response?.data?.error || "Erro ao remover foto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 shadow-lg bg-white border-b border-[#e0e0e0]">
        <h1 className="text-xl font-medium text-[#302f2f]">Editar perfil</h1>
        <button 
          className={`text-[#7baa3d] hover:opacity-80 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSave}
          disabled={isLoading}
        >
          <SaveAll />
        </button>
      </div>

      <div className="flex justify-center p-3 sm:p-6">
        <div className="w-full max-w-[800px] bg-white rounded-lg p-4 sm:p-8">
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="profile-image" className={`cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[#2C2C2C] rounded-full flex items-center justify-center mb-4 overflow-hidden">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ3ztWTGwSgvZJvsA49k950OqfYRhhssQqaw&s"
                    alt="User Avatar"
                    className="h-full w-full text-6xl"
                  />
                )}
              </div>
            </label>

            <div className="flex gap-6">
              <button 
                className={`text-[#646464] hover:text-[#7baa3d] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (fileInputRef.current && !isLoading) {
                    fileInputRef.current.click();
                  }
                }}
                disabled={isLoading}
                title="Atualizar foto"
              >
                <RefreshCw size={24} />
              </button>
              <button 
                className={`text-[#646464] hover:text-[#7baa3d] transition-colors ${isLoading || !profileImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleDeletePhoto}
                disabled={isLoading || !profileImage}
                title="Excluir foto"
              >
                <Trash2 size={24} />
              </button>
              <button 
                className={`text-[#646464] hover:text-[#7baa3d] transition-colors ${isLoading || !profileImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={async () => {
                  if (profileImage && !isLoading) {
                    try {
                      await navigator.clipboard.writeText(profileImage);
                      notify.success("URL da imagem copiada com sucesso!");
                    } catch (error) {
                      notify.error("Erro ao copiar URL da imagem");
                    }
                  }
                }}
                disabled={isLoading || !profileImage}
                title="Copiar URL da imagem"
              >
                <Copy size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm text-[#646464] mb-1">NOME</label>
              <div className="relative">
                <User2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#646464] w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded px-3 py-2 text-[#2c2c2c] border pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#646464] mb-1">CLIENTE</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#646464] w-4 h-4" />
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full rounded px-3 py-2 text-[#2c2c2c] border pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#646464] mb-1">CPF/CNPJ</label>
              <div className="relative">
                <User2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#646464] w-4 h-4" />
                <input
                  type="text"
                  name="document"
                  value={formData.document}
                  onChange={handleInputChange}
                  className="w-full rounded px-3 py-2 text-[#2c2c2c] border pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#646464] mb-1">SENHA ATUAL</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#646464] w-4 h-4" />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full rounded px-3 py-2 text-[#2c2c2c] border pr-10 pl-9"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#646464] hover:text-[#7baa3d]"
                  disabled={isLoading}
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#646464] mb-1">NOVA SENHA</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#646464] w-4 h-4" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full rounded px-3 py-2 text-[#2c2c2c] border pr-10 pl-9"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#646464] hover:text-[#7baa3d]"
                  disabled={isLoading}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}