import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { FolderKanban, Plus, X, Calendar as CalendarIcon, Trash2, CheckCircle, Copy, Check, ExternalLink, Info, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ProjectCard } from "@/components/ProjectCard";
import { PhaseItem, CostItem, BenefitItem, LazyPhaseChart } from "@/components/ProposalModalItems";
import { supabase } from "@/integrations/supabase/client";

interface CalculatedResults {
  valorBase: number;
  custosTotais: number;
  subtotal: number;
  lucro: number;
  antesImpostos: number;
  impostos: number;
  valorFinal: number;
  valorHoraEfetivo: number;
}

interface Project {
  id: number;
  clientName: string;
  projectName: string;
  serviceType: string;
  hoursEstimated: number;
  desiredHourlyRate: number;
  fixedCosts: number;
  variableCosts: number;
  taxType: string;
  profitMargin: number;
  results: CalculatedResults;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface ProjectsProps {
  onNavigateToCalculator: () => void;
  onEditProject: (project: Project) => void;
  userPlan?: string;
}

export const Projects = ({ onNavigateToCalculator, onEditProject, userPlan = "free" }: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState<string>('');
  const [projectProposals, setProjectProposals] = useState<Record<string, any>>({});
  const [existingProposalId, setExistingProposalId] = useState<string | null>(null);
  const [proposalData, setProposalData] = useState({
    projectId: null as number | null,
    projectName: '',
    clientName: '',
    projectSummary: '',
    totalBudget: 0,
    phases: [] as Array<{
      id: number;
      name: string;
      duration: number;
      durationUnit: string;
      summary: string;
      startDate: Date | undefined;
      endDate: Date | undefined;
      budget: number;
    }>,
    fixedCosts: [] as Array<{
      id: number;
      name: string;
      value: number;
      description: string;
    }>,
    benefits: [] as Array<{
      id: number;
      name: string;
      description: string;
    }>,
  });

  // Carregar projetos do localStorage e propostas do Supabase
  useEffect(() => {
    loadProjects();
    loadProjectProposals();
  }, []);

  const loadProjectProposals = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data, error } = await supabase
        .from('proposals')
        .select('id, project_name, client_name, slug')
        .eq('user_id', user.id);

      if (error) throw error;

      // Map proposals by project name + client name combination
      const proposalsMap: Record<string, any> = {};
      data?.forEach((proposal: any) => {
        const key = `${proposal.project_name}||${proposal.client_name}`;
        proposalsMap[key] = proposal;
      });
      setProjectProposals(proposalsMap);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
    }
  };

  const loadProjects = () => {
    try {
      const loadedProjects: Project[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("project:")) {
          const projectData = localStorage.getItem(key);
          if (projectData) {
            loadedProjects.push(JSON.parse(projectData));
          }
        }
      }
      // Ordenar por data de criação (mais recente primeiro)
      loadedProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setProjects(loadedProjects);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = useCallback((projectId: number, newStatus: string) => {
    try {
      const key = `project:${projectId}`;
      const projectData = localStorage.getItem(key);
      if (projectData) {
        const project = JSON.parse(projectData);
        project.status = newStatus;
        project.updatedAt = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(project));
        loadProjects();
        toast({
          title: "Sucesso!",
          description: "Status do projeto atualizado.",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  }, []);

  const handleDelete = useCallback((projectId: number) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        localStorage.removeItem(`project:${projectId}`);
        loadProjects();
        toast({
          title: "Sucesso!",
          description: "Projeto excluído.",
        });
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o projeto.",
          variant: "destructive",
        });
      }
    }
  }, []);

  const generateContract = useCallback((project: Project) => {
    const contractDate = new Date().toLocaleDateString("pt-BR");
    const projectNameSlug = project.projectName.toLowerCase().replace(/\s+/g, "-");
    
    const contractText = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS - ${project.serviceType.toUpperCase()}

CONTRATANTE: ${project.clientName}
CONTRATADO: [SEU NOME/EMPRESA]

Data: ${contractDate}

======================================================================

1. OBJETO DO CONTRATO

O presente contrato tem por objeto a prestação de serviços de ${project.serviceType} para o projeto "${project.projectName}", conforme especificações técnicas e briefing apresentados e acordados entre as partes.

Tipo de Serviço: ${project.serviceType}
Horas Estimadas: ${project.hoursEstimated} horas
Valor Total: R$ ${project.results.valorFinal.toFixed(2)}

======================================================================

2. DO PRAZO E ENTREGA

2.1. O prazo estimado para conclusão dos serviços é de [INSERIR PRAZO] dias corridos, contados a partir da data de aprovação do briefing e recebimento do sinal.

2.2. O cronograma detalhado será apresentado em até 48 horas após a assinatura deste contrato.

2.3. Os prazos poderão ser prorrogados mediante acordo entre as partes, especialmente em casos de:
   a) Atraso no fornecimento de informações ou materiais pelo CONTRATANTE
   b) Alterações no escopo do projeto
   c) Força maior ou caso fortuito

