"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User2, Lock, Building2, Loader2 } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { notify } from "../../config/toast"; // Add this import

const api = axios.create({
  baseURL: "https://ovolx-api-1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
})

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

function App() {
  const navigate = useNavigate()
  const [cpf, setCpf] = useState("")
  const [institution, setInstitution] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPrefectureLoading, setIsPrefectureLoading] = useState(false)
  const [error, setError] = useState("")
  const [prefectures, setPrefectures] = useState<{ id: string; prefecture: string }[]>([])

  const fetchUserPrefecture = async (document: string) => {
    setIsPrefectureLoading(true)
    try {
      const cleanDocument = document.replace(/\D/g, "")
      const response = await api.post("/auth/login", {
        document: cleanDocument,
      })

      if (response.data && response.data.prefecture) {
        setPrefectures([{
          id: response.data.id,
          prefecture: response.data.prefecture,
        }])
        setInstitution(response.data.prefecture)
        setError("")
      } else {
        notify.error("Usuário não encontrado")
        setPrefectures([])
        setInstitution("")
      }
    } catch (err: any) {
      notify.error(err.response?.data?.error || "Usuário não encontrado")
      setPrefectures([])
      setInstitution("")
    } finally {
      setIsPrefectureLoading(false)
    }
  }

  const handleCpfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCpfCnpj(e.target.value)
    setCpf(formattedCpf)
    setError("") // Limpa erros anteriores

    // Only fetch prefecture if CPF/CNPJ is complete
    if (formattedCpf.replace(/\D/g, "").length === 11 || formattedCpf.replace(/\D/g, "").length === 14) {
      await fetchUserPrefecture(formattedCpf)
    } else {
      setPrefectures([])
      setInstitution("")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token'); // Changed from env variable
    const user = localStorage.getItem('user');
    if (token && user) {
      navigate('/inicio');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const cleanDocument = cpf.replace(/\D/g, '');
      const response = await api.post('/auth/login', {
        document: cleanDocument,
        prefecture: institution,
        password,
      });
  
      const { token, user } = response.data;
      
      // Store token without env variable
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      if (rememberMe) {
        localStorage.setItem('remember_user', cpf);
      } else {
        localStorage.removeItem('remember_user');
      }
  
      notify.success("Login realizado com sucesso!");
      navigate('/inicio', { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao fazer login. Tente novamente.";
      notify.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#202224] p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="EVOLX pricing" className="h-[90px] w-[200px]" />
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#333333]">Entrar na conta</h1>
            <p className="mt-2 text-sm text-[#656565]">Por favor, insira seus dados de acesso</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

            <div className="space-y-2">
              <label htmlFor="cpf" className="block text-[#333333]">
                Usuário
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656565]">
                  <User2 size={18} />
                </span>
                <input
                  id="cpf"
                  type="text"
                  placeholder="CPF / CNPJ"
                  value={cpf}
                  onChange={handleCpfChange}
                  className="w-full rounded-md bg-[#f1f4f9] pl-10 pr-3 py-2 text-[#333333] outline-none"
                  maxLength={18}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="institution" className="block text-[#333333]">
                Instituição
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656565]">
                  {isPrefectureLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Building2 size={18} />
                  )}
                </span>
                <select
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full rounded-md bg-[#f1f4f9] pl-10 pr-3 py-2 text-[#333333] outline-none appearance-none"
                  required
                  disabled={prefectures.length === 1 || isPrefectureLoading}
                >
                  <option value="">
                    {isPrefectureLoading ? "Carregando..." : "Selecione uma instituição"}
                  </option>
                  {!isPrefectureLoading && prefectures.map((pref) => (
                    <option key={pref.id} value={pref.prefecture}>
                     <span>Pref -</span> {pref.prefecture}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[#333333]">
                Senha
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656565]">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md bg-[#f1f4f9] pl-10 pr-3 py-2 text-[#333333] outline-none"
                  required
                />
              </div>
              <div className="flex pt-3 items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#979797] accent-[#8cc63f]"
                />
                <label htmlFor="remember" className="text-sm font-medium text-[#656565]">
                  Lembrar minha senha
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-[#8cc63f] py-3 text-white font-medium hover:bg-[#7db536] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default App

