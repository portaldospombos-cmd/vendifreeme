import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
// 1. Importa o ClerkProvider
import { ClerkProvider } from "@clerk/clerk-react";

// 2. Puxa a chave da Vercel (Vite)
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// 3. Verifica se a chave existe (evita que o site fique em branco se esqueceres da Vercel)
if (!PUBLISHABLE_KEY) {
  console.error("Erro: VITE_CLERK_PUBLISHABLE_KEY não encontrada nas variáveis de ambiente.");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 4. Substitui o AuthProvider pelo ClerkProvider */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
