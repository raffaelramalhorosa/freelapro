import { Calculator, TrendingUp, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">FreelaPro</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate("pricing")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Planos
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Entrar
              </button>
              <Button onClick={() => onNavigate("signup")} className="bg-gradient-to-r from-primary to-secondary">
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
      <section className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Gerencie seu negócio freelance com{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              inteligência
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Calcule preços justos, gere contratos profissionais e acompanhe seus projetos em uma plataforma completa para freelancers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("signup")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6"
            >
              Começar Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => onNavigate("pricing")}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              Ver Planos
            </Button>
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
