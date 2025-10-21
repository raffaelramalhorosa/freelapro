import { Calculator, Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RippleButton } from "@/components/ui/ripple-button";
import { useState } from "react";
import { useSubscription, STRIPE_PRICES } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export const PricingPage = ({ onNavigate }: PricingPageProps) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [priceKey, setPriceKey] = useState(0);
  const { createCheckout, isLoading, plan } = useSubscription();
  const { toast } = useToast();
  
  const handleToggle = () => {
    setIsAnnual(!isAnnual);
    setPriceKey(prev => prev + 1); // Force price animation
  };

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 glass-card sticky top-0 z-50">
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
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-glow animate-fade-up">
          Escolha o plano ideal para você
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
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
            onClick={handleToggle}
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-card/80 backdrop-blur-sm border border-white/10 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
                isAnnual ? "translate-x-8 scale-110" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Anual
          </span>
          {isAnnual && <Badge className="bg-green-500 text-white badge-glow">20% off</Badge>}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative ${plan.popular ? "scale-105" : ""}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient glow - mais intenso para popular */}
              <div className={`absolute inset-0 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-2xl blur-xl ${plan.popular ? "opacity-40" : "opacity-15"} group-hover:opacity-50 transition duration-500`}></div>
              
              {/* Card principal com glassmorphism */}
              <div className={`relative bg-[#13131A]/90 backdrop-blur-xl border rounded-2xl p-8 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.popular ? "border-primary/50 shadow-[0_8px_40px_rgba(99,102,241,0.4)]" : "border-white/10"}`}>
                
                {/* Badge "Mais Popular" com neon glow */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 badge-glow">
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 text-sm font-semibold shadow-lg">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                {!plan.popular && (
                  <Badge variant="outline" className="w-fit mb-4 border-white/20 text-gray-300">
                    {plan.badge}
                  </Badge>
                )}
                
                {/* Nome do plano */}
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 mt-2">
                  {plan.name}
                </h3>
                
                {/* Preço com texto enorme e gradient */}
                <div key={priceKey} className="mt-6 mb-8 animate-bounce-in">
                  <span className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent shimmer">
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                
                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-gray-200" : "text-gray-600"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* Botão com efeito holográfico */}
                <RippleButton
                  onClick={() => handleSubscribe(plan.name)}
                  variant={plan.buttonVariant}
                  disabled={isLoading}
                  className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? "neon-button shadow-[0_0_30px_rgba(99,102,241,0.5)]" 
                      : "bg-white/10 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  {isLoading ? "Processando..." : plan.cta}
                </RippleButton>
                
                {plan.subtitle && (
                  <p className="text-xs text-gray-400 text-center mt-3">{plan.subtitle}</p>
                )}
                
                {/* Linha decorativa animada no bottom */}
                {plan.popular && (
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary w-full rounded-b-2xl"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground text-glow">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300">
                  <h3 className="text-lg font-bold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Tem dúvidas? Estamos aqui para ajudar.</p>
          <RippleButton variant="outline" size="lg" className="border-primary/30 hover:border-primary/50">
            Falar com nosso time
          </RippleButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 glass-card mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 FreelaPro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
