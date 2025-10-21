import { Calculator, TrendingUp, Shield, Zap, ArrowRight, Users, Star, DollarSign, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const features = [
    {
      icon: Calculator,
      title: "Calculadora Inteligente",
      description: "Calcule preços considerando custos, impostos e margem de lucro automaticamente",
    },
    {
      icon: TrendingUp,
      title: "Dashboard Completo",
      description: "Acompanhe seus projetos, receitas e métricas em tempo real",
    },
    {
      icon: Shield,
      title: "Contratos Profissionais",
      description: "Gere contratos personalizados com todos os termos legais necessários",
    },
    {
      icon: Zap,
      title: "Gestão de Projetos",
      description: "Organize e gerencie todos os seus projetos freelance em um só lugar",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 glass-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                FreelaPro
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Funcionalidades
              </button>
              <button
                onClick={() => onNavigate("pricing")}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Preços
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Login
              </button>
              <Button 
                onClick={() => onNavigate("signup")}
              >
                Começar Grátis
              </Button>
            </nav>

            <Button 
              onClick={() => onNavigate("signup")} 
              className="md:hidden"
            >
              Começar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20 opacity-30"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tertiary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Coluna Esquerda - 60% */}
            <div className="lg:col-span-3 space-y-8 animate-fade-in relative z-10">
              <Badge className="glass-card text-primary border-primary/20 shadow-lg hover:shadow-primary/30 transition-shadow">
                <Sparkles className="w-3 h-3 mr-1" />
                Ferramenta #1 para Freelancers no Brasil
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Precifique seus projetos com{" "}
                <span className="gradient-text">
                  inteligência
                </span>{" "}
                e feche mais contratos
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Calcule valores justos em segundos, gere contratos profissionais e acompanhe todos os seus projetos em um só lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate("signup")}
                  size="lg"
                  className="text-lg px-8 py-7"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-7"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Ver Como Funciona
                </Button>
              </div>

              {/* Mini Estatísticas */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold">+2.500</span>
                  <span className="text-muted-foreground">freelancers</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-muted-foreground">avaliação</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">R$ 12M+</span>
                  <span className="text-muted-foreground">em projetos</span>
                </div>
              </div>
            </div>

            {/* Coluna Direita - 40% */}
            <div className="lg:col-span-2 relative animate-fade-in z-10" style={{ animationDelay: "200ms" }}>
              {/* Main Card - Mockup da Interface */}
              <Card className="gradient-border shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.4)] transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Nome do Projeto</span>
                      <Badge variant="secondary" className="text-xs glass-card">Website</Badge>
                    </div>
                    <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse"></div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Horas</span>
                        <div className="h-8 glass-card rounded flex items-center px-3">
                          <span className="text-sm font-semibold text-primary">40h</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Valor/Hora</span>
                        <div className="h-8 glass-card rounded flex items-center px-3">
                          <span className="text-sm font-semibold text-secondary">R$ 150</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Valor Final</span>
                        <Calculator className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold gradient-text">
                        R$ 8.280,00
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">R$ 207,00/hora efetiva</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Card - Exemplo de Cálculo */}
              <Card className="absolute -bottom-6 -left-6 w-48 gradient-border shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-scale-in" style={{ animationDelay: "400ms" }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold text-foreground">Lucro</span>
                  </div>
                  <p className="text-xl font-bold text-green-500">+45%</p>
                  <p className="text-xs text-muted-foreground">vs. média do mercado</p>
                </CardContent>
              </Card>

              {/* Decorative Circle */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>
        <div className="text-center mb-16 animate-fade-in relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Tudo que você precisa para profissionalizar seu trabalho
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ferramentas poderosas, simples de usar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {/* Feature 1 */}
          <Card
            className="hover:shadow-[0_8px_32px_rgba(99,102,241,0.3)] transition-all duration-300 group cursor-pointer animate-fade-in hover:scale-105"
            style={{ animationDelay: "0ms" }}
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                🧮 Calculadora Inteligente
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Calcule preços justos considerando todos os custos, impostos e margem de lucro
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card
            className="hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] transition-all duration-300 group cursor-pointer animate-fade-in hover:scale-105"
            style={{ animationDelay: "100ms" }}
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                📄 Contratos Profissionais
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Gere contratos personalizados em segundos, prontos para assinar
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card
            className="hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)] transition-all duration-300 group cursor-pointer animate-fade-in hover:scale-105"
            style={{ animationDelay: "200ms" }}
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                📊 Dashboard Completo
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize estatísticas, projetos aprovados e faturamento total
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card
            className="hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] transition-all duration-300 group cursor-pointer animate-fade-in hover:scale-105"
            style={{ animationDelay: "300ms" }}
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-600 to-tertiary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                💾 Histórico de Projetos
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Mantenha registro de todos os orçamentos e contratos gerados
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card
            className="hover:shadow-[0_8px_32px_rgba(249,115,22,0.3)] transition-all duration-300 group cursor-pointer animate-fade-in hover:scale-105"
            style={{ animationDelay: "400ms" }}
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                📱 Acesse de Qualquer Lugar
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Interface responsiva funciona perfeitamente em mobile e desktop
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card
            className="hover:shadow-[0_8px_32px_rgba(234,179,8,0.3)] transition-all duration-300 group cursor-pointer animate-fade-in hover:scale-105"
            style={{ animationDelay: "500ms" }}
          >
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                🔒 Dados Seguros
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Suas informações protegidas com criptografia e backup automático
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Freelancers de todo Brasil já confiam no FreelaPro
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Depoimento 1 */}
            <Card className="bg-white border-2 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                    AS
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Ana Silva</h4>
                    <p className="text-sm text-gray-600">Designer Gráfica</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "Antes eu cobrava no feeling e sempre tinha prejuízo. Agora consigo precificar com confiança e aumentei meu lucro em 40%!"
                </p>
              </CardContent>
            </Card>

            {/* Depoimento 2 */}
            <Card className="bg-white border-2 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                    CM
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Carlos Mendes</h4>
                    <p className="text-sm text-gray-600">Desenvolvedor Web</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "Os contratos profissionais me deram muito mais credibilidade com clientes. Fechei 3 projetos grandes no último mês!"
                </p>
              </CardContent>
            </Card>

            {/* Depoimento 3 */}
            <Card className="bg-white border-2 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                    MC
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Mariana Costa</h4>
                    <p className="text-sm text-gray-600">Redatora</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "Interface simples e intuitiva. Em 5 minutos já estava usando. Economizo horas toda semana!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Pronto para precificar melhor e faturar mais?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Junte-se a milhares de freelancers que já transformaram seus negócios
            </p>
            <Button
              onClick={() => onNavigate("signup")}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 shadow-2xl text-lg px-12 py-8 text-xl font-semibold hover:scale-105 transition-transform"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
            <div className="flex items-center justify-center gap-6 mt-8 text-white/90 text-sm">
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Sem cartão de crédito
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Cancele quando quiser
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo e Descrição */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">FreelaPro</span>
              </div>
              <p className="text-muted-foreground max-w-md mb-4">
                A plataforma completa para freelancers precificarem projetos, gerarem contratos e acompanharem seu crescimento.
              </p>
              <p className="text-sm text-muted-foreground/60">
                © 2024 FreelaPro. Feito por{" "}
                <a
                  href="https://www.r3d3s.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition-colors underline"
                >
                  R3D3
                </a>
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onNavigate("pricing")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Preços
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Privacidade
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Contato
                  </button>
                </li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div>
              <h4 className="text-white font-semibold mb-4">Siga-nos</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>Todos os direitos reservados. FreelaPro é uma plataforma para gestão de projetos freelance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
