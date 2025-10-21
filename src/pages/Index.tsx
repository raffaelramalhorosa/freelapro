import { useState } from "react";
import { Header } from "@/components/Header";
import { TabNavigation } from "@/components/TabNavigation";
import { Calculator } from "@/components/Calculator";
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

const Index = () => {
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
          <Calculator 
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
        return <Calculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-16 max-w-7xl">
        <div className="mb-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
