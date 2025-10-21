import { useState } from "react";
import { Calculator, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

interface SignupPageProps {
  onNavigate: (page: string) => void;
  onSignup: (email: string, name: string, plan: string) => void;
}

export const SignupPage = ({ onNavigate, onSignup }: SignupPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { label: "", color: "" };
    if (pass.length < 6) return { label: "Fraca", color: "text-red-500" };
    if (pass.length < 10) return { label: "Média", color: "text-yellow-500" };
    return { label: "Forte", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simular cadastro (em produção, fazer chamada para API)
    setTimeout(() => {
      const now = new Date();
      const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias

      const userData = {
        id: now.getTime(),
        name,
        email,
        plan: selectedPlan,
        createdAt: now.toISOString(),
        trialEndsAt: selectedPlan !== "free" ? trialEndsAt.toISOString() : null,
      };

      localStorage.setItem("user:session", JSON.stringify(userData));
      
      onSignup(email, name, selectedPlan);
      
      toast({
        title: "Conta criada com sucesso!",
        description: selectedPlan !== "free" 
          ? `Bem-vindo ao FreelaPro! Seu período de teste de 7 dias começou.`
          : "Bem-vindo ao FreelaPro.",
      });
      
      onNavigate("app");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Crie sua conta grátis</CardTitle>
            <CardDescription>
              Comece a precificar melhor em menos de 1 minuto
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-primary pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <p className={`text-sm font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-primary pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium">Escolha seu plano</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  <div className="flex items-center space-x-2 p-3 rounded-md border hover:bg-accent transition-colors">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="flex-1 cursor-pointer">
                      <div className="font-medium">Free</div>
                      <div className="text-xs text-muted-foreground">Grátis</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md border hover:bg-accent transition-colors">
                    <RadioGroupItem value="pro" id="pro" />
                    <Label htmlFor="pro" className="flex-1 cursor-pointer">
                      <div className="font-medium">Pro</div>
                      <div className="text-xs text-muted-foreground">R$ 29/mês - 7 dias grátis</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md border hover:bg-accent transition-colors">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business" className="flex-1 cursor-pointer">
                      <div className="font-medium">Business</div>
                      <div className="text-xs text-muted-foreground">R$ 79/mês</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                >
                  Aceito os{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => toast({ title: "Em breve", description: "Termos de uso em desenvolvimento" })}
                  >
                    termos de uso
                  </button>
                  {" "}e{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => toast({ title: "Em breve", description: "Política de privacidade em desenvolvimento" })}
                  >
                    política de privacidade
                  </button>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 py-6 text-lg"
                disabled={isLoading || !acceptedTerms}
              >
                {isLoading ? "Criando conta..." : "Criar Conta Grátis"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">OU</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => toast({ title: "Em breve", description: "Cadastro com Google em desenvolvimento" })}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-black text-white hover:bg-black/90 hover:text-white"
                onClick={() => toast({ title: "Em breve", description: "Cadastro com GitHub em desenvolvimento" })}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continuar com GitHub
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <button
                  onClick={() => onNavigate("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
