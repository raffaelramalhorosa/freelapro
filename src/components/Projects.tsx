import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { FolderKanban, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ProjectCard } from "@/components/ProjectCard";

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
    totalValue: 0,
    valueBreakdown: [],
    totalTime: 0,
    timeBreakdown: [],
    deliverables: [],
    paymentTerms: '50-50',
    startDate: '',
    endDate: '',
    revisions: 2,
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
      totalValue: project.results.valorFinal,
      valueBreakdown: [],
      totalTime: project.hoursEstimated,
      timeBreakdown: [],
      deliverables: [],
      paymentTerms: '50-50',
      startDate: '',
      endDate: '',
      revisions: 2,
    });
    setShowProposalModal(true);
  }, []);

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
          <div className="bg-[#1C1C26] border border-[rgba(139,92,246,0.2)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(139,92,246,0.1)]">
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
            <div className="p-6">
              <p className="text-gray-300">Formulário será adicionado nos próximos prompts</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
