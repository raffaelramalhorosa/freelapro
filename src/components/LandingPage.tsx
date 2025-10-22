import { Calculator, TrendingUp, Shield, Zap, ArrowRight, Users, Star, DollarSign, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedDotGrid } from "@/components/AnimatedDotGrid";
import { RippleButton } from "@/components/ui/ripple-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CustomCursor } from "@/components/CustomCursor";
import { MouseTrail } from "@/components/MouseTrail";
import { FloatingShapes } from "@/components/FloatingShapes";
import { RisingParticles } from "@/components/RisingParticles";
import { AnimatedGradient } from "@/components/AnimatedGradient";
import { useParallax } from "@/hooks/useParallax";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { useMouseGradient } from "@/hooks/useMouseGradient";
import { useEffect, useRef, useState } from "react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const mockupCardRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const featureRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const sectionTitleRef = useRef<HTMLDivElement>(null);
  
  // Parallax effects
  useParallax(bgRef, { speed: 0.5 });
  useParallax(mockupRef, { speed: -0.3, direction: "both" });
  
  // Magnetic effect on CTA button
  useMagneticEffect(ctaButtonRef, 0.3);
  
  // Mouse gradient effect
  const heroGradientPosition = useMouseGradient(heroSectionRef);
  
  // Scroll reveal effects
  useScrollReveal([sectionTitleRef], { direction: "up" });
  useScrollReveal([featureRefs[0], featureRefs[2], featureRefs[4]], { direction: "left" });
  useScrollReveal([featureRefs[1], featureRefs[3], featureRefs[5]], { direction: "right" });
  
  // 3D Tilt effect on mockup card
  const handleMockupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = mockupCardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMockupMouseLeave = () => {
    const card = mockupCardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };
  
  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 100);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="min-h-screen bg-background landing-page-with-custom-cursor">
      <CustomCursor />
      <MouseTrail />
      <ScrollProgressBar />
      
      {/* Header */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isHeaderScrolled 
          ? 'bg-[#13131A]/80 shadow-lg shadow-primary/5' 
          : 'bg-transparent'
      } backdrop-blur-lg border-b border-white/5`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo com glow */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/50">
                <Calculator className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                FreelaPro
              </span>
            </div>

            {/* Menu items */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { label: 'Funcionalidades', action: null },
                { label: 'Preços', action: () => onNavigate("pricing") },
                { label: 'Login', action: () => onNavigate("login") }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action || undefined}
                  className="text-gray-300 hover:text-white transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => onNavigate("signup")}
              className="relative px-6 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-white overflow-hidden group"
            >
              <span className="relative z-10">Começar Grátis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroSectionRef} className="relative overflow-hidden">
        {/* Layer 1: Animated Dot Grid Background with Parallax */}
        <div ref={bgRef} className="absolute inset-0" style={{ willChange: "transform", zIndex: 0 }}>
          <AnimatedDotGrid />
        </div>
        
        {/* Layer 2: Animated Gradient Overlay */}
        <AnimatedGradient />
        
        {/* Layer 3: Mouse-following gradient spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${heroGradientPosition.x}% ${heroGradientPosition.y}%, rgba(99, 102, 241, 0.15), transparent 40%)`,
            zIndex: 2,
          }}
        />
        
        {/* Layer 4: Floating Geometric Shapes */}
        <FloatingShapes />
        
        {/* Layer 5: Rising Particles */}
        <RisingParticles />
        
        {/* Floating Particles */}
        <div className="particle particle-1 w-3 h-3 bg-primary/40 top-[10%] left-[15%]" style={{ zIndex: 1 }}></div>
        <div className="particle particle-2 w-4 h-4 bg-secondary/40 top-[30%] right-[20%]" style={{ zIndex: 1 }}></div>
        <div className="particle particle-3 w-2 h-2 bg-tertiary/40 bottom-[25%] left-[25%]" style={{ zIndex: 1 }}></div>
        <div className="particle particle-4 w-3 h-3 bg-primary/40 top-[60%] right-[15%]" style={{ zIndex: 1 }}></div>
        <div className="particle particle-5 w-4 h-4 bg-secondary/40 bottom-[15%] right-[30%]" style={{ zIndex: 1 }}></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 opacity-50" style={{ zIndex: 1 }}></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ zIndex: 1 }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s", zIndex: 1 }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tertiary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s", zIndex: 1 }}></div>
        
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Coluna Esquerda - 60% */}
            <div className="lg:col-span-3 space-y-8 relative z-10">
              <Badge className="glass-card text-primary border-primary/20 shadow-lg hover:shadow-primary/30 transition-shadow animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <Sparkles className="w-3 h-3 mr-1" />
                Ferramenta #1 para Freelancers no Brasil
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up text-glow" style={{ animationDelay: "0.15s" }}>
                Precifique seus projetos com{" "}
                <span className="gradient-text">
                  inteligência
                </span>{" "}
                e feche mais contratos
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
                Calcule valores justos em segundos, gere contratos profissionais e acompanhe todos os seus projetos em um só lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <RippleButton
                  ref={ctaButtonRef}
                  onClick={() => onNavigate("signup")}
                  size="lg"
                  className="text-lg px-8 py-7 neon-button magnetic"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </RippleButton>
                <RippleButton
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-7"
                  rippleColor="rgba(99, 102, 241, 0.4)"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Ver Como Funciona
                </RippleButton>
              </div>

              {/* Mini Estatísticas */}
              <div className="flex flex-wrap gap-6 pt-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    +<AnimatedCounter value={2500} />
                  </span>
                  <span className="text-muted-foreground">freelancers</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">
                    <AnimatedCounter value={4.9} decimals={1} />
                    /5
                  </span>
                  <span className="text-muted-foreground">avaliação</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">
                    R$ <AnimatedCounter value={12} />M+
                  </span>
                  <span className="text-muted-foreground">em projetos</span>
                </div>
              </div>
            </div>

            {/* Coluna Direita - 40% */}
            <div ref={mockupRef} className="lg:col-span-2 relative animate-fade-in-scale z-10" style={{ animationDelay: "0.5s", willChange: "transform" }}>
              {/* Main Card - Mockup da Interface */}
              <Card 
                ref={mockupCardRef}
                className="card-glow shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(99,102,241,0.6)] tilt-card transition-all duration-200"
                onMouseMove={handleMockupMouseMove}
                onMouseLeave={handleMockupMouseLeave}
              >
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
                      <div className="text-3xl font-bold gradient-text text-glow-purple animate-bounce-in" style={{ animationDelay: "0.6s" }}>
                        R$ 8.280,00
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">R$ 207,00/hora efetiva</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Card - Exemplo de Cálculo */}
              <Card className="absolute -bottom-6 -left-6 w-48 gradient-border shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.4)] animate-fade-in-scale" style={{ animationDelay: "0.7s" }}>
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
      <section ref={featuresRef} className="container mx-auto px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>
        <div className="text-center mb-16 relative z-10">
          <div ref={sectionTitleRef}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Tudo que você precisa para profissionalizar seu trabalho
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas, simples de usar
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {/* Feature 1 */}
          <div ref={featureRefs[0]} className="group relative">
            {/* Background gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            {/* Card principal */}
            <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-105">
              {/* Ícone com glow */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
                <Calculator className="text-white" size={28} />
              </div>
              
              {/* Título com gradient text */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                Calculadora Inteligente
              </h3>
              
              {/* Descrição */}
              <p className="text-gray-400 leading-relaxed">
                Calcule preços justos considerando todos os custos, impostos e margem de lucro
              </p>
              
              {/* Linha decorativa animada */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </div>
          </div>

          {/* Feature 2 */}
          <div ref={featureRefs[1]} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/50">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                Contratos Profissionais
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Gere contratos personalizados em segundos, prontos para assinar
              </p>
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </div>
          </div>

          {/* Feature 3 */}
          <div ref={featureRefs[2]} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                Dashboard Completo
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Visualize estatísticas, projetos aprovados e faturamento total
              </p>
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </div>
          </div>

          {/* Feature 4 */}
          <div ref={featureRefs[3]} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                Histórico de Projetos
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Mantenha registro de todos os orçamentos e contratos gerados
              </p>
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </div>
          </div>

          {/* Feature 5 */}
          <div ref={featureRefs[4]} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/50">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                Acesse de Qualquer Lugar
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Interface responsiva funciona perfeitamente em mobile e desktop
              </p>
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </div>
          </div>

          {/* Feature 6 */}
          <div ref={featureRefs[5]} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/50">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                Dados Seguros
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Suas informações protegidas com criptografia e backup automático
              </p>
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-500 to-amber-600 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-glow">
              Freelancers de todo Brasil já confiam no FreelaPro
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Depoimento 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
              
              <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                {/* Aspas decorativas grandes */}
                <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif">"</div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/30">
                    AS
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Ana Silva</h4>
                    <p className="text-sm text-muted-foreground">Designer Gráfica</p>
                  </div>
                </div>
                
                {/* Stars com glow dourado */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic relative z-10">
                  "Antes eu cobrava no feeling e sempre tinha prejuízo. Agora consigo precificar com confiança e aumentei meu lucro em 40%!"
                </p>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
              
              <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                <div className="absolute top-4 right-4 text-6xl text-green-500/10 font-serif">"</div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-green-500/30">
                    CM
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Carlos Mendes</h4>
                    <p className="text-sm text-muted-foreground">Desenvolvedor Web</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic relative z-10">
                  "Os contratos profissionais me deram muito mais credibilidade com clientes. Fechei 3 projetos grandes no último mês!"
                </p>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
              
              <div className="relative bg-[#13131A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                <div className="absolute top-4 right-4 text-6xl text-blue-500/10 font-serif">"</div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30">
                    MC
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Mariana Costa</h4>
                    <p className="text-sm text-muted-foreground">Redatora</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic relative z-10">
                  "Interface simples e intuitiva. Em 5 minutos já estava usando. Economizo horas toda semana!"
                </p>
              </div>
            </div>
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
            <RippleButton
              onClick={() => onNavigate("signup")}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 shadow-2xl text-lg px-12 py-8 text-xl font-semibold hover:scale-105 transition-transform"
              rippleColor="rgba(99, 102, 241, 0.3)"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 w-6 h-6" />
            </RippleButton>
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
      <footer className="relative bg-[#0A0A0F] text-gray-300 py-16 border-t border-transparent overflow-hidden" style={{ borderImage: 'linear-gradient(90deg, hsl(239, 84%, 67%), hsl(271, 91%, 65%), hsl(330, 81%, 60%)) 1' }}>
        {/* Partículas sutis flutuando no background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="particle w-2 h-2 bg-primary/20 top-[20%] left-[10%]"></div>
          <div className="particle w-1.5 h-1.5 bg-secondary/20 top-[60%] right-[15%]"></div>
          <div className="particle w-2.5 h-2.5 bg-tertiary/20 bottom-[30%] left-[70%]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            {/* Logo grande + tagline + Newsletter */}
            <div className="md:col-span-5">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/50">
                  <Calculator className="text-white" size={28} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  FreelaPro
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-sm">
                A plataforma completa para freelancers precificarem projetos, gerarem contratos e acompanharem seu crescimento profissional.
              </p>
              
              {/* Newsletter com glow border */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold text-sm">Receba novidades</h4>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                  <div className="relative flex">
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      className="flex-1 bg-[#13131A] border border-white/10 rounded-l-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button className="bg-gradient-to-r from-primary to-secondary px-6 rounded-r-lg font-medium text-white hover:shadow-lg hover:shadow-primary/50 transition-all">
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Links organizados em colunas */}
            <div className="md:col-span-2">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Produto</h4>
              <ul className="space-y-3">
                <li>
                  <button className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("pricing")}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    Preços
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">
                    Atualizações
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Empresa</h4>
              <ul className="space-y-3">
                <li>
                  <button className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">
                    Sobre
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">
                    Blog
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">
                    Contato
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 mb-6">
                <li>
                  <button className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">
                    Privacidade
                  </button>
                </li>
              </ul>

              {/* Social icons com scale + color hover */}
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Redes Sociais</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-11 h-11 bg-white/5 hover:bg-gradient-to-br hover:from-primary hover:to-secondary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 border border-white/10 hover:border-transparent"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 bg-white/5 hover:bg-gradient-to-br hover:from-primary hover:to-secondary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 border border-white/10 hover:border-transparent"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 bg-white/5 hover:bg-gradient-to-br hover:from-primary hover:to-secondary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 border border-white/10 hover:border-transparent"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright com linha decorativa acima */}
          <div className="relative pt-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>© 2024 FreelaPro. Todos os direitos reservados.</p>
              <p>
                Feito por{" "}
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
          </div>
        </div>
      </footer>
    </div>
  );
};
