import { Calculator, FolderKanban, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "calculator" | "projects" | "dashboard";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "calculator" as TabType, label: "Calculadora", icon: Calculator },
  { id: "projects" as TabType, label: "Projetos", icon: FolderKanban },
  { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
];

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-border">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
