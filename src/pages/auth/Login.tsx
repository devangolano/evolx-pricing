"use client"

import type React from "react"

import { useState } from "react"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log({ email, password, rememberMe })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#202224] p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="EVOLX pricing" className="h-[90px] w-[200px]" />
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#333333]">Entrar na conta</h1>
            <p className="mt-2 text-sm text-[#656565]">Por favor, insira seu email e sua senha</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[#333333]">
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu-email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-[#f1f4f9] px-3 py-2 text-[#333333] outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[#333333]">
                  Password
                </label>
                <a href="#" className="text-sm text-[#656565] hover:underline">
                  Forget Password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-[#f1f4f9] px-3 py-2 text-[#333333] outline-none"
                placeholder="sua senha"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
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

            <button
              type="submit"
              className="w-full rounded-md bg-[#8cc63f] py-3 text-white font-medium hover:bg-[#7db536] transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default App

