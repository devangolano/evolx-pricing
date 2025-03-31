import { Layout } from "../components/layout/Layout";
import { RefreshCw, Trash2, Copy, SaveAll, Eye, EyeOff } from "lucide-react";
import { useState, useRef } from "react";
import { notify } from "../config/toast";

export function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "João Paulo Pereira Domingos",
    client: "#3134400 - Prof Ituruna",
    document: "116.589.456-83",
    currentPassword: "",
    newPassword: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefreshImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyImage = async () => {
    if (profileImage) {
      try {
        await navigator.clipboard.writeText(profileImage);
        notify.success("Image URL copied to clipboard!");
      } catch (err) {
        notify.error("Failed to copy image URL");
      }
    }
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        profileImage
      };
      console.log("Saving profile data:", dataToSave);
      notify.success("Perfil atualizado com sucesso!");
    } catch (error) {
      notify.error("Falha ao atualizar perfil!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false
  });

  const togglePasswordVisibility = (field: 'current' | 'new') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Layout>
      <div className="flex justify-between items-center p-4 border-b border-[#e0e0e0]">
        <h1 className="text-xl font-medium text-[#302f2f]">Editar perfil</h1>
        <button 
          className="text-[#7baa3d] hover:opacity-80"
          onClick={handleSave}
        >
          <SaveAll />
        </button>
      </div>

      <div className="flex justify-center p-3 sm:p-6">
        <div className="w-[800px] bg-white rounded-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="profile-image" className="cursor-pointer">
              <div className="w-40 h-40 bg-[#2C2C2C] rounded-full flex items-center justify-center mb-4 overflow-hidden">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ3ztWTGwSgvZJvsA49k950OqfYRhhssQqaw&s"
                alt="User Avatar"
                className="h-[155px] w-[155px] text-6xl rounded-full"
              />
                )}
              </div>
            </label>

            <div className="flex gap-6">
              <button 
                className="text-[#646464] hover:text-[#7baa3d] transition-colors"
                onClick={handleRefreshImage}
              >
                <RefreshCw size={24} />
              </button>
              <button 
                className="text-[#646464] hover:text-[#7baa3d] transition-colors"
                onClick={handleDeleteImage}
              >
                <Trash2 size={24} />
              </button>
              <button 
                className="text-[#646464] hover:text-[#7baa3d] transition-colors"
                onClick={handleCopyImage}
              >
                <Copy size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-2">
              <label className="block text-sm text-[#646464] mb-1">NOME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full  rounded px-3 py-2 text-[#2c2c2c] border"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-[#646464] mb-1">CLIENTE</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full  rounded px-3 py-2 text-[#2c2c2c] border"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-[#646464] mb-1">CPF/CNPJ</label>
              <input
                type="text"
                name="document"
                value={formData.document}
                onChange={handleInputChange}
                className="w-full  rounded px-3 py-2 text-[#2c2c2c] border"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-[#646464] mb-1">SENHA ATUAL</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full rounded px-3 py-2 text-[#2c2c2c] border pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#646464] hover:text-[#7baa3d]"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-[#646464] mb-1">NOVA SENHA</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full rounded px-3 py-2 text-[#2c2c2c] border pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#646464] hover:text-[#7baa3d]"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}