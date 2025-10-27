📊 FreelaPro - Precificação & Contratos Inteligentes
<div align="center">
Mostrar Imagem
A ferramenta #1 para freelancers precificarem projetos e gerarem contratos profissionais

Demo ao Vivo • Reportar Bug • Solicitar Feature
</div>

📋 Índice

Sobre o Projeto
Funcionalidades
Demo & Screenshots
Tecnologias
Pré-requisitos
Instalação
Configuração
Uso
Estrutura do Projeto
Roadmap
Contribuindo
Licença
Contato


🎯 Sobre o Projeto
FreelaPro é uma plataforma SaaS completa desenvolvida para freelancers brasileiros que precisam precificar projetos de forma profissional, considerando todos os custos, impostos e margem de lucro. Além da calculadora inteligente, o sistema gera contratos personalizados e cria páginas de proposta comercial interativas para impressionar clientes.
💡 Por que FreelaPro?

Precificação Justa: Calcule valores considerando horas de trabalho, custos fixos/variáveis, impostos (MEI, Simples, PJ) e margem de lucro desejada
Profissionalização: Gere contratos profissionais em segundos com templates personalizáveis
Impressione Clientes: Crie páginas de proposta web modernas com gráficos interativos e timeline de entregas
Gestão Completa: Acompanhe todos os projetos, orçamentos e propostas em um dashboard centralizado
Performance: Sistema otimizado com cache inteligente, lazy loading e animações GPU-accelerated


✨ Funcionalidades
🧮 Calculadora Inteligente

✅ Cálculo automático de preços baseado em horas, custos e margem
✅ Suporte a 3 regimes tributários (MEI, Simples Nacional, Lucro Presumido)
✅ Detalhamento completo de composição do valor
✅ Comparação de cenários
✅ Cálculo de valor/hora efetivo

📄 Geração de Contratos

✅ Templates profissionais personalizáveis
✅ Preenchimento automático com dados do projeto
✅ Cláusulas editáveis
✅ Download em TXT/PDF
✅ Histórico de contratos gerados

🌐 Páginas de Proposta

✅ Criação de páginas web profissionais para enviar ao cliente
✅ Gráficos interativos de distribuição de investimento
✅ Timeline visual de fases do projeto
✅ Detalhamento de custos e benefícios
✅ Link compartilhável (sem necessidade de login do cliente)
✅ Contador de visualizações
✅ Design responsivo e moderno

📊 Dashboard Completo

✅ Visão geral de projetos (total, aprovados, concluídos)
✅ Valor total faturado
✅ Histórico de orçamentos
✅ Filtros e busca avançada

🔐 Autenticação & Planos

✅ Cadastro/Login com email e senha
✅ Login social (Google, GitHub)
✅ Plano Free: 5 projetos/mês
✅ Plano Pro: Projetos ilimitados + recursos avançados
✅ Plano Business: Multi-usuários + white-label

⚡ Performance & UX

✅ Cache inteligente que elimina requisições repetidas
✅ Lazy loading de componentes
✅ Animações otimizadas (GPU-accelerated)
✅ Debounce em inputs para cálculos em tempo real
✅ Skeleton loaders
✅ Toast notifications
✅ Dark mode nativo


🖼️ Demo & Screenshots
Landing Page
Mostrar Imagem
Calculadora de Precificação
Mostrar Imagem
Página de Proposta
Mostrar Imagem
Dashboard
Mostrar Imagem

🛠️ Tecnologias
Frontend

React 18 - Biblioteca UI
Vite - Build tool e dev server
Tailwind CSS - Framework CSS utility-first
Lucide React - Ícones
Date-fns - Manipulação de datas

Backend & Database

Supabase - Backend as a Service

PostgreSQL database
Authentication
Row Level Security (RLS)
Real-time subscriptions



Hospedagem & Deploy

Vercel / Netlify - Hospedagem frontend
Supabase Cloud - Hospedagem do banco de dados

Ferramentas de Desenvolvimento

ESLint - Linting
Prettier - Formatação de código
Git - Controle de versão


📦 Pré-requisitos
Antes de começar, certifique-se de ter instalado:

Node.js (versão 16.x ou superior)
npm ou yarn
Git
Conta no Supabase (gratuita)


🚀 Instalação
1. Clone o repositório
bashgit clone https://github.com/seu-usuario/freelapro.git
cd freelapro
2. Instale as dependências
bashnpm install
# ou
yarn install
3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto:
envVITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

💡 Dica: Copie o arquivo .env.example e renomeie para .env

4. Configure o banco de dados
Execute os scripts SQL fornecidos em /database/schema.sql no Supabase SQL Editor:
sql-- Criar tabelas
-- Ver arquivo completo em /database/schema.sql
5. Inicie o servidor de desenvolvimento
bashnpm run dev
# ou
yarn dev
Acesse http://localhost:5173 no navegador.

⚙️ Configuração
Supabase Setup

Crie um projeto no Supabase

