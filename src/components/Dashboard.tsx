import { LayoutDashboard, TrendingUp, DollarSign, Clock, FolderKanban } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  const stats = [
    {
      label: "Receita Total",
      value: "R$ 0,00",
      icon: DollarSign,
      description: "Este mês",
      trend: "+0%",
    },
    {
      label: "Projetos Ativos",
      value: "0",
      icon: FolderKanban,
      description: "Em andamento",
      trend: "0 novos",
    },
    {
      label: "Horas Trabalhadas",
      value: "0h",
      icon: Clock,
      description: "Esta semana",
      trend: "+0h",
    },
    {
      label: "Taxa Média/Hora",
      value: "R$ 0,00",
      icon: TrendingUp,
      description: "Média geral",
      trend: "+0%",
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description} • <span className="text-primary">{stat.trend}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Suas últimas ações no FreelaPro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Nenhuma atividade ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Comece criando um projeto ou calculando um orçamento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
