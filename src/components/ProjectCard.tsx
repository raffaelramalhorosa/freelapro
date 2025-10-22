import { memo, useState, useEffect } from "react";
import { Clock, FileText, Pencil, Trash2, Globe, ExternalLink, CheckCircle, Loader2, Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ProjectCardProps {
  project: Project;
  onStatusChange: (projectId: number, status: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
  onGenerateContract: (project: Project) => void;
  onCreateProposal: (project: Project) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { 
      label: "Pendente", 
      className: "bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] text-[#FCD34D] shadow-[0_0_15px_rgba(245,158,11,0.3)]"
    },
    approved: { 
      label: "Aprovado", 
      className: "bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#6EE7B7] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
    },
    rejected: { 
      label: "Rejeitado", 
      className: "bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#FCA5A5] shadow-[0_0_15px_rgba(239,68,68,0.3)]"
    },
    completed: { 
      label: "Concluído", 
      className: "bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] text-[#93C5FD] shadow-[0_0_15px_rgba(59,130,246,0.3)]"
    },
  };
  const config = statusConfig[status as keyof typeof statusConfig];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export const ProjectCard = memo<ProjectCardProps>(({ 
  project,
  onStatusChange, 
  onEdit, 
  onDelete, 
  onGenerateContract,
  onCreateProposal
}) => {
  const [hasProposal, setHasProposal] = useState(false);
  const [proposalSlug, setProposalSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingProposal();
  }, [project.id]);

  const checkExistingProposal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar proposta que corresponda ao nome do projeto e cliente
      const { data, error } = await supabase
        .from('proposals')
        .select('slug')
        .eq('user_id', user.id)
        .eq('project_name', project.projectName)
        .eq('client_name', project.clientName)
        .maybeSingle();

      if (data && !error) {
        setHasProposal(true);
        setProposalSlug(data.slug);
      } else {
        setHasProposal(false);
        setProposalSlug(null);
      }
    } catch (error) {
      console.log('Erro ao verificar proposta:', error);
      setHasProposal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#1C1C26] border border-[rgba(139,92,246,0.15)] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[rgba(139,92,246,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(139,92,246,0.2)] hover:-translate-y-1 transition-all duration-300 relative">
      <CardContent className="pt-6">
        {/* Badge de Proposta Ativa */}
        {hasProposal && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 px-2 py-1 bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] rounded-full text-[#10B981] text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <CheckCircle size={12} />
              <span className="font-medium">Com Proposta</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Informações do Projeto */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4 pr-32">
              <h3 className="text-2xl font-bold text-[#F3F4F6]">{project.projectName}</h3>
              {getStatusBadge(project.status)}
            </div>
            
            <div className="space-y-2 text-sm text-[#9CA3AF]">
              <p>
                <span className="font-medium text-[#D1D5DB]">Cliente:</span> {project.clientName}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-[#D1D5DB]">{project.serviceType}</span>
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>{project.hoursEstimated}h</span>
              </p>
            </div>
          </div>

          {/* Valor */}
          <div className="text-right lg:min-w-[200px]">
            <p className="text-3xl font-bold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.3)]">
              R$ {project.results.valorFinal.toFixed(2)}
            </p>
            <p className="text-sm text-[#9CA3AF] mt-1">
              R$ {project.results.valorHoraEfetivo.toFixed(2)}/hora
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[rgba(139,92,246,0.1)]">
          <div className="flex-1 min-w-[200px]">
            <Select
              value={project.status}
              onValueChange={(value) => onStatusChange(project.id, value)}
            >
              <SelectTrigger className="bg-[#0F0F14] border border-[rgba(139,92,246,0.2)] text-[#D1D5DB] rounded-lg focus:ring-[rgba(139,92,246,0.6)]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C26] border border-[rgba(139,92,246,0.2)] text-[#F3F4F6]">
                <SelectItem value="pending" className="hover:bg-[rgba(139,92,246,0.1)]">Pendente</SelectItem>
                <SelectItem value="approved" className="hover:bg-[rgba(139,92,246,0.1)]">Aprovado</SelectItem>
                <SelectItem value="rejected" className="hover:bg-[rgba(139,92,246,0.1)]">Rejeitado</SelectItem>
                <SelectItem value="completed" className="hover:bg-[rgba(139,92,246,0.1)]">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => onGenerateContract(project)}
            variant="outline"
            size="sm"
            className="bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10B981] hover:bg-[rgba(16,185,129,0.25)] hover:text-[#10B981]"
          >
            <FileText className="w-4 h-4 mr-2" />
            Contrato
          </Button>

          {loading ? (
            <Button
              disabled
              variant="outline"
              size="sm"
              className="bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#A855F7] opacity-50"
            >
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verificando...
            </Button>
          ) : hasProposal ? (
            <>
              <Button
                onClick={() => onCreateProposal(project)}
                variant="outline"
                size="sm"
                className="bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] text-[#3B82F6] hover:bg-[rgba(59,130,246,0.25)] hover:text-[#3B82F6]"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Página
              </Button>
              {proposalSlug && (
                <Button
                  onClick={() => window.open(`/proposta/${proposalSlug}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10B981] hover:bg-[rgba(16,185,129,0.25)] hover:text-[#10B981]"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Página
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={() => onCreateProposal(project)}
              variant="outline"
              size="sm"
              className="bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#A855F7] hover:bg-[rgba(139,92,246,0.25)] hover:text-[#A855F7]"
            >
              <Globe className="w-4 h-4 mr-2" />
              Criar Página
            </Button>
          )}

          <Button
            onClick={() => onEdit(project)}
            variant="outline"
            size="sm"
            className="bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] text-[#3B82F6] hover:bg-[rgba(59,130,246,0.25)] hover:text-[#3B82F6]"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>

          <Button
            onClick={() => onDelete(project.id)}
            variant="outline"
            size="sm"
            className="bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#EF4444] hover:bg-[rgba(239,68,68,0.25)] hover:text-[#EF4444]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ProjectCard.displayName = "ProjectCard";