======================================================================

3. DO VALOR E PAGAMENTO

3.1. Pelo serviço ora contratado, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ ${project.results.valorFinal.toFixed(2)} (${numberToWords(project.results.valorFinal)}).

3.2. Forma de Pagamento (marque uma opção):
   [ ] Pagamento único: 50% no início + 50% na entrega
   [ ] Parcelado em 2x: R$ ${(project.results.valorFinal / 2).toFixed(2)} (50% no início + 50% em 30 dias)
   [ ] Parcelado em 3x: R$ ${(project.results.valorFinal / 3).toFixed(2)} mensais
   [ ] Outra forma: _______________________________

3.3. Os pagamentos deverão ser realizados via:
   [ ] PIX: [INSERIR CHAVE PIX]
   [ ] Transferência bancária: [INSERIR DADOS]
   [ ] Outro: _______________________________

3.4. O atraso no pagamento acarretará multa de 2% sobre o valor devido, acrescida de juros de 1% ao mês.

======================================================================

4. DAS OBRIGAÇÕES DO CONTRATADO

4.1. Executar os serviços com qualidade profissional, dentro dos padrões de mercado.

4.2. Manter o CONTRATANTE informado sobre o andamento do projeto.

4.3. Entregar o projeto no prazo acordado, salvo prorrogações justificadas.

4.4. Manter sigilo sobre informações confidenciais do CONTRATANTE.

4.5. Fornecer suporte técnico por [INSERIR PRAZO] dias após a entrega final.

======================================================================

5. DAS OBRIGAÇÕES DO CONTRATANTE

5.1. Fornecer todas as informações, materiais e acessos necessários para execução do projeto.

5.2. Responder às solicitações do CONTRATADO em até 48 horas úteis.

5.3. Efetuar os pagamentos nas datas acordadas.

5.4. Aprovar ou solicitar revisões dentro dos prazos estabelecidos.

5.5. Fornecer feedback claro e objetivo sobre as entregas.

======================================================================

6. DOS DIREITOS AUTORAIS E PROPRIEDADE INTELECTUAL

Selecione uma das opções abaixo:

[ ] OPÇÃO A - Transferência Total de Direitos:
    Após o pagamento integral, todos os direitos autorais e de propriedade intelectual 
    do trabalho desenvolvido serão transferidos ao CONTRATANTE, podendo este utilizar, 
    modificar e comercializar livremente.

[ ] OPÇÃO B - Licença de Uso:
    O CONTRATADO mantém os direitos autorais, concedendo ao CONTRATANTE licença 
    exclusiva de uso para os fins acordados. Modificações e uso comercial dependem 
    de autorização prévia.

[ ] OPÇÃO C - Licença Não-Exclusiva:
    O CONTRATADO mantém os direitos autorais e poderá usar o trabalho em seu portfólio. 
    O CONTRATANTE recebe licença de uso para fins internos/comerciais acordados.

6.1. O CONTRATADO poderá usar imagens do projeto em seu portfólio, salvo acordo em contrário.

======================================================================

7. DAS REVISÕES

7.1. Estão incluídas no valor contratado até [INSERIR NÚMERO] rodadas de revisões.

7.2. Considera-se "rodada de revisão" o conjunto de ajustes solicitados pelo CONTRATANTE após cada apresentação.

7.3. Revisões adicionais serão cobradas à parte, no valor de R$ ${project.results.valorHoraEfetivo.toFixed(2)} por hora.

7.4. Alterações de escopo não são consideradas revisões e serão orçadas separadamente.

