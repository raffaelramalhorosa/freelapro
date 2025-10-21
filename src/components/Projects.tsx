import { useState, useEffect } from "react";
import { FolderKanban, Plus, FileText, Pencil, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

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
}

export const Projects = ({ onNavigateToCalculator }: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);

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

  const handleStatusChange = (projectId: number, newStatus: string) => {
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
  };

  const handleDelete = (projectId: number) => {
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
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "bg-yellow-500 hover:bg-yellow-600" },
      approved: { label: "Aprovado", className: "bg-green-500 hover:bg-green-600" },
      rejected: { label: "Rejeitado", className: "bg-red-500 hover:bg-red-600" },
      completed: { label: "Concluído", className: "bg-blue-500 hover:bg-blue-600" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={`${config.className} text-white`}>{config.label}</Badge>;
  };

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Meus Projetos</h2>
            <p className="text-muted-foreground">Gerencie seus projetos freelance</p>
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
          <Card key={project.id} className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Informações do Projeto */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold text-foreground">{project.projectName}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Cliente:</span> {project.clientName}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{project.serviceType}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{project.hoursEstimated}h</span>
                    </p>
                  </div>
                </div>

                {/* Valor */}
                <div className="text-right lg:min-w-[200px]">
                  <p className="text-3xl font-bold text-primary">
                    R$ {project.results.valorFinal.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    R$ {project.results.valorHoraEfetivo.toFixed(2)}/hora
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
                <div className="flex-1 min-w-[200px]">
                  <Select
                    value={project.status}
                    onValueChange={(value) => handleStatusChange(project.id, value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Contrato
                </Button>

                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
