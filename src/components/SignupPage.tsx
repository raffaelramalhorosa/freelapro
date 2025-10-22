import { useState } from "react";
import { Calculator, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedDotGrid } from "@/components/AnimatedDotGrid";
import { AnimatedGradient } from "@/components/AnimatedGradient";

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export const SignupPage = ({ onNavigate }: SignupPageProps) => {
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
    if (pass.length === 0) return { label: "", color: "", bars: 0 };
    if (pass.length < 6) return { label: "Fraca", color: "#EF4444", bars: 2 };
    if (pass.length < 10) return { label: "Média", color: "#F59E0B", bars: 3 };
    return { label: "Forte", color: "#10B981", bars: 4 };
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

    if (!acceptedTerms) {
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            plan: selectedPlan,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao FreelaPro.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro no cadastro social",
        description: error.message || "Não foi possível conectar com o provedor.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <AnimatedDotGrid />
      </div>
      <div className="absolute inset-0 z-0">
        <AnimatedGradient />
      </div>
      
      <div className="w-full max-w-lg animate-fade-in relative z-10">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#F3F4F6] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <Card className="bg-[rgba(28,28,38,0.8)] backdrop-blur-[20px] border border-[rgba(139,92,246,0.2)] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(139,92,246,0.15)]">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(139,92,246,0.4)]">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl text-[#F3F4F6] font-bold">Crie sua conta grátis</CardTitle>
            <CardDescription className="text-[#9CA3AF] text-base mt-2">
              Comece a precificar melhor em menos de 1 minuto
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-[#D1D5DB] font-medium">
                  <User className="w-4 h-4 text-[#8B5CF6]" />
                  Nome completo
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5CF6] z-10">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#0F0F14] border border-[rgba(139,92,246,0.25)] rounded-xl pl-12 pr-4 py-3.5 text-[#F3F4F6] text-base placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[4px] focus:ring-[rgba(139,92,246,0.1)] transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-[#D1D5DB] font-medium">
                  <Mail className="w-4 h-4 text-[#8B5CF6]" />
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5CF6] z-10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#0F0F14] border border-[rgba(139,92,246,0.25)] rounded-xl pl-12 pr-4 py-3.5 text-[#F3F4F6] text-base placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[4px] focus:ring-[rgba(139,92,246,0.1)] transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-[#D1D5DB] font-medium">
                  <Lock className="w-4 h-4 text-[#8B5CF6]" />
                  Senha
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5CF6] z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#0F0F14] border border-[rgba(139,92,246,0.25)] rounded-xl pl-12 pr-12 py-3.5 text-[#F3F4F6] text-base placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[4px] focus:ring-[rgba(139,92,246,0.1)] transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-sm transition-all ${
                            i < passwordStrength.bars
                              ? `shadow-[0_0_10px_${passwordStrength.color}]`
                              : 'bg-[rgba(139,92,246,0.2)]'
                          }`}
                          style={{ backgroundColor: i < passwordStrength.bars ? passwordStrength.color : undefined }}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-[#D1D5DB] font-medium">
                  <Lock className="w-4 h-4 text-[#8B5CF6]" />
                  Confirmar senha
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5CF6] z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#0F0F14] border border-[rgba(139,92,246,0.25)] rounded-xl pl-12 pr-12 py-3.5 text-[#F3F4F6] text-base placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[4px] focus:ring-[rgba(139,92,246,0.1)] transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-[rgba(139,92,246,0.05)] rounded-xl border border-[rgba(139,92,246,0.1)]">
                <Label className="text-base font-medium text-[#D1D5DB]">Escolha seu plano</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-2">
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPlan === "free" ? "border-2 border-[#8B5CF6] bg-[rgba(139,92,246,0.1)] shadow-[0_0_20px_rgba(139,92,246,0.2)]" : "border-[rgba(139,92,246,0.2)] hover:bg-[rgba(139,92,246,0.05)]"
                  }`}>
                    <RadioGroupItem value="free" id="free" className="border-[rgba(139,92,246,0.4)]" />
                    <Label htmlFor="free" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#F3F4F6] text-base">Free</div>
                      <div className="text-sm text-[#10B981]">Grátis</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPlan === "pro" ? "border-2 border-[#8B5CF6] bg-[rgba(139,92,246,0.1)] shadow-[0_0_20px_rgba(139,92,246,0.2)]" : "border-[rgba(139,92,246,0.2)] hover:bg-[rgba(139,92,246,0.05)]"
                  }`}>
                    <RadioGroupItem value="pro" id="pro" className="border-[rgba(139,92,246,0.4)]" />
                    <Label htmlFor="pro" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#F3F4F6] text-base">Pro</div>
                      <div className="text-sm text-[#9CA3AF]">R$ 29/mês - 7 dias grátis</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPlan === "business" ? "border-2 border-[#8B5CF6] bg-[rgba(139,92,246,0.1)] shadow-[0_0_20px_rgba(139,92,246,0.2)]" : "border-[rgba(139,92,246,0.2)] hover:bg-[rgba(139,92,246,0.05)]"
                  }`}>
                    <RadioGroupItem value="business" id="business" className="border-[rgba(139,92,246,0.4)]" />
                    <Label htmlFor="business" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#F3F4F6] text-base">Business</div>
                      <div className="text-sm text-[#9CA3AF]">R$ 79/mês</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="mt-0.5 border-[rgba(139,92,246,0.4)] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#8B5CF6] data-[state=checked]:to-[#A855F7]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[#D1D5DB] cursor-pointer leading-relaxed"
                >
                  Aceito os{" "}
                  <button
                    type="button"
                    className="text-[#8B5CF6] hover:text-[#A855F7] hover:underline"
                    onClick={() => toast({ title: "Em breve", description: "Termos de uso em desenvolvimento" })}
                  >
                    termos de uso
                  </button>
                  {" "}e{" "}
                  <button
                    type="button"
                    className="text-[#8B5CF6] hover:text-[#A855F7] hover:underline"
                    onClick={() => toast({ title: "Em breve", description: "Política de privacidade em desenvolvimento" })}
                  >
                    política de privacidade
                  </button>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-90 py-4 text-lg font-semibold rounded-xl shadow-[0_8px_24px_rgba(139,92,246,0.4)] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !acceptedTerms}
              >
                {isLoading ? "Criando conta..." : "Criar Conta Grátis"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[rgba(139,92,246,0.2)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1C1C26] px-2 text-[#6B7280]">OU</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#F3F4F6] hover:bg-[rgba(255,255,255,0.1)] rounded-xl py-3"
                onClick={() => handleSocialLogin('google')}
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
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#F3F4F6] hover:bg-[rgba(255,255,255,0.1)] rounded-xl py-3"
                onClick={() => handleSocialLogin('github')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continuar com GitHub
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#9CA3AF]">
                Já tem uma conta?{" "}
                <button
                  onClick={() => onNavigate("login")}
                  className="text-[#8B5CF6] hover:text-[#A855F7] hover:underline font-medium transition-colors"
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