import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { FolderKanban, Plus, X, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { ProjectCard } from "@/components/ProjectCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  // Carregar projetos do localStorage
  useEffect(() => {
    loadProjects();
  }, []);

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

  const openProposalModal = useCallback((project: Project) => {
    setSelectedProject(project);
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
    setShowProposalModal(true);
  }, []);

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

  // Calculate phase percentages for chart
  const phaseChartData = useMemo(() => {
    const totalPhaseBudget = proposalData.phases.reduce((sum, phase) => sum + phase.budget, 0);
    return proposalData.phases.map(phase => ({
      name: phase.name || 'Sem nome',
      value: phase.budget,
      percentage: totalPhaseBudget > 0 ? ((phase.budget / totalPhaseBudget) * 100).toFixed(1) : 0,
    }));
  }, [proposalData.phases]);

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

      {/* Modal de Proposta */}
      {showProposalModal && selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C26] border border-[rgba(139,92,246,0.2)] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(139,92,246,0.1)] sticky top-0 bg-[#1C1C26] z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">Criar Página de Proposta</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Configure sua proposta profissional para {selectedProject.clientName}
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
                      <Card key={phase.id} className="bg-white/5 border-purple-500/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-white text-lg">Fase {index + 1}</CardTitle>
                            <Button
                              onClick={() => removePhase(phase.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300">Nome da Fase *</Label>
                              <Input
                                value={phase.name}
                                onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
                                className="bg-white/5 border-purple-500/20 text-white"
                                placeholder="Ex: Planejamento"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300">Duração</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={phase.duration}
                                  onChange={(e) => updatePhase(phase.id, 'duration', Number(e.target.value))}
                                  className="bg-white/5 border-purple-500/20 text-white"
                                  placeholder="0"
                                />
                                <Select
                                  value={phase.durationUnit}
                                  onValueChange={(value) => updatePhase(phase.id, 'durationUnit', value)}
                                >
                                  <SelectTrigger className="bg-white/5 border-purple-500/20 text-white w-[120px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="dias">Dias</SelectItem>
                                    <SelectItem value="semanas">Semanas</SelectItem>
                                    <SelectItem value="meses">Meses</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300">Resumo da Fase</Label>
                            <Textarea
                              value={phase.summary}
                              onChange={(e) => updatePhase(phase.id, 'summary', e.target.value)}
                              className="bg-white/5 border-purple-500/20 text-white min-h-[80px]"
                              placeholder="Descreva as atividades desta fase..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300">Data Inicial</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal bg-white/5 border-purple-500/20 text-white hover:bg-white/10",
                                      !phase.startDate && "text-gray-400"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {phase.startDate ? format(phase.startDate, "dd/MM/yyyy") : "Selecione"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={phase.startDate}
                                    onSelect={(date) => updatePhase(phase.id, 'startDate', date)}
                                    initialFocus
                                    className="pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-300">Data Final</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal bg-white/5 border-purple-500/20 text-white hover:bg-white/10",
                                      !phase.endDate && "text-gray-400"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {phase.endDate ? format(phase.endDate, "dd/MM/yyyy") : "Selecione"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={phase.endDate}
                                    onSelect={(date) => updatePhase(phase.id, 'endDate', date)}
                                    initialFocus
                                    className="pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-300">Verba da Fase *</Label>
                              <Input
                                type="number"
                                value={phase.budget}
                                onChange={(e) => updatePhase(phase.id, 'budget', Number(e.target.value))}
                                className="bg-white/5 border-purple-500/20 text-white"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Gráfico de Distribuição de Verba por Fase */}
                    {proposalData.phases.length > 0 && phaseChartData.some(d => d.value > 0) && (
                      <Card className="bg-white/5 border-purple-500/20">
                        <CardHeader>
                          <CardTitle className="text-white">Distribuição de Verba por Fase</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={phaseChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {phaseChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
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
                      <Card key={cost.id} className="bg-white/5 border-purple-500/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-white text-lg">Custo {index + 1}</CardTitle>
                            <Button
                              onClick={() => removeCost(cost.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300">Nome do Custo *</Label>
                              <Input
                                value={cost.name}
                                onChange={(e) => updateCost(cost.id, 'name', e.target.value)}
                                className="bg-white/5 border-purple-500/20 text-white"
                                placeholder="Ex: Hospedagem"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300">Valor *</Label>
                              <Input
                                type="number"
                                value={cost.value}
                                onChange={(e) => updateCost(cost.id, 'value', Number(e.target.value))}
                                className="bg-white/5 border-purple-500/20 text-white"
                                placeholder="0.00"
                              />
                              <p className="text-sm text-gray-400">
                                R$ {cost.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">Descrição</Label>
                            <Textarea
                              value={cost.description}
                              onChange={(e) => updateCost(cost.id, 'description', e.target.value)}
                              className="bg-white/5 border-purple-500/20 text-white min-h-[60px]"
                              placeholder="Descreva o custo..."
                            />
                          </div>
                        </CardContent>
                      </Card>
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
                      <Card key={benefit.id} className="bg-white/5 border-purple-500/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-white text-lg">Benefício {index + 1}</CardTitle>
                            <Button
                              onClick={() => removeBenefit(benefit.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Nome do Benefício *</Label>
                            <Input
                              value={benefit.name}
                              onChange={(e) => updateBenefit(benefit.id, 'name', e.target.value)}
                              className="bg-white/5 border-purple-500/20 text-white"
                              placeholder="Ex: Aumento de conversão"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">Descrição</Label>
                            <Textarea
                              value={benefit.description}
                              onChange={(e) => updateBenefit(benefit.id, 'description', e.target.value)}
                              className="bg-white/5 border-purple-500/20 text-white min-h-[60px]"
                              placeholder="Descreva o benefício esperado..."
                            />
                          </div>
                        </CardContent>
                      </Card>
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
                onClick={() => {
                  // TODO: Implement proposal generation
                  toast({
                    title: "Em desenvolvimento",
                    description: "A geração da página de proposta será implementada em breve.",
                  });
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white"
              >
                Gerar Página de Proposta
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