======================================================================

8. DO CANCELAMENTO E RESCISÃO

8.1. Qualquer das partes poderá rescindir o contrato mediante comunicação por escrito com 7 dias de antecedência.

8.2. Em caso de cancelamento pelo CONTRATANTE:
   a) Antes do início dos trabalhos: reembolso de 70% do valor pago
   b) Com até 50% do projeto concluído: sem reembolso, entrega do trabalho desenvolvido
   c) Com mais de 50% concluído: pagamento integral do valor acordado

8.3. Em caso de cancelamento pelo CONTRATADO por inadimplência:
   - Todo valor em aberto deverá ser pago em até 48 horas
   - Os arquivos só serão entregues após quitação total

======================================================================

9. DAS DISPOSIÇÕES GERAIS

9.1. Este contrato é regido pelas leis brasileiras.

9.2. Alterações neste contrato só terão validade se feitas por escrito e assinadas por ambas as partes.

9.3. A tolerância de uma parte com o descumprimento da outra não significará renúncia de direitos.

======================================================================

10. DO FORO

Fica eleito o foro da comarca de [INSERIR CIDADE/ESTADO] para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato, renunciando as partes a qualquer outro, por mais privilegiado que seja.

======================================================================

CONTRATANTE:
Nome: ${project.clientName}
CPF/CNPJ: _______________________________
Endereço: _______________________________
E-mail: _______________________________
Telefone: _______________________________
Assinatura: _____________________________ Data: ____/____/____


CONTRATADO:
Nome/Empresa: [INSERIR SEU NOME/EMPRESA]
CPF/CNPJ: _______________________________
Endereço: _______________________________
E-mail: _______________________________
Telefone: _______________________________
Assinatura: _____________________________ Data: ____/____/____


======================================================================

TESTEMUNHAS (opcional):

1) _______________________________  CPF: _______________________________
   Assinatura: _______________________________

2) _______________________________  CPF: _______________________________
   Assinatura: _______________________________

