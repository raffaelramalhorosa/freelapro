import { useState } from "react";
import { Calculator, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabNavigation } from "@/components/TabNavigation";
import { Calculator as CalculatorComponent } from "@/components/Calculator";
import { Projects } from "@/components/Projects";
import { Dashboard } from "@/components/Dashboard";

type TabType = "calculator" | "projects" | "dashboard";

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

interface MainAppProps {
  userName: string;
  userPlan: string;
  onLogout: () => void;
}

export const MainApp = ({ userName, userPlan, onLogout }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("calculator");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setActiveTab("calculator");
  };

  const handleEditComplete = () => {
    setEditingProject(null);
    setActiveTab("projects");
  };

  const handleNavigateToCalculator = () => {
    setEditingProject(null);
    setActiveTab("calculator");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "calculator":
        return (
          <CalculatorComponent
            editingProject={editingProject}
            onEditComplete={handleEditComplete}
          />
        );
      case "projects":
        return (
          <Projects
            onNavigateToCalculator={handleNavigateToCalculator}
            onEditProject={handleEditProject}
          />
        );
      case "dashboard":
        return <Dashboard />;
      default:
        return <CalculatorComponent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FreelaPro</h1>
                <p className="text-xs text-muted-foreground">
                  Precificação & Contratos Inteligentes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">
                  Plano: <span className="capitalize font-medium">{userPlan}</span>
                </p>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-8 pb-16 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
