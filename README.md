# USVI Luxury 🏝️

Plataforma premium de imóveis, villas, hotéis e aluguer de carros de luxo nas Ilhas Virgens Americanas.

---

## 🚀 Engineering Standard: B.L.A.S.T. & A.N.T.
Este projeto é operado pelo **System Pilot** sob o protocolo **B.L.A.S.T.** (Blueprint, Link, Architect, Stylize, Trigger) e arquitetura de 3 camadas **A.N.T.** Ver detalhes em [PROTOCOLS.md](./PROTOCOLS.md).

---

## ✅ Quick Start (Local)

```bash
npm install
npm run dev
```

A aplicação estará disponível em http://localhost:5173 por omissão.

---

## 🧰 Preparar para GitHub

1. Inicia o repositório Git (se ainda não estiver iniciado):

```bash
git init -b main
```

2. Faz o primeiro commit:

```bash
git add .
git commit -m "chore: inicial commit"
```

3. Cria o repo no GitHub e adiciona o remote:

```bash
git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
git push -u origin main
```

> 🔧 Substitui `<seu-usuario>` e `<seu-repo>` pelos teus valores.

---

## 🚀 Deploy no Vercel

### Requisitos
- Conta no [vercel.com](https://vercel.com)
- Repositório GitHub com o código

### Passos
1. Faz push para o GitHub (ver secção anterior).
2. No Vercel, selecciona "New Project" e escolhe o repo.
3. Configura:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy! 🎉

---

## 📦 Funcionalidades (Resumo)

### Vista Pública
- Hero banner paradisíaco com gradiente de luxo
- Listings de Villas (€5k–€20k/semana), Imóveis ($2M–$8M), Hotéis e Carros
- Sistema de reservas com confirmação automática
- Filtros por categoria, preço e disponibilidade

### Painel Admin (/admin)
- Dashboard com métricas de receita
- Gestão de listings e reservas
- **AmbassadorOS** — recrutamento automático de embaixadores
  - Buscador com scoring automático
  - Pipeline Kanban
  - Calculadora de ganhos

---

## 🛠️ Próximos passos para produção
- Backend (Node.js/Next.js) + base de dados (PostgreSQL/Supabase)
- Integração Stripe para pagamentos reais
- Sistema de autenticação (Clerk/Auth0)
- Painel de admin protegido por password
