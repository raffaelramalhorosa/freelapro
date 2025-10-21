import { Calculator, Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useSubscription, STRIPE_PRICES } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export const PricingPage = ({ onNavigate }: PricingPageProps) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { createCheckout, isLoading, plan } = useSubscription();
  const { toast } = useToast();

  const plans = [
    {
      name: "Free",
      priceMonthly: "R$ 0",
      priceAnnual: "R$ 0",
      period: "/mês",
      description: "Começar",
      badge: "Começar",
      features: [
        { text: "5 projetos por mês", included: true },
        { text: "Calculadora completa", included: true },
        { text: "Contratos básicos", included: true },
        { text: "Histórico de 30 dias", included: true },
        { text: "Dashboard avançado", included: false },
        { text: "Múltiplos impostos", included: false },
        { text: "Suporte prioritário", included: false },
      ],
      cta: "Começar Grátis",
      popular: false,
      buttonVariant: "outline" as const,
    },
    {
      name: "Pro",
      priceMonthly: "R$ 10",
      priceAnnual: "R$ 100",
      period: isAnnual ? "/ano" : "/mês",
      description: "Recomendado",
      badge: "Mais Popular",
      features: [
        { text: "Projetos ilimitados", included: true },
        { text: "Todos os recursos Free", included: true },
        { text: "Dashboard completo", included: true },
        { text: "Múltiplos regimes tributários", included: true },
        { text: "Histórico ilimitado", included: true },
        { text: "Exportar relatórios PDF", included: true },
        { text: "Suporte por email", included: true },
      ],
      cta: "Começar Teste Grátis",
      subtitle: "7 dias grátis, cancele quando quiser",
      popular: true,
      buttonVariant: "default" as const,
    },
    {
      name: "Business",
      priceMonthly: "R$ 22",
      priceAnnual: "R$ 220",
      period: isAnnual ? "/ano" : "/mês",
      description: "Empresas",
      badge: "Empresas",
      features: [
        { text: "Tudo do Pro", included: true },
        { text: "Múltiplos usuários (até 5)", included: true },
        { text: "White-label nos contratos", included: true },
        { text: "Integrações (Trello, Notion)", included: true },
        { text: "API de acesso", included: true },
        { text: "Suporte prioritário", included: true },
        { text: "Gerente de conta", included: true },
      ],
      cta: "Falar com Vendas",
      popular: false,
      buttonVariant: "secondary" as const,
    },
  ];

  const handleSubscribe = async (planName: string) => {
    if (planName === "Free") {
      onNavigate("signup");
      return;
    }

    let priceId = "";
    if (planName === "Pro") {
      priceId = isAnnual ? STRIPE_PRICES.pro_annual : STRIPE_PRICES.pro_monthly;
    } else if (planName === "Business") {
      priceId = isAnnual ? STRIPE_PRICES.business_annual : STRIPE_PRICES.business_monthly;
    }

    if (priceId) {
      await createCheckout(priceId);
      toast({
        title: "Redirecionando para pagamento",
        description: "Você será redirecionado para o Stripe em uma nova aba.",
      });
    }
  };

  const faqs = [
    {
      question: "Posso mudar de plano?",
      answer: "Sim, a qualquer momento",
    },
    {
      question: "Preciso de cartão para testar?",
      answer: "Não, período grátis sem cartão",
    },
    {
      question: "Como funciona o pagamento?",
      answer: "PIX, cartão ou boleto",
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
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Comece grátis, faça upgrade quando precisar
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span
            className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Mensal
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors hover:bg-muted/80"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                isAnnual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Anual
          </span>
          {isAnnual && <Badge className="bg-green-500 text-white">20% off</Badge>}
        </div>
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
                  {plan.badge}
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                {!plan.popular && (
                  <Badge variant="outline" className="w-fit mx-auto mb-2">
                    {plan.badge}
                  </Badge>
                )}
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  variant={plan.buttonVariant}
                  disabled={isLoading}
                  className={`w-full py-6 ${
                    plan.popular ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" : ""
                  }`}
                >
                  {isLoading ? "Processando..." : plan.cta}
                </Button>
                {plan.subtitle && <p className="text-xs text-muted-foreground text-center mt-3">{plan.subtitle}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Tem dúvidas? Estamos aqui para ajudar.</p>
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
