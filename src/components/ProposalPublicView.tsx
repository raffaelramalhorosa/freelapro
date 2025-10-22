import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Printer, 
  DollarSign, 
  Layers, 
  Calendar, 
  Target, 
  TrendingUp, 
  Star, 
  Zap, 
  CheckCircle, 
  Mail, 
  Download, 
  Eye 
} from "lucide-react";

interface Proposal {
  id: string;
  project_name: string;
  client_name: string;
  summary: string;
  total_budget: number;
  phases: Array<{
    id: number;
    name: string;
    duration: number;
    durationUnit: string;
    summary: string;
    startDate: string;
    endDate: string;
    budget: number;
  }>;
  fixed_costs: Array<{
    id: number;
    name: string;
    value: number;
    description: string;
  }>;
  benefits: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  status: string;
  views: number;
  created_at: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const ProposalPublicView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) loadProposal(slug);
  }, [slug]);

  const loadProposal = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      setProposal(data as unknown as Proposal);

      // Incrementar views
      await supabase
        .from('proposals')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);

    } catch (error) {
      console.error(error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F14] to-[#1A1A24] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F14] to-[#1A1A24] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-2">Proposta não encontrada</h1>
          <p className="text-gray-400 mb-6">Esta proposta pode ter sido removida ou o link está incorreto.</p>
          <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Ir para o Início
          </a>
        </div>
      </div>
    );
  }

  if (!proposal) return null;

  const totalPhaseBudget = proposal.phases?.reduce((sum, p) => sum + parseFloat(String(p.budget || 0)), 0) || 0;
  const totalFixedCosts = proposal.fixed_costs?.reduce((sum, c) => sum + parseFloat(String(c.value || 0)), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F14] via-[#1A1A24] to-[#0F0F14]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-purple-500/10">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          {/* Header minimalista */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-400">Proposta Comercial</div>
                <div className="text-white font-semibold">FreelaPro</div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-2 text-white"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>

          {/* Título */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-purple-300 mb-6">
              Proposta exclusiva para {proposal.client_name}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {proposal.project_name}
              </span>
            </h1>

            {proposal.summary && (
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {proposal.summary}
              </p>
            )}
          </div>

          {/* Cards de Valor e Info */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Card Investimento */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <DollarSign className="text-purple-400" size={24} />
                  </div>
                  <div className="text-gray-400 text-sm">Investimento</div>
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  {formatCurrency(proposal.total_budget)}
                </div>
                
                <div className="text-sm text-gray-400">
                  Valor total do projeto
                </div>
              </div>
            </div>

            {/* Card Fases */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <Layers className="text-pink-400" size={24} />
                  </div>
                  <div className="text-gray-400 text-sm">Estrutura</div>
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">
                  {proposal.phases?.length || 0}
                </div>
                
                <div className="text-sm text-gray-400">
                  Fases de desenvolvimento
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Fases */}
      {proposal.phases?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Fases do Projeto</h2>
            <p className="text-gray-400">Dividimos o projeto em etapas claras e organizadas</p>
          </div>

          {/* Gráfico de Pizza */}
          <div className="bg-[#1C1C26]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Distribuição de Investimento</h3>
            
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* SVG Pizza Chart */}
              <div className="relative w-64 h-64 flex-shrink-0">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {proposal.phases.map((phase, index) => {
                    const phaseBudget = parseFloat(String(phase.budget || 0));
                    const percentage = (phaseBudget / totalPhaseBudget) * 100;
                    const circumference = 2 * Math.PI * 80;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    
                    const previousPercentage = proposal.phases
                      .slice(0, index)
                      .reduce((sum, p) => sum + ((parseFloat(String(p.budget || 0)) / totalPhaseBudget) * 100), 0);
                    const strokeDashoffset = -(previousPercentage / 100) * circumference;

                    const colors = ['#8B5CF6', '#A855F7', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

                    return phaseBudget > 0 ? (
                      <circle
                        key={index}
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke={colors[index % colors.length]}
                        strokeWidth="40"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700"
                      />
                    ) : null;
                  })}
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                      {formatCurrency(totalPhaseBudget)}
                    </div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                </div>
              </div>

              {/* Legenda */}
              <div className="flex-1 space-y-3 w-full max-h-80 overflow-y-auto">
                {proposal.phases.map((phase, index) => {
                  const phaseBudget = parseFloat(String(phase.budget || 0));
                  const percentage = ((phaseBudget / totalPhaseBudget) * 100).toFixed(1);
                  const colors = ['#8B5CF6', '#A855F7', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#0F0F14] rounded-xl">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div 
                          className="w-4 h-4 rounded flex-shrink-0"
                          style={{ background: colors[index % colors.length] }}
                        />
                        <span className="text-white font-medium truncate">{phase.name}</span>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-white font-semibold whitespace-nowrap">
                          {formatCurrency(phaseBudget)}
                        </div>
                        <div className="text-xs text-gray-400">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline das Fases */}
          <div className="space-y-6">
            {proposal.phases.map((phase, index) => (
              <div key={index} className="relative group">
                {index < proposal.phases.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-purple-500/20 -z-10" />
                )}

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>

                  <div className="flex-1 bg-[#1C1C26]/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white mb-2">{phase.name}</h3>
                        {phase.summary && (
                          <p className="text-gray-400 text-sm leading-relaxed">{phase.summary}</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">
                          {formatCurrency(parseFloat(String(phase.budget || 0)))}
                        </div>
                        {phase.duration && (
                          <div className="text-sm text-gray-400 mt-1">
                            {phase.duration} {phase.durationUnit}
                          </div>
                        )}
                      </div>
                    </div>

                    {(phase.startDate || phase.endDate) && (
                      <div className="flex items-center gap-4 text-sm text-gray-400 pt-4 border-t border-purple-500/10">
                        {phase.startDate && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-purple-400" />
                            <span>Início: {new Date(phase.startDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                        {phase.endDate && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-pink-400" />
                            <span>Entrega: {new Date(phase.endDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seção de Custos Fixos */}
      {proposal.fixed_costs?.length > 0 && (
        <div className="bg-[#1A1A24]/50 border-y border-purple-500/10">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Custos Inclusos</h2>
              <p className="text-gray-400">Recursos e ferramentas necessários para o projeto</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {proposal.fixed_costs.map((cost, index) => (
                <div 
                  key={index}
                  className="bg-[#1C1C26]/50 backdrop-blur-xl border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-all hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="text-orange-400" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-orange-400">
                      {formatCurrency(parseFloat(String(cost.value || 0)))}
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">{cost.name}</h4>
                  {cost.description && (
                    <p className="text-sm text-gray-400 leading-relaxed">{cost.description}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block bg-orange-500/10 border border-orange-500/20 rounded-xl px-6 py-4">
                <div className="text-sm text-orange-300 mb-1">Total de Custos Fixos</div>
                <div className="text-3xl font-bold text-orange-400">
                  {formatCurrency(totalFixedCosts)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seção de Benefícios */}
      {proposal.benefits?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Benefícios Esperados</h2>
            <p className="text-gray-400">O que você ganha com este projeto</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposal.benefits.map((benefit, index) => {
              const icons = [Target, TrendingUp, Star, Zap, CheckCircle];
              const IconComponent = icons[index % icons.length];
              
              return (
                <div 
                  key={index}
                  className="bg-[#1C1C26]/50 backdrop-blur-xl border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                    <IconComponent className="text-green-400" size={24} />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">{benefit.name}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-y border-purple-500/30">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Esta proposta é válida por 30 dias. Entre em contato para discutir os próximos passos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:contato@freelapro.com?subject=Proposta: ${proposal.project_name}`}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl font-semibold transition-opacity flex items-center gap-2"
            >
              <Mail size={20} />
              Aceitar Proposta
            </a>

            <button
              onClick={() => window.print()}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <Download size={20} />
              Baixar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-purple-500/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div>
              Proposta criada em {new Date(proposal.created_at).toLocaleDateString('pt-BR')} via FreelaPro
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{proposal.views} visualizações</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};