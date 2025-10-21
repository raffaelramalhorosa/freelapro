import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { LoginPage } from "@/components/LoginPage";
import { SignupPage } from "@/components/SignupPage";
import { PricingPage } from "@/components/PricingPage";
import { MainApp } from "@/components/MainApp";
import { OnboardingModal } from "@/components/OnboardingModal";
import { toast } from "@/hooks/use-toast";

type Page = "landing" | "login" | "signup" | "pricing" | "app";

interface UserSession {
  name: string;
  email: string;
  plan: "free" | "pro" | "business";
  trialEndsAt?: string;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [user, setUser] = useState<UserSession | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
      
      // Check if user has seen onboarding
      const hasSeenOnboarding = localStorage.getItem(`user:${userData.email}:onboarding`);
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  };

  const handleSignup = (email: string, name: string, plan: string) => {
    const userData: UserSession = {
      name,
      email,
      plan: plan as "free" | "pro" | "business",
    };
    setUser(userData);
    
    // Show onboarding for new users
    setShowOnboarding(true);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    if (user) {
      localStorage.setItem(`user:${user.email}:onboarding`, "true");
    }
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

  const handleNavigateToPricing = () => {
    setCurrentPage("pricing");
  };

  // Roteamento
  return (
    <>
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      {renderPage()}
    </>
  );

  function renderPage() {
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
        userEmail={user.email}
        userPlan={user.plan}
        trialEndsAt={user.trialEndsAt}
        onLogout={handleLogout}
        onNavigateToPricing={handleNavigateToPricing}
      />
    );
  }

  // Fallback - redirecionar para landing ou app baseado na autenticação
  if (user) {
    return (
      <MainApp
        userName={user.name}
        userEmail={user.email}
        userPlan={user.plan}
        trialEndsAt={user.trialEndsAt}
        onLogout={handleLogout}
        onNavigateToPricing={handleNavigateToPricing}
      />
    );
  }

    return <LandingPage onNavigate={handleNavigate} />;
  }
};

export default Index;
