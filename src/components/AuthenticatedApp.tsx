import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MainApp } from "./MainApp";
import { OnboardingModal } from "./OnboardingModal";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

interface AuthenticatedAppProps {
  onLogout: () => void;
  onNavigateToPricing: () => void;
}

export const AuthenticatedApp = ({ onLogout, onNavigateToPricing }: AuthenticatedAppProps) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { plan, subscriptionEnd } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      setUserEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setUserName(profile.name);
      }

      // Check if user has seen onboarding
      const hasSeenOnboarding = localStorage.getItem(`user:${user.email}:onboarding`);
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    if (userEmail) {
      localStorage.setItem(`user:${userEmail}:onboarding`, "true");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    toast({
      title: "Até logo!",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <>
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      <MainApp
        userName={userName}
        userEmail={userEmail}
        userPlan={plan}
        trialEndsAt={subscriptionEnd}
        onLogout={handleLogout}
        onNavigateToPricing={onNavigateToPricing}
      />
    </>
  );
};