Acesse supabase.com
Clique em "New Project"
Anote a URL e a chave anônima


Execute o schema SQL

Vá em SQL Editor no painel do Supabase
Cole e execute o conteúdo de /database/schema.sql


Configure Row Level Security (RLS)

As políticas RLS já estão incluídas no schema
Verifique em Authentication > Policies


Configure Authentication Providers (opcional)

Para login social, configure Google/GitHub em Authentication > Providers



Customização
Alterar cores do tema
Edite o arquivo tailwind.config.js:
javascriptmodule.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',   // Roxo principal
        secondary: '#A855F7', // Roxo secundário
        accent: '#EC4899',    // Rosa
      }
    }
  }
}
Ajustar cache duration
Edite hooks/useCache.js:
javascriptconst CACHE_DURATION = 5 * 60 * 1000; // 5 minutos (padrão)
```

---

## 📖 Uso

### Criando seu primeiro projeto

1. **Cadastre-se** na plataforma
2. Vá para **Calculadora**
3. Preencha os dados:
   - Nome do cliente
   - Nome do projeto
   - Horas estimadas
   - Valor/hora desejado
   - Custos fixos e variáveis
   - Regime tributário
   - Margem de lucro
4. Clique em **Calcular Preço**
5. Revise os resultados e clique em **Salvar Projeto**

### Gerando uma proposta comercial

1. Na aba **Projetos**, encontre seu projeto
2. Clique em **Criar Página de Proposta**
3. Configure:
   - Informações gerais
   - Fases do projeto
   - Custos fixos
   - Benefícios esperados
4. Clique em **Gerar Proposta**
5. Copie o link e envie para seu cliente

### Exportando um contrato

1. Na lista de projetos, clique em **Contrato**
2. O contrato será gerado automaticamente
3. Revise e faça download

---

## 📁 Estrutura do Projeto
```
freelapro/
├── public/              # Arquivos públicos estáticos
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── Calculator/  # Componentes da calculadora
│   │   ├── Dashboard/   # Componentes do dashboard
│   │   ├── Modals/      # Modais da aplicação
│   │   └── UI/          # Componentes de UI genéricos
│   ├── contexts/        # React Context (Auth, Theme)
│   ├── hooks/           # Custom hooks (useCache, useAuth)
│   ├── lib/             # Configurações (Supabase)
│   ├── pages/           # Páginas da aplicação
│   │   ├── Landing.jsx  # Landing page
│   │   ├── Login.jsx    # Página de login
│   │   ├── Signup.jsx   # Página de cadastro
│   │   ├── App.jsx      # App principal (logado)
│   │   └── ProposalView.jsx # Visualização pública de proposta
│   ├── utils/           # Funções auxiliares
│   ├── App.jsx          # Componente raiz
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globais
├── database/
│   └── schema.sql       # Schema do banco de dados
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json
├── tailwind.config.js   # Configuração do Tailwind
├── vite.config.js       # Configuração do Vite
└── README.md
```

---

## 🗺️ Roadmap

### Em Desenvolvimento
- [ ] Exportação de contratos em PDF
- [ ] Integração com Stripe para pagamentos
- [ ] Integração com WhatsApp para envio de propostas
- [ ] Templates de proposta customizáveis
- [ ] Multi-idiomas (EN, ES)

### Planejado
- [ ] App mobile (React Native)
- [ ] Integrações com Trello/Notion/Asana
- [ ] Relatórios avançados e analytics
- [ ] API pública para integrações
- [ ] Sistema de time/colaboradores
- [ ] White-label completo

### Concluído ✅
- [x] Calculadora de precificação
- [x] Geração de contratos
- [x] Páginas de proposta
- [x] Dashboard completo
- [x] Sistema de autenticação
- [x] Planos Free/Pro/Business
- [x] Cache inteligente
- [x] Dark mode
- [x] Responsividade completa

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

### Como contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Diretrizes

- Siga o padrão de código existente
- Escreva commits descritivos
- Adicione testes quando possível
- Atualize a documentação se necessário
- Seja respeitoso nos comentários e reviews

### Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/freelapro/issues) incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshots (se aplicável)
- Ambiente (browser, OS, versão)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
```
MIT License

Copyright (c) 2024 FreelaPro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

📞 Contato
Rafael Ramalho Rosa

Email: rafael.ramalho.rosa@gmail.com
LinkedIn: linkedin.com/in/seu-perfil
Portfolio: seuportfolio.com

Link do Projeto: https://github.com/seu-usuario/freelapro

🙏 Agradecimentos

React - Biblioteca incrível
Supabase - Backend simplificado
Tailwind CSS - Estilização rápida
Lucide - Ícones lindos
Lovable.dev - Plataforma de desenvolvimento
Comunidade open source 💜


<div align="center">
Feito com 💜 por freelancers, para freelancers
⭐ Se este projeto te ajudou, considere dar uma estrela!
Mostrar Imagem
</div>Tentar novamenteClaude ainda não tem a capacidade de executar o código que gera.
