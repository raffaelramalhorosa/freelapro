import { useState, useEffect, useMemo } from "react";
import { LayoutDashboard, TrendingUp, FileText, Calculator, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  id: string;
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

  // Carregar projetos do Supabase
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar projetos:", error);
        return;
      }

      const loadedProjects: Project[] = (data || []).map((project) => ({
        id: project.id,
        clientName: project.client_name,
        projectName: project.project_name,
        serviceType: project.service_type || "",
        hoursEstimated: Number(project.hours_estimated),
        desiredHourlyRate: Number(project.desired_hourly_rate),
        fixedCosts: Number(project.fixed_costs),
        variableCosts: Number(project.variable_costs),
        taxType: project.tax_type,
        profitMargin: Number(project.profit_margin),
        results: project.results as unknown as CalculatedResults,
        status: project.status as "pending" | "approved" | "rejected" | "completed",
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }));

      setProjects(loadedProjects);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };

  // Calcular estatísticas com useMemo
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const approvedProjects = projects.filter(p => p.status === "approved").length;
    const completedProjects = projects.filter(p => p.status === "completed").length;
    
    const totalValue = projects
      .filter(p => p.status === "approved" || p.status === "completed")
      .reduce((sum, project) => sum + project.results.valorFinal, 0);
    
    const pendingValue = projects
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + p.results.valorFinal, 0);
    
    const pendingCount = projects.filter(p => p.status === "pending").length;
    const rejectedCount = projects.filter(p => p.status === "rejected").length;
    
    return {
      totalProjects,
      approvedProjects,
      completedProjects,
      totalValue,
      pendingValue,
      pendingCount,
      rejectedCount,
    };
  }, [projects]);

  const statCards = useMemo(() => [
    {
      label: "Total de Projetos",
      value: stats.totalProjects.toString(),
      icon: Users,
      colorClass: "from-indigo-500/20 to-indigo-600/20",
      iconColor: "text-indigo-600",
    },
    {
      label: "Aprovados",
      value: stats.approvedProjects.toString(),
      icon: TrendingUp,
      colorClass: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-600",
    },
    {
      label: "Concluídos",
      value: stats.completedProjects.toString(),
      icon: FileText,
      colorClass: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-600",
    },
    {
      label: "Valor Total",
      value: `R$ ${stats.totalValue.toFixed(2)}`,
      icon: Calculator,
      colorClass: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-600",
    },
  ], [stats]);

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
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card border-2 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
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

      <Card className="border-2 shadow-sm bg-card">
        <CardHeader>
          <CardTitle>Resumo dos Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg bg-card border border-yellow-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.pendingCount}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-green-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Aprovados</p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.approvedProjects}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-red-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Rejeitados</p>
                  <p className="text-2xl font-bold text-red-400">
                    {stats.rejectedCount}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-blue-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Concluídos</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {stats.completedProjects}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Valor total em negociação:</span>
                  <span className="text-lg font-bold text-gray-900">
                    R$ {stats.pendingValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor efetivado (aprovados + concluídos):</span>
                  <span className="text-lg font-bold text-green-600">
                    R$ {stats.totalValue.toFixed(2)}
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
