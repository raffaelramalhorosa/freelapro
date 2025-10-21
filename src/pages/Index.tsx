import { useState } from "react";
import { Header } from "@/components/Header";
import { TabNavigation } from "@/components/TabNavigation";
import { Calculator } from "@/components/Calculator";
import { Projects } from "@/components/Projects";
import { Dashboard } from "@/components/Dashboard";

type TabType = "calculator" | "projects" | "dashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("calculator");

  const renderContent = () => {
    switch (activeTab) {
      case "calculator":
        return <Calculator />;
      case "projects":
        return <Projects />;
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
