<div align="center">
  <img src="https://img.shields.io/badge/FreelaPro-v1.0.0-purple?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</div>

<h1 align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/calculator.svg" width="100" height="100" alt="FreelaPro Logo">
  <br>
  FreelaPro
</h1>

<p align="center">
  <strong>Precificação & Contratos Inteligentes para Freelancers</strong>
  <br>
  Calcule valores justos, gere contratos profissionais e crie páginas de proposta impactantes
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-uso">Uso</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-contribuindo">Contribuindo</a> •
  <a href="#-licença">Licença</a>
</p>

---

## 📋 Sobre o Projeto

**FreelaPro** é uma plataforma completa para freelancers gerenciarem seus projetos, calcularem preços de forma inteligente e criarem propostas comerciais profissionais. Desenvolvido com React e Supabase, oferece uma experiência moderna, rápida e intuitiva.

### 🎯 Problema Resolvido

Freelancers frequentemente:
- ❌ Precificam projetos de forma incorreta (no "feeling")
- ❌ Esquecem de considerar impostos e custos operacionais
- ❌ Enviam propostas amadoras em PDFs estáticos
- ❌ Perdem projetos por falta de profissionalismo

### ✅ Solução

- ✅ Calculadora inteligente que considera TODOS os custos
- ✅ Geração automática de contratos personalizáveis
- ✅ Páginas de proposta web interativas e profissionais
- ✅ Gestão completa de projetos e histórico

---

## 🚀 Funcionalidades

### 💰 Calculadora de Precificação
- **Cálculo Inteligente**: Considera horas, custos fixos, variáveis, impostos e margem de lucro
- **Múltiplos Regimes Tributários**: MEI, Simples Nacional e Lucro Presumido
- **Margem de Lucro Ajustável**: Slider de 0% a 100%
- **Breakdown Completo**: Visualização detalhada de todos os componentes do preço

### 📄 Gerador de Contratos
- **Templates Prontos**: Contratos para diferentes tipos de serviço
- **Personalização Automática**: Preenche com dados do projeto
- **Exportação em TXT**: Download instantâneo
- **Cláusulas Editáveis**: Adapte conforme necessário

### 🌐 Páginas de Proposta
- **Design Profissional**: Layout moderno e responsivo
- **Gráficos Interativos**: Visualização da distribuição de investimento
- **Timeline de Fases**: Cronograma visual do projeto
- **Compartilhamento Simples**: Link único para cada proposta
- **Sem Login Necessário**: Cliente visualiza sem cadastro

### 📊 Dashboard Completo
- **Estatísticas em Tempo Real**: Total de projetos, aprovados, concluídos
- **Valor Total Faturado**: Acompanhe seu crescimento
- **Histórico Completo**: Todos os projetos em um só lugar
- **Filtros e Busca**: Encontre projetos rapidamente

### 🎨 Gestão de Projetos
- **CRUD Completo**: Criar, visualizar, editar e excluir projetos
- **Status Personalizados**: Pendente, Aprovado, Rejeitado, Concluído
- **Histórico Ilimitado** (Pro/Business): Acesse projetos antigos
- **Exportação de Dados**: Relatórios em PDF (Pro/Business)

---

## 🛠️ Tecnologias

