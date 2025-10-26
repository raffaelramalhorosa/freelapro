import { useState, useEffect, lazy, Suspense } from "react";
import { Calculator, AlertCircle, X } from "lucide-react";
import { TabNavigation } from "@/components/TabNavigation";
import { UserDropdown } from "@/components/UserDropdown";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Lazy load tabs for better performance
const CalculatorComponent = lazy(() => import("@/components/Calculator").then(m => ({ default: m.Calculator })));
const Projects = lazy(() => import("@/components/Projects").then(m => ({ default: m.Projects })));
const Dashboard = lazy(() => import("@/components/Dashboard").then(m => ({ default: m.Dashboard })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {activeTab === "calculator" && (
          <CalculatorComponent
            editingProject={editingProject}
            onEditComplete={handleEditComplete}
            userPlan={userPlan}
            onNavigateToPricing={onNavigateToPricing}
          />
        )}
        {activeTab === "projects" && (
          <Projects
            onNavigateToCalculator={handleNavigateToCalculator}
            onEditProject={handleEditProject}
            userPlan={userPlan}
          />
        )}
        {activeTab === "dashboard" && <Dashboard userPlan={userPlan} />}
      </Suspense>
    );
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
      <div className="min-h-screen bg-[#0F0F14]">
      {/* Header */}
      <header className="bg-[#1C1C26] backdrop-blur-lg border-b border-[rgba(139,92,246,0.1)] sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#F3F4F6]">FreelaPro</h1>
                <p className="text-xs text-[#9CA3AF]">
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
