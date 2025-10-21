import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { LoginPage } from "@/components/LoginPage";
import { SignupPage } from "@/components/SignupPage";
import { PricingPage } from "@/components/PricingPage";
import { MainApp } from "@/components/MainApp";
import { toast } from "@/hooks/use-toast";

type Page = "landing" | "login" | "signup" | "pricing" | "app";

interface UserSession {
  name: string;
  email: string;
  plan: "free" | "pro" | "business";
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [user, setUser] = useState<UserSession | null>(null);

  // Carregar sessão do usuário ao iniciar
  useEffect(() => {
    const storedSession = localStorage.getItem("user:session");
    if (storedSession) {
      try {
        const userData = JSON.parse(storedSession);
        setUser(userData);
        setCurrentPage("app");
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
        localStorage.removeItem("user:session");
      }
    }
  }, []);

  const handleLogin = (email: string, plan: string) => {
    const storedUser = localStorage.getItem("user:session");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  };

  const handleSignup = (email: string, name: string, plan: string) => {
    const userData: UserSession = {
      name,
      email,
      plan: plan as "free" | "pro" | "business",
    };
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user:session");
    setUser(null);
    setCurrentPage("landing");
    toast({
      title: "Até logo!",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  // Roteamento
  if (currentPage === "landing" && !user) {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "login" && !user) {
    return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  if (currentPage === "signup" && !user) {
    return <SignupPage onNavigate={handleNavigate} onSignup={handleSignup} />;
  }

  if (currentPage === "pricing") {
    return <PricingPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "app" && user) {
    return (
      <MainApp
        userName={user.name}
        userPlan={user.plan}
        onLogout={handleLogout}
      />
    );
  }

  // Fallback - redirecionar para landing ou app baseado na autenticação
  if (user) {
    return (
      <MainApp
        userName={user.name}
        userPlan={user.plan}
        onLogout={handleLogout}
      />
    );
  }

  return <LandingPage onNavigate={handleNavigate} />;
};

export default Index;
