import { useState, useEffect } from "react";
import { Calculator, AlertCircle, X } from "lucide-react";
import { TabNavigation } from "@/components/TabNavigation";
import { Calculator as CalculatorComponent } from "@/components/Calculator";
import { Projects } from "@/components/Projects";
import { Dashboard } from "@/components/Dashboard";
import { UserDropdown } from "@/components/UserDropdown";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
  userEmail: string;
  userPlan: string;
  trialEndsAt?: string;
  onLogout: () => void;
  onNavigateToPricing: () => void;
}

export const MainApp = ({ userName, userEmail, userPlan, trialEndsAt, onLogout, onNavigateToPricing }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("calculator");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showTrialBanner, setShowTrialBanner] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState("");

  // Check if trial has expired
  useEffect(() => {
    if (trialEndsAt && (userPlan.toLowerCase() === "pro" || userPlan.toLowerCase() === "business")) {
      const trialEndDate = new Date(trialEndsAt);
      const now = new Date();
      setShowTrialBanner(now > trialEndDate);
    }
  }, [trialEndsAt, userPlan]);

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

  const handleShowUpgradeModal = (featureName: string) => {
    setUpgradeFeatureName(featureName);
    setShowUpgradeModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "calculator":
        return (
          <CalculatorComponent
            editingProject={editingProject}
            onEditComplete={handleEditComplete}
            userPlan={userPlan}
            onNavigateToPricing={onNavigateToPricing}
          />
        );
      case "projects":
        return (
          <Projects
            onNavigateToCalculator={handleNavigateToCalculator}
            onEditProject={handleEditProject}
            userPlan={userPlan}
          />
        );
      case "dashboard":
        return <Dashboard userPlan={userPlan} />;
      default:
        return <CalculatorComponent userPlan={userPlan} onNavigateToPricing={onNavigateToPricing} />;
    }
  };

  return (
    <>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          onNavigateToPricing();
        }}
        featureName={upgradeFeatureName}
      />
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

            <UserDropdown
              userName={userName}
              userEmail={userEmail}
              userPlan={userPlan}
              onLogout={onLogout}
              onNavigateToPricing={onNavigateToPricing}
            />
          </div>
        </div>
      </header>

      {/* Trial Expired Banner */}
      {showTrialBanner && (
        <Alert className="mx-6 mt-4 border-amber-500 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between w-full">
            <span className="text-amber-800">
              Seu período de teste acabou. Adicione forma de pagamento para continuar.
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={onNavigateToPricing}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Adicionar Pagamento
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowTrialBanner(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <main className="container mx-auto px-6 pt-8 pb-16 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          {renderContent()}
        </div>
      </main>
      </div>
    </>
  );
};