### Frontend
- **[React 18](https://react.dev/)** - Biblioteca JavaScript para interfaces
- **[Vite](https://vitejs.dev/)** - Build tool ultrarrápido
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React](https://lucide.dev/)** - Ícones modernos

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

### Bibliotecas Auxiliares
- **date-fns** - Manipulação de datas
- **React Router** (sistema customizado) - Navegação

### DevOps & Deploy
- **[Lovable.ai](https://lovable.dev/)** - Plataforma de desenvolvimento
- **Vercel / Netlify** - Hospedagem e CI/CD

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/freelapro.git
cd freelapro
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 4. Configure o banco de dados

Execute o SQL no Supabase SQL Editor:
```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de projetos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  hours_estimated DECIMAL(10,2) NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  fixed_costs DECIMAL(10,2) DEFAULT 0,
  variable_costs DECIMAL(10,2) DEFAULT 0,
  tax_type TEXT NOT NULL,
  profit_margin INTEGER NOT NULL,
  calculated_results JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de propostas
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  project_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  summary TEXT,
  total_budget DECIMAL(10,2) NOT NULL,
  phases JSONB DEFAULT '[]'::jsonb,
  fixed_costs JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de contratos
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  contract_text TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (exemplo para projects)
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:5173`

---

## 🎯 Uso

### 1. Criar Conta

Acesse a página de cadastro e crie uma conta gratuita. Todas as contas começam no plano **Free**.

### 2. Calcular Preço de Projeto

1. Vá para a aba **Calculadora**
2. Preencha os dados do projeto:
   - Nome do cliente
   - Nome do projeto
   - Horas estimadas
   - Valor/hora desejado
3. Configure custos e impostos
4. Ajuste a margem de lucro
5. Clique em **Calcular Preço**

### 3. Salvar Projeto

Após calcular, clique em **Salvar Projeto** para adicionar ao histórico.

### 4. Gerar Contrato

Na lista de projetos, clique em **Contrato** para gerar e baixar um contrato personalizado.

### 5. Criar Página de Proposta

1. Na lista de projetos, clique em **Criar Página**
2. Configure:
   - Informações básicas
   - Fases do projeto
   - Custos fixos
   - Benefícios esperados
3. Clique em **Gerar Página de Proposta**
4. Compartilhe o link com seu cliente

---

## 📁 Estrutura do Projeto
```
freelapro/
├── src/
│   ├── components/           # Componentes React
│   │   ├── Calculator/       # Calculadora de preços
│   │   ├── Projects/         # Gestão de projetos
│   │   ├── Dashboard/        # Dashboard e estatísticas
│   │   ├── Proposals/        # Páginas de proposta
│   │   └── ui/               # Componentes UI reutilizáveis
│   │
│   ├── contexts/             # Contexts (Auth, etc)
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/                # Custom Hooks
│   │   ├── useCache.js       # Sistema de cache
│   │   └── useAuth.js
│   │
│   ├── lib/                  # Bibliotecas e configs
│   │   └── supabase.js       # Cliente Supabase
│   │
│   ├── pages/                # Páginas principais
│   │   ├── Landing.jsx       # Landing page
│   │   ├── Login.jsx         # Autenticação
│   │   ├── Signup.jsx        # Cadastro
│   │   ├── App.jsx           # Aplicação principal
│   │   └── ProposalView.jsx  # Visualização pública
│   │
│   ├── utils/                # Funções utilitárias
│   │   ├── formatters.js     # Formatação de dados
│   │   └── validators.js     # Validações
│   │
│   ├── App.jsx               # Componente raiz
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globais
│
├── public/                   # Assets estáticos
├── .env.example              # Exemplo de variáveis
├── tailwind.config.js        # Config do Tailwind
├── vite.config.js            # Config do Vite
├── package.json
└── README.md
```

---

## 🎨 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Landing+Page)

### Calculadora de Preços
![Calculadora](https://via.placeholder.com/800x400/A855F7/FFFFFF?text=Calculadora)

### Lista de Projetos
![Projetos](https://via.placeholder.com/800x400/EC4899/FFFFFF?text=Projetos)

### Página de Proposta
![Proposta](https://via.placeholder.com/800x400/6366F1/FFFFFF?text=Proposta)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Dashboard)

---

## 💎 Planos

### 🆓 Free
- 5 projetos por mês
- Calculadora completa
- Contratos básicos
- Páginas de proposta
- Histórico de 30 dias

### 👑 Pro - R$ 29/mês
- Projetos ilimitados
- Dashboard completo
- Histórico ilimitado
- Exportação em PDF
- Múltiplos regimes tributários
- Suporte por email

### 🚀 Business - R$ 79/mês
- Tudo do Pro
- Até 5 usuários
- White-label
- Integrações via API
- Suporte prioritário
- Gerente de conta

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### 📋 Guidelines

- Siga os padrões de código do projeto
- Escreva mensagens de commit claras
- Adicione testes quando possível
- Atualize a documentação se necessário

---

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/raffaelramalhorosa/freelapro/issues) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (navegador, OS, etc)

---

## 🗺️ Roadmap

- [ ] Integração com Stripe para pagamentos
- [ ] App mobile (React Native)
- [ ] Exportação de propostas em PDF
- [ ] Integração com calendários (Google, Outlook)
- [ ] Sistema de notificações
- [ ] Multi-idioma (EN, ES)
- [ ] Modo offline
- [ ] Assinatura digital de contratos
- [ ] Integrações com CRMs
- [ ] Relatórios avançados

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Rafael Ramalho Rosa**

- GitHub: [@raffael.ramalho](https://github.com/raffaelramalhorosa)
- LinkedIn: [Rafael Ramalho](https://www.linkedin.com/in/raffaelramalhorosa/)
- Email: raffael.ramalho.rosa@email.com

---

## 🙏 Agradecimentos

- [Lovable.ai](https://lovable.dev/) - Plataforma de desenvolvimento
- [Supabase](https://supabase.com/) - Backend e banco de dados
- [Lucide](https://lucide.dev/) - Biblioteca de ícones
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- Comunidade open source ❤️

---

<div align="center">
  <p>Feito com ❤️ e ☕ por freelancers, para freelancers</p>
  
  <p>
    <a href="#-sobre-o-projeto">Voltar ao topo ⬆️</a>
  </p>

  ⭐ Se este projeto te ajudou, considere dar uma estrela!
</div>
