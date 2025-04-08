import { Trash2, Copy, SaveAll, Eye, EyeOff, Lock, User2, Building2, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import { notify } from "../config/toast";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    document: "",
    prefecture: "",
    currentPassword: "",
    newPassword: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função para obter a URL completa da imagem
  const getFullImageUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    return `${api.defaults.baseURL}/uploads/${photoPath}`;
  };

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('Nenhum token encontrado, redirecionando para login');
          notify.error('Sessão expirada. Por favor, faça login novamente.');
          navigate('/auth/entrar');
          return;
        }

        // Garantir que o token está definido no header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/auth/users/profile');
        
        const userData = response.data;
        
        setFormData({
          name: userData.name || "",
          document: userData.document || "",
          prefecture: userData.prefecture || "",
          currentPassword: "",
          newPassword: "",
        });

        if (userData.photo) {
          setProfileImage(userData.photo);
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados do usuário:', error);
        if (error.response) {
          
          if (error.response.status === 401 || error.response.status === 404) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            notify.error('Sessão expirada. Por favor, faça login novamente.');
            navigate('/auth/entrar');
            return;
          }
        }
        notify.error('Erro ao carregar dados do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Função para upload de imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await api.put('/auth/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.photo) {
        setProfileImage(response.data.photo);
        notify.success("Foto atualizada com sucesso!");
      }
    } catch (error) {
      notify.error("Erro ao atualizar foto");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para remover a foto
  const handleRemovePhoto = async () => {
    if (!profileImage || isLoading) return;
    
    setIsLoading(true);
    try {
      await api.delete('/auth/users/delete-photo');
      setProfileImage(null);
      
      notify.success("Foto removida com sucesso!");
    } catch (error) {
      notify.error("Erro ao remover foto");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para copiar URL da imagem
  const handleCopyImageUrl = async () => {
    if (!profileImage || isLoading) return;
    
    try {
      const imageUrl = getFullImageUrl(profileImage);
      if (imageUrl) {
        await navigator.clipboard.writeText(imageUrl);
        notify.success("URL da imagem copiada com sucesso!");
      }
    } catch (error) {
      notify.error("Erro ao copiar URL da imagem");
    }
  };

  // Função para salvar alterações no perfil
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('document', formData.document.replace(/\D/g, ''));
      formDataToSend.append('prefecture', formData.prefecture);

      if (formData.currentPassword && formData.newPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
      }

      await api.put('/auth/users/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      notify.success("Perfil atualizado com sucesso!");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (error) {
      notify.error("Falha ao atualizar perfil");
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

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando...</p>
          </div>
        </div>
      )}

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
                  <img 
                    src={getFullImageUrl(profileImage) || undefined} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
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
                onClick={handleRemovePhoto}
                disabled={isLoading || !profileImage}
                title="Excluir foto"
              >
                <Trash2 size={24} />
              </button>
              <button 
                className={`text-[#646464] hover:text-[#7baa3d] transition-colors ${isLoading || !profileImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleCopyImageUrl}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#7baa3d]"
                  placeholder="Digite seu nome"
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
                  name="prefecture"
                  value={formData.prefecture}
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