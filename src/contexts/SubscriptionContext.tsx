import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionContextType {
  plan: "free" | "pro" | "business";
  subscriptionEnd: string | null;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Mapeamento de price IDs
export const STRIPE_PRICES = {
  pro_monthly: "price_1SKkMPCFtQSgOuc3G43FcNOt",
  pro_annual: "price_1SKkNUCFtQSgOuc3ZnYG883m",
  business_monthly: "price_1SKkNuCFtQSgOuc3fjJ9cEZW",
  business_annual: "price_1SKkOBCFtQSgOuc3fJp4NCVw",
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<"free" | "pro" | "business">("free");
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setPlan("free");
        setSubscriptionEnd(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");

      if (error) throw error;

      setPlan(data.plan || "free");
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setPlan("free");
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async (priceId: string) => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Autenticação necessária",
          description: "Você precisa estar logado para assinar um plano.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao criar a sessão de checkout. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast({
        title: "Erro ao abrir portal",
        description: "Ocorreu um erro ao abrir o portal do cliente. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar assinatura ao montar e quando houver mudança de autenticação
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        checkSubscription();
      } else if (event === "SIGNED_OUT") {
        setPlan("free");
        setSubscriptionEnd(null);
      }
    });

    checkSubscription();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Verificar periodicamente (a cada 60 segundos)
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        checkSubscription();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        subscriptionEnd,
        isLoading,
        checkSubscription,
        createCheckout,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
