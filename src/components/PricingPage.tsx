import { Calculator, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export const PricingPage = ({ onNavigate }: PricingPageProps) => {
  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "Até 5 projetos",
        "Calculadora de preços",
        "Geração de contratos",
        "Dashboard básico",
      ],
      cta: "Começar Grátis",
      popular: false,
    },
    {
      name: "Pro",
      price: "R$ 49",
      period: "/mês",
      description: "Para freelancers profissionais",
      features: [
        "Projetos ilimitados",
        "Todas as funcionalidades Free",
        "Relatórios avançados",
        "Exportação em PDF",
        "Suporte prioritário",
        "Múltiplos clientes",
      ],
      cta: "Começar Teste Grátis",
      popular: true,
    },
    {
      name: "Business",
      price: "R$ 99",
      period: "/mês",
      description: "Para agências e times",
      features: [
        "Tudo do plano Pro",
        "Múltiplos usuários",
        "API de integração",
        "White label",
        "Suporte dedicado",
        "Treinamento incluído",
      ],
      cta: "Falar com Vendas",
      popular: false,
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

            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("landing")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
              <Button onClick={() => onNavigate("login")} variant="outline">
                Entrar
              </Button>
              <Button onClick={() => onNavigate("signup")} className="bg-gradient-to-r from-primary to-secondary">
                Começar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
          Escolha o plano ideal para você
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comece grátis e faça upgrade quando quiser. Sem pegadinhas.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-2 hover:shadow-2xl transition-all duration-300 animate-fade-in ${
                plan.popular ? "border-primary shadow-xl scale-105" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white">
                  Mais Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => onNavigate("signup")}
                  className={`w-full py-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Tem dúvidas? Estamos aqui para ajudar.
          </p>
          <Button variant="outline" size="lg">
            Falar com nosso time
          </Button>
        </div>
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
