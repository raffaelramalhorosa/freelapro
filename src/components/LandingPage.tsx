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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FreelaPro
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Funcionalidades
              </button>
              <button
                onClick={() => onNavigate("pricing")}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Preços
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Login
              </button>
              <Button 
                onClick={() => onNavigate("signup")} 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
              >
                Começar Grátis
              </Button>
            </nav>

            <Button 
              onClick={() => onNavigate("signup")} 
              className="md:hidden bg-gradient-to-r from-primary to-secondary"
            >
              Começar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Coluna Esquerda - 60% */}
            <div className="lg:col-span-3 space-y-8 animate-fade-in">
              <Badge className="bg-white/90 text-primary border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                <Sparkles className="w-3 h-3 mr-1" />
                Ferramenta #1 para Freelancers no Brasil
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Precifique seus projetos com{" "}
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  inteligência
                </span>{" "}
                e feche mais contratos
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Calcule valores justos em segundos, gere contratos profissionais e acompanhe todos os seus projetos em um só lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate("signup")}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-7"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-7 border-2 hover:bg-gray-50"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Ver Como Funciona
                </Button>
              </div>

              {/* Mini Estatísticas */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold">+2.500</span>
                  <span className="text-gray-600">freelancers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-gray-600">avaliação</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">R$ 12M+</span>
                  <span className="text-gray-600">em projetos</span>
                </div>
              </div>
            </div>

            {/* Coluna Direita - 40% */}
            <div className="lg:col-span-2 relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              {/* Main Card - Mockup da Interface */}
              <Card className="border-2 shadow-2xl bg-white/95 backdrop-blur-sm hover:shadow-3xl transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Nome do Projeto</span>
                      <Badge variant="secondary" className="text-xs">Website</Badge>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500">Horas</span>
                        <div className="h-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded flex items-center px-3">
                          <span className="text-sm font-semibold text-primary">40h</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500">Valor/Hora</span>
                        <div className="h-8 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded flex items-center px-3">
                          <span className="text-sm font-semibold text-secondary">R$ 150</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Valor Final</span>
                        <Calculator className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        R$ 8.280,00
                      </div>
                      <p className="text-xs text-gray-500 mt-1">R$ 207,00/hora efetiva</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Card - Exemplo de Cálculo */}
              <Card className="absolute -bottom-6 -left-6 w-48 border-2 shadow-xl bg-white animate-scale-in" style={{ animationDelay: "400ms" }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-gray-700">Lucro</span>
                  </div>
                  <p className="text-xl font-bold text-green-600">+45%</p>
                  <p className="text-xs text-gray-500">vs. média do mercado</p>
                </CardContent>
              </Card>

              {/* Decorative Circle */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Tudo que você precisa para crescer
          </h2>
          <p className="text-lg text-muted-foreground">
            Ferramentas profissionais para freelancers que querem crescer
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <Card className="bg-gradient-to-r from-primary to-secondary border-0 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para profissionalizar seu negócio?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de freelancers que já estão economizando tempo e ganhando mais.
            </p>
            <Button
              onClick={() => onNavigate("signup")}
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            >
              Começar Agora - É Grátis
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 FreelaPro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
