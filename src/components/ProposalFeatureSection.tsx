import { useState, useEffect, useRef } from "react";
import { Sparkles, Zap, BarChart3, Share2, CheckCircle, ArrowRight } from "lucide-react";

const CountUp = ({ end, duration, suffix = '' }: { end: number; duration: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

export const ProposalFeatureSection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background com gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F14] via-[#1A1A24] to-[#0F0F14]">
        {/* Blobs animados */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Badge animado */}
        <div className={`text-center mb-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm backdrop-blur-xl">
            <Sparkles size={16} className="animate-pulse" />
            <span className="font-semibold">Nova Funcionalidade</span>
          </div>
        </div>

        {/* Título com gradiente animado */}
        <div className={`text-center mb-6 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Crie{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300%">
                Páginas de Proposta
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                <path
                  d="M0,4 Q50,0 100,4 T200,4"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  className="animate-draw"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            Profissionais em Segundos
          </h2>
        </div>

        {/* Subtítulo */}
        <p className={`text-center text-xl text-gray-400 max-w-3xl mx-auto mb-16 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Impressione seus clientes com propostas comerciais interativas, visuais e profissionais. 
          Sem código, sem complicação.
        </p>

        {/* Grid de 2 colunas - Mockup + Features */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Coluna Esquerda - Mockup animado */}
          <div className={`relative transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            {/* Container do mockup com glow */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              
              {/* Mockup da página */}
              <div 
                className="relative bg-gradient-to-br from-[#1C1C26] to-[#0F0F14] rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl"
                style={{ 
                  willChange: 'transform',
                  contain: 'layout style paint'
                }}
              >
                {/* Browser bar */}
                <div className="bg-[#0F0F14] border-b border-purple-500/20 px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 bg-[#1C1C26] rounded px-3 py-1 text-xs text-gray-500">
                    freelapro.com/proposta/web-commerce-xyz
                  </div>
                </div>

                {/* Content preview animado */}
                <div className="p-6 space-y-4">
                  {/* Título animado */}
                  <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded w-1/3 animate-pulse" />
                    <div className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg w-2/3 animate-shimmer" />
                  </div>

                  {/* Cards de valor */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4 animate-fadeIn animation-delay-500">
                      <div className="h-2 bg-purple-400/50 rounded w-1/2 mb-2" />
                      <div className="h-6 bg-purple-400 rounded w-3/4" />
                    </div>
                    <div className="bg-pink-600/20 border border-pink-500/30 rounded-xl p-4 animate-fadeIn animation-delay-700">
                      <div className="h-2 bg-pink-400/50 rounded w-1/2 mb-2" />
                      <div className="h-6 bg-pink-400 rounded w-3/4" />
                    </div>
                  </div>

                  {/* Gráfico simulado */}
                  <div className="bg-[#1C1C26] rounded-xl p-4 border border-purple-500/20 animate-fadeIn animation-delay-1000">
                    <div className="flex items-end space-x-2 h-24">
                      <div 
                        className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t animate-growHeight" 
                        style={{ height: '60%', willChange: 'transform', transformOrigin: 'bottom' }} 
                      />
                      <div 
                        className="flex-1 bg-gradient-to-t from-pink-600 to-pink-400 rounded-t animate-growHeight animation-delay-200" 
                        style={{ height: '80%', willChange: 'transform', transformOrigin: 'bottom' }} 
                      />
                      <div 
                        className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t animate-growHeight animation-delay-400" 
                        style={{ height: '40%', willChange: 'transform', transformOrigin: 'bottom' }} 
                      />
                      <div 
                        className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t animate-growHeight animation-delay-600" 
                        style={{ height: '90%', willChange: 'transform', transformOrigin: 'bottom' }} 
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i}
                        className="flex items-center space-x-3 animate-fadeIn"
                        style={{ animationDelay: `${1200 + i * 200}ms` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                          {i}
                        </div>
                        <div className="flex-1 h-3 bg-gradient-to-r from-purple-500/30 to-transparent rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Elementos flutuantes decorativos */}
              <div 
                className="absolute -right-8 -top-8 w-24 h-24 bg-purple-600/20 rounded-full blur-2xl animate-float"
                style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
              />
              <div 
                className="absolute -left-8 -bottom-8 w-32 h-32 bg-pink-600/20 rounded-full blur-2xl animate-float animation-delay-2000"
                style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
              />
            </div>
          </div>

          {/* Coluna Direita - Features */}
          <div className="space-y-8">
            {/* Feature 1 */}
            <div className={`group transition-all duration-700 delay-400 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 rounded-2xl hover:border-purple-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    Criação Instantânea
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Configure fases, custos e benefícios em um formulário intuitivo. 
                    Sua proposta fica pronta em menos de 5 minutos.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`group transition-all duration-700 delay-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-pink-600/10 to-transparent border border-pink-500/20 rounded-2xl hover:border-pink-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                    Gráficos Interativos
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Visualize a distribuição de investimento com gráficos de pizza, 
                    timeline de fases e breakdown completo de custos.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`group transition-all duration-700 delay-600 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-2xl hover:border-indigo-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    Compartilhamento Simples
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Gere um link único e compartilhe com seu cliente. 
                    Ele visualiza sem precisar fazer login ou cadastro.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className={`group transition-all duration-700 delay-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-green-600/10 to-transparent border border-green-500/20 rounded-2xl hover:border-green-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                    Impressione Seus Clientes
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Design profissional, responsivo e moderno. 
                    Aumente suas chances de fechar negócio com propostas impactantes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA com animação */}
        <div className={`text-center mt-20 transition-all duration-700 delay-800 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex flex-col items-center space-y-4">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white text-lg overflow-hidden hover:scale-105 transition-all shadow-lg shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/60">
              <span className="relative z-10 flex items-center space-x-2">
                <span>Criar Minha Primeira Proposta</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>

            <p className="text-sm text-gray-400 flex items-center space-x-2">
              <Sparkles size={14} className="text-purple-400" />
              <span>Grátis para começar • Sem cartão de crédito</span>
            </p>
          </div>
        </div>

        {/* Stats animados */}
        <div className={`grid grid-cols-3 gap-8 mt-20 transition-all duration-700 delay-900 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {isInView && <CountUp end={50} duration={2} suffix="%" />}
            </div>
            <div className="text-gray-400 text-sm">Taxa de Conversão Maior</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              {isInView && <CountUp end={10} duration={2} suffix="x" />}
            </div>
            <div className="text-gray-400 text-sm">Mais Rápido que PDF</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {isInView && <CountUp end={100} duration={2} suffix="%" />}
            </div>
            <div className="text-gray-400 text-sm">Satisfação dos Clientes</div>
          </div>
        </div>
      </div>
    </section>
  );
};
