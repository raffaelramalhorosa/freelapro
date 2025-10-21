import { useState } from "react";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDropdownProps {
  userName: string;
  userEmail: string;
  userPlan: string;
  onLogout: () => void;
  onNavigateToPricing: () => void;
}

export const UserDropdown = ({
  userName,
  userEmail,
  userPlan,
  onLogout,
  onNavigateToPricing,
}: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlanBadgeClass = () => {
    switch (userPlan.toLowerCase()) {
      case "pro":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white";
      case "business":
        return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Plan Badge */}
      <Badge className={`${getPlanBadgeClass()} font-semibold px-3 py-1 shadow-md`}>
        {userPlan.toUpperCase()}
      </Badge>

      {/* User Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onNavigateToPricing} className="cursor-pointer">
            <CreditCard className="w-4 h-4 mr-2" />
            Meu Plano
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
