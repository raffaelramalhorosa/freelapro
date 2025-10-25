import { X, Check, Zap, Crown, Rocket, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onUpgradeClick?: (planId: string) => void;
}

export const PricingModal = ({ isOpen, onClose, currentPlan = 'free', onUpgradeClick }: PricingModalProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Zap,
      price: 0,
      priceYearly: 0,
      color: 'gray' as const,
      description: 'Para começar',
      features: [
        { text: '5 projetos por mês', included: true },
        { text: 'Calculadora completa', included: true },
        { text: 'Contratos básicos', included: true },
        { text: 'Páginas de proposta', included: true },
        { text: 'Histórico de 30 dias', included: true },
        { text: 'Dashboard avançado', included: false },
        { text: 'Suporte prioritário', included: false },
        { text: 'Relatórios em PDF', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      price: 29,
      priceYearly: 290,
      color: 'amber' as const,
      badge: 'Mais Popular',
      description: 'Para profissionais',
      features: [
        { text: 'Projetos ilimitados', included: true },
        { text: 'Todos os recursos Free', included: true },
        { text: 'Dashboard completo', included: true },
        { text: 'Histórico ilimitado', included: true },
        { text: 'Páginas de proposta ilimitadas', included: true },
        { text: 'Exportar relatórios PDF', included: true },
        { text: 'Múltiplos regimes tributários', included: true },
        { text: 'Suporte por email', included: true },
      ],
    },
    {
      id: 'business',
      name: 'Business',
      icon: Rocket,
      price: 79,
      priceYearly: 790,
      color: 'purple' as const,
      description: 'Para equipes',
      features: [
        { text: 'Tudo do Pro', included: true },
        { text: 'Até 5 usuários', included: true },
        { text: 'White-label nos contratos', included: true },
        { text: 'Integrações (API)', included: true },
        { text: 'Suporte prioritário', included: true },
        { text: 'Gerente de conta dedicado', included: true },
        { text: 'Treinamento personalizado', included: true },
        { text: 'SLA garantido', included: true },
      ],
    },
  ];

  const colorClasses = {
    gray: {
      border: 'border-gray-500/30',
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      button: 'bg-gray-600 hover:bg-gray-700',
      glow: 'shadow-gray-500/20',
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      button: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90',
      glow: 'shadow-amber-500/50',
    },
    purple: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90',
      glow: 'shadow-purple-500/50',
    },
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) {
      onClose();
      return;
    }

    if (planId === 'free') {
      if (!confirm('Tem certeza que deseja fazer downgrade para o plano Free? Você perderá acesso aos recursos premium.')) {
        return;
      }
    }

    setLoading(true);

    try {
      if (onUpgradeClick) {
        onUpgradeClick(planId);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao alterar plano:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = (planId: string) => {
    if (loading) return 'Processando...';
    if (planId === currentPlan) return 'Plano Atual';
    if (planId === 'free') return 'Fazer Downgrade';
    return 'Fazer Upgrade';
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1C1C26] border border-purple-500/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C26] border-b border-purple-500/20 px-8 py-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Escolha Seu Plano</h2>
            <p className="text-gray-400 mt-2">
              {currentPlan === 'free' 
                ? 'Faça upgrade e desbloqueie todo o potencial do FreelaPro'
                : `Você está no plano ${currentPlan.toUpperCase()}. Escolha um novo plano abaixo.`
              }
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Toggle Mensal/Anual */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
              Mensal
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-purple-600/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Anual
            </span>
            {billingCycle === 'yearly' && (
              <span className="inline-flex items-center px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-semibold">
                <Sparkles size={12} className="mr-1" />
                Economize 20%
              </span>
            )}
          </div>
        </div>

        {/* Cards de Planos */}
        <div className="px-8 pb-8 grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const colors = colorClasses[plan.color];
            const Icon = plan.icon;
            const isCurrentPlan = plan.id === currentPlan;
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.price;

            return (
              <div
                key={plan.id}
                className={`relative bg-[#0F0F14] border-2 rounded-2xl p-6 transition-all hover:scale-105 ${
                  isCurrentPlan 
                    ? `${colors.border} ${colors.glow} shadow-2xl` 
                    : 'border-purple-500/20 hover:border-purple-500/40'
                } ${plan.badge ? 'ring-2 ring-amber-500/50' : ''}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-white text-xs font-bold shadow-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Badge Plano Atual */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <div className={`px-3 py-1 ${colors.bg} border ${colors.border} rounded-full ${colors.text} text-xs font-bold`}>
                      Plano Atual
                    </div>
                  </div>
                )}

                {/* Ícone */}
                <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6`}>
                  <Icon className={colors.text} size={28} />
                </div>

                {/* Nome e Descrição */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                {/* Preço */}
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <div className="text-4xl font-bold text-white">Grátis</div>
                  ) : (
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold text-white">
                          R$ {price}
                        </span>
                        <span className="text-gray-400">
                          /{billingCycle === 'yearly' ? 'ano' : 'mês'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="text-sm text-green-400 mt-1">
                          Economize R$ {plan.price * 12 - plan.priceYearly} por ano
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Botão */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading || isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-semibold transition-all mb-6 ${
                    isCurrentPlan 
                      ? 'bg-white/5 text-gray-400 cursor-not-allowed' 
                      : `${colors.button} text-white shadow-lg ${colors.glow}`
                  }`}
                >
                  {getButtonText(plan.id)}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {feature.included ? (
                        <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer com garantia */}
        <div className="px-8 pb-8">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Sparkles className="text-blue-400" size={20} />
              <span className="text-blue-400 font-semibold">Garantia de 30 dias</span>
            </div>
            <p className="text-sm text-gray-400">
              Não satisfeito? Devolvemos 100% do seu dinheiro, sem perguntas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
