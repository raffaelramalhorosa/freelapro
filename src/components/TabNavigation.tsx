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
    <div className="bg-[#1C1C26] backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-[rgba(139,92,246,0.15)]">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-[0_4px_15px_rgba(139,92,246,0.4)]"
                  : "text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[rgba(139,92,246,0.1)]"
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
