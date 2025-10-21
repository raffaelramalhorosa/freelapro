import { useState, useEffect } from "react";
import { LayoutDashboard, TrendingUp, FileText, Calculator, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export const Dashboard = ({ userPlan = "free" }: { userPlan?: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Carregar projetos do localStorage
  useEffect(() => {
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
      setProjects(loadedProjects);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }, []);

  // Calcular estatísticas
  const totalProjects = projects.length;
  const approvedProjects = projects.filter(p => p.status === "approved").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  
  const totalValue = projects
    .filter(p => p.status === "approved" || p.status === "completed")
    .reduce((sum, project) => sum + project.results.valorFinal, 0);

  const stats = [
    {
      label: "Total de Projetos",
      value: totalProjects.toString(),
      icon: Users,
      colorClass: "from-indigo-500/20 to-indigo-600/20",
      iconColor: "text-indigo-600",
    },
    {
      label: "Aprovados",
      value: approvedProjects.toString(),
      icon: TrendingUp,
      colorClass: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-600",
    },
    {
      label: "Concluídos",
      value: completedProjects.toString(),
      icon: FileText,
      colorClass: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-600",
    },
    {
      label: "Valor Total",
      value: `R$ ${totalValue.toFixed(2)}`,
      icon: Calculator,
      colorClass: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          Dashboard
        </h2>
        <p className="text-muted-foreground">Visão geral do seu negócio freelance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border-2 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardTitle>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.colorClass} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Resumo dos Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {projects.filter(p => p.status === "pending").length}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Aprovados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {approvedProjects}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Rejeitados</p>
                  <p className="text-2xl font-bold text-red-600">
                    {projects.filter(p => p.status === "rejected").length}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Concluídos</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {completedProjects}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Valor total em negociação:</span>
                  <span className="text-lg font-bold text-gray-900">
                    R$ {projects
                      .filter(p => p.status === "pending")
                      .reduce((sum, p) => sum + p.results.valorFinal, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor efetivado (aprovados + concluídos):</span>
                  <span className="text-lg font-bold text-green-600">
                    R$ {totalValue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Business Plan Message */}
              {userPlan.toLowerCase() === "business" && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-900 font-medium">
                    💼 Gerente de conta: <a href="mailto:contato@freelapro.com" className="text-purple-600 hover:underline">contato@freelapro.com</a>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                <LayoutDashboard className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">Nenhum projeto ainda</p>
              <p className="text-sm text-muted-foreground mt-1">
                Comece criando um projeto ou calculando um orçamento
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
