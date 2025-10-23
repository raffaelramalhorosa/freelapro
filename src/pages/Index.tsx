import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

// Lazy loading dos componentes principais
const LandingPage = lazy(() => import("@/components/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("@/components/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("@/components/SignupPage").then(m => ({ default: m.SignupPage })));
const PricingPage = lazy(() => import("@/components/PricingPage").then(m => ({ default: m.PricingPage })));
const AuthenticatedApp = lazy(() => import("@/components/AuthenticatedApp").then(m => ({ default: m.AuthenticatedApp })));

type Page = "landing" | "login" | "signup" | "pricing" | "app";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setCurrentPage("app");
      } else if (event === "SIGNED_OUT") {
        setCurrentPage("landing");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        setCurrentPage("app");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("landing");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleNavigateToPricing = () => {
    setCurrentPage("pricing");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Roteamento
  return (
    <SubscriptionProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        {renderPage()}
      </Suspense>
    </SubscriptionProvider>
  );

  function renderPage() {
    if (currentPage === "landing" && !isAuthenticated) {
      return <LandingPage onNavigate={handleNavigate} />;
    }

    if (currentPage === "login" && !isAuthenticated) {
      return <LoginPage onNavigate={handleNavigate} />;
    }

    if (currentPage === "signup" && !isAuthenticated) {
      return <SignupPage onNavigate={handleNavigate} />;
    }

    if (currentPage === "pricing") {
      return <PricingPage onNavigate={handleNavigate} />;
    }

    if (isAuthenticated) {
      return (
        <AuthenticatedApp
          onLogout={handleLogout}
          onNavigateToPricing={handleNavigateToPricing}
        />
      );
    }

    // Fallback - redirecionar para landing
    return <LandingPage onNavigate={handleNavigate} />;
  }
};

export default Index;