======================================================================
`.trim();

    try {
      // Criar blob com o conteúdo do contrato
      const blob = new Blob([contractText], { type: "text/plain;charset=utf-8" });
      
      // Criar URL temporária para download
      const url = window.URL.createObjectURL(blob);
      
      // Criar elemento de link para download
      const link = document.createElement("a");
      link.href = url;
      link.download = `contrato-${projectNameSlug}.txt`;
      
      // Adicionar ao DOM, clicar e remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL temporária
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Contrato gerado!",
        description: "O arquivo foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar contrato:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o contrato.",
        variant: "destructive",
      });
    }
  }, []);

  const numberToWords = useCallback((num: number): string => {
    // Função simplificada para converter número em palavras
    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);
    return `${integerPart} reais e ${decimalPart} centavos`;
  }, []);

  const openProposalModal = useCallback(async (project: Project) => {
    setSelectedProject(project);

    // Check if project already has a proposal using project name + client name
    const proposalKey = `${project.projectName}||${project.clientName}`;
    const existingProposal = projectProposals[proposalKey];
    
    if (existingProposal) {
      // Load existing proposal data
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .eq('id', existingProposal.id)
          .single();

        if (error) throw error;

        if (data) {
          setExistingProposalId(data.id);
          setGeneratedSlug(data.slug);
          setProposalData({
            projectId: project.id,
            projectName: data.project_name,
            clientName: data.client_name,
            projectSummary: data.summary || '',
            totalBudget: parseFloat(String(data.total_budget)),
            phases: (data.phases as any[])?.map((phase: any) => ({
              ...phase,
              startDate: phase.startDate ? new Date(phase.startDate) : undefined,
              endDate: phase.endDate ? new Date(phase.endDate) : undefined,
            })) || [],
            fixedCosts: (data.fixed_costs as any[]) || [],
            benefits: (data.benefits as any[]) || [],
          });
        }
      } catch (error) {
        console.error('Erro ao carregar proposta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a proposta existente.",
          variant: "destructive",
        });
      }
    } else {
      // New proposal
      setExistingProposalId(null);
      setProposalData({
        projectId: project.id,
        projectName: project.projectName,
        clientName: project.clientName,
        projectSummary: '',
        totalBudget: project.results.valorFinal,
        phases: [],
        fixedCosts: [],
        benefits: [],
      });
    }
    
    setShowProposalModal(true);
  }, [projectProposals]);

  // Phase management functions
  const addPhase = useCallback(() => {
    setProposalData(prev => ({
      ...prev,
      phases: [...prev.phases, {
        id: Date.now(),
        name: '',
        duration: 0,
        durationUnit: 'dias',
        summary: '',
        startDate: undefined,
        endDate: undefined,
        budget: 0,
      }]
    }));
  }, []);

  const removePhase = useCallback((id: number) => {
    setProposalData(prev => ({
      ...prev,
      phases: prev.phases.filter(phase => phase.id !== id)
    }));
  }, []);

  const updatePhase = useCallback((id: number, field: string, value: any) => {
    setProposalData(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === id ? { ...phase, [field]: value } : phase
      )
    }));
  }, []);

  // Fixed costs management functions
  const addCost = useCallback(() => {
    setProposalData(prev => ({
      ...prev,
      fixedCosts: [...prev.fixedCosts, {
        id: Date.now(),
        name: '',
        value: 0,
        description: '',
      }]
    }));
  }, []);

  const removeCost = useCallback((id: number) => {
    setProposalData(prev => ({
      ...prev,
      fixedCosts: prev.fixedCosts.filter(cost => cost.id !== id)
    }));
  }, []);

  const updateCost = useCallback((id: number, field: string, value: any) => {
    setProposalData(prev => ({
      ...prev,
      fixedCosts: prev.fixedCosts.map(cost =>
        cost.id === id ? { ...cost, [field]: value } : cost
      )
    }));
  }, []);

  // Benefits management functions
  const addBenefit = useCallback(() => {
    setProposalData(prev => ({
      ...prev,
      benefits: [...prev.benefits, {
        id: Date.now(),
        name: '',
        description: '',
      }]
    }));
  }, []);

  const removeBenefit = useCallback((id: number) => {
    setProposalData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit.id !== id)
    }));
  }, []);

  const updateBenefit = useCallback((id: number, field: string, value: any) => {
    setProposalData(prev => ({
      ...prev,
      benefits: prev.benefits.map(benefit =>
        benefit.id === id ? { ...benefit, [field]: value } : benefit
      )
    }));
  }, []);

  // Generate or update proposal page
  const generateProposalPage = useCallback(async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar uma proposta.",
          variant: "destructive",
        });
        return;
      }

      const proposalPayload = {
        user_id: user.id,
        project_id: null, // Projects use numeric IDs, not UUIDs
        project_name: proposalData.projectName,
        client_name: proposalData.clientName,
        summary: proposalData.projectSummary,
        total_budget: parseFloat(String(proposalData.totalBudget)),
        phases: proposalData.phases.map(phase => ({
          ...phase,
          startDate: phase.startDate ? phase.startDate.toISOString() : null,
          endDate: phase.endDate ? phase.endDate.toISOString() : null,
        })),
        fixed_costs: proposalData.fixedCosts,
        benefits: proposalData.benefits,
        status: 'active',
      };

      if (existingProposalId) {
        // Update existing proposal
        const { error } = await supabase
          .from('proposals')
          .update(proposalPayload)
          .eq('id', existingProposalId);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Proposta atualizada com sucesso.",
        });

        setShowProposalModal(false);
        setShowSuccessModal(true);
      } else {
        // Create new proposal
        const slug = `${proposalData.projectName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;

        const { data, error } = await supabase
          .from('proposals')
          .insert([{
            ...proposalPayload,
            slug,
            views: 0,
          }])
          .select()
          .single();

        if (error) throw error;

        setGeneratedSlug(slug);
        setShowProposalModal(false);
        setShowSuccessModal(true);
      }

      // Reload proposals to update UI
      loadProjectProposals();

    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a proposta. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [proposalData, existingProposalId]);

  // Calculate phase percentages for chart - Memoized
  const phaseChartData = useMemo(() => {
    const totalPhaseBudget = proposalData.phases.reduce((sum, phase) => sum + phase.budget, 0);
    return proposalData.phases.map(phase => ({
      name: phase.name || 'Sem nome',
      value: phase.budget,
      percentage: totalPhaseBudget > 0 ? ((phase.budget / totalPhaseBudget) * 100).toFixed(1) : 0,
    }));
  }, [proposalData.phases]);

  // Calculate totals - Memoized
  const totalPhaseBudget = useMemo(() => {
    return proposalData.phases.reduce((sum, phase) => sum + phase.budget, 0);
  }, [proposalData.phases]);

  const totalFixedCosts = useMemo(() => {
    return proposalData.fixedCosts.reduce((sum, cost) => sum + cost.value, 0);
  }, [proposalData.fixedCosts]);

  const grandTotal = useMemo(() => {
    return totalPhaseBudget + totalFixedCosts;
  }, [totalPhaseBudget, totalFixedCosts]);

  const CHART_COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Meus Projetos</h2>
            <p className="text-muted-foreground">Gerencie seus projetos freelance</p>
            {userPlan.toLowerCase() === "free" && (
              <p className="text-sm text-amber-600 mt-1">
                📊 0/2 projetos usados (Plano Free)
              </p>
            )}
          </div>
          <Button 
            onClick={onNavigateToCalculator}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        <Card className="border-2 border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
              <FolderKanban className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="mb-2">Nenhum projeto ainda</CardTitle>
            <CardDescription className="mb-6 max-w-md">
              Comece criando seu primeiro projeto para acompanhar orçamentos, contratos e prazos.
            </CardDescription>
            <Button 
              onClick={onNavigateToCalculator}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Meus Projetos</h2>
          <p className="text-muted-foreground">Gerencie seus projetos freelance</p>
          {userPlan.toLowerCase() === "free" && (
            <p className="text-sm text-amber-600 mt-1">
              📊 {projects.length}/2 projetos usados (Plano Free)
            </p>
          )}
        </div>
        <Button 
          onClick={onNavigateToCalculator}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onStatusChange={handleStatusChange}
            onEdit={onEditProject}
            onDelete={handleDelete}
            onGenerateContract={generateContract}
            onCreateProposal={openProposalModal}
          />
        ))}
      </div>

      {/* Modal de Proposta - Optimized */}
      {showProposalModal && selectedProject && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{ willChange: 'opacity' }}
        >
          <div 
            className="bg-[#1C1C26] border border-[rgba(139,92,246,0.2)] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            style={{ willChange: 'transform' }}
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(139,92,246,0.1)] sticky top-0 bg-[#1C1C26] z-10">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {existingProposalId ? 'Editar Página de Proposta' : 'Criar Página de Proposta'}
                  {existingProposalId && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] rounded-full text-[#3B82F6] text-sm font-normal">
                      <Edit2 size={14} />
                      <span>Modo Edição</span>
                    </span>
                  )}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {existingProposalId 
                    ? `Atualize as informações da proposta para ${selectedProject.clientName}`
                    : `Configure sua proposta profissional para ${selectedProject.clientName}`
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowProposalModal(false)}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="text-gray-400" size={20} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-8">
              {/* 1. Informações Básicas */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName" className="text-gray-300">
                      Nome do Projeto <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="projectName"
                      value={proposalData.projectName}
                      onChange={(e) => setProposalData(prev => ({ ...prev, projectName: e.target.value }))}
                      className="bg-white/5 border-purple-500/20 text-white"
                      placeholder="Ex: Site Institucional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="text-gray-300">
                      Nome do Cliente/Empresa <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="clientName"
                      value={proposalData.clientName}
                      onChange={(e) => setProposalData(prev => ({ ...prev, clientName: e.target.value }))}
                      className="bg-white/5 border-purple-500/20 text-white"
                      placeholder="Ex: Empresa XYZ"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectSummary" className="text-gray-300">
                    Resumo do Projeto <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="projectSummary"
                    value={proposalData.projectSummary}
                    onChange={(e) => setProposalData(prev => ({ ...prev, projectSummary: e.target.value }))}
                    className="bg-white/5 border-purple-500/20 text-white min-h-[100px]"
                    placeholder="Descreva brevemente o projeto..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalBudget" className="text-gray-300">
                    Verba Total <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    value={proposalData.totalBudget}
                    onChange={(e) => setProposalData(prev => ({ ...prev, totalBudget: Number(e.target.value) }))}
                    className="bg-white/5 border-purple-500/20 text-white"
                    placeholder="0.00"
                  />
                  <p className="text-sm text-gray-400">
                    R$ {proposalData.totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </section>

              {/* 2. Fases do Projeto */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Fases do Projeto</h3>
                  <Button
                    onClick={addPhase}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Fase
                  </Button>
                </div>

                {proposalData.phases.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Nenhuma fase adicionada ainda</p>
                ) : (
                  <div className="space-y-4">
                    {proposalData.phases.map((phase, index) => (
                      <PhaseItem
                        key={phase.id}
                        phase={phase}
                        index={index}
                        onUpdate={updatePhase}
                        onDelete={removePhase}
                      />
                    ))}

                    {/* Gráfico de Distribuição de Verba por Fase - Lazy Loaded */}
                    {proposalData.phases.length > 0 && phaseChartData.some(d => d.value > 0) && (
                      <LazyPhaseChart phaseChartData={phaseChartData} CHART_COLORS={CHART_COLORS} />
                    )}
                  </div>
                )}
              </section>

              {/* 3. Custos Fixos */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Custos Fixos</h3>
                  <Button
                    onClick={addCost}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Custo
                  </Button>
                </div>

                {proposalData.fixedCosts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Nenhum custo fixo adicionado ainda</p>
                ) : (
                  <div className="space-y-4">
                    {proposalData.fixedCosts.map((cost, index) => (
                      <CostItem
                        key={cost.id}
                        cost={cost}
                        index={index}
                        onUpdate={updateCost}
                        onDelete={removeCost}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* 4. Benefícios Esperados */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Benefícios Esperados</h3>
                  <Button
                    onClick={addBenefit}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Benefício
                  </Button>
                </div>

                {proposalData.benefits.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Nenhum benefício adicionado ainda</p>
                ) : (
                  <div className="space-y-4">
                    {proposalData.benefits.map((benefit, index) => (
                      <BenefitItem
                        key={benefit.id}
                        benefit={benefit}
                        index={index}
                        onUpdate={updateBenefit}
                        onDelete={removeBenefit}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Rodapé com botões de ação */}
            <div className="sticky bottom-0 bg-[#1C1C26] border-t border-[rgba(139,92,246,0.1)] p-6 flex justify-end gap-4">
              <Button
                onClick={() => setShowProposalModal(false)}
                variant="outline"
                className="border-purple-500/20 text-white hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                onClick={generateProposalPage}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white"
              >
                {existingProposalId ? 'Atualizar Proposta' : 'Gerar Página de Proposta'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1C1C26] border border-green-500/30 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            {/* Ícone Sucesso Animado */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="text-green-400 animate-bounce" size={48} />
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {existingProposalId ? 'Proposta Atualizada! ✨' : 'Proposta Criada! 🎉'}
            </h2>
            <p className="text-gray-400 text-center mb-6">
              {existingProposalId 
                ? 'Suas alterações foram salvas com sucesso'
                : `Sua página de proposta está pronta para ser compartilhada com ${proposalData.clientName}`
              }
            </p>

            {/* Link */}
            <div className="bg-[#0F0F14] rounded-xl p-4 mb-6 border border-purple-500/20">
              <label className="text-xs text-gray-400 mb-2 block">Link da Proposta:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/proposta/${generatedSlug}`}
                  readOnly
                  className="flex-1 bg-transparent text-purple-400 text-sm outline-none truncate"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/proposta/${generatedSlug}`);
                    toast({
                      title: "Link copiado!",
                      description: "O link foi copiado para a área de transferência.",
                    });
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2 text-white text-sm font-medium"
                >
                  <Copy size={16} />
                  Copiar
                </button>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <a
                href={`/proposta/${generatedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                Visualizar Proposta
              </a>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setGeneratedSlug('');
                }}
                className="w-full px-6 py-3 bg-[#0F0F14] hover:bg-[#14141A] text-gray-300 rounded-xl font-medium transition-colors"
              >
                {existingProposalId ? 'Voltar aos Projetos' : 'Fechar'}
              </button>
            </div>

            {/* Dica */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
              <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-blue-300">
                {existingProposalId 
                  ? 'As alterações são refletidas imediatamente na página pública.'
                  : 'Compartilhe este link com seu cliente. Ele poderá visualizar a proposta sem fazer login.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
