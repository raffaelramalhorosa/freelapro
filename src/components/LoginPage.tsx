import { useState } from "react";
import { Calculator, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedDotGrid } from "@/components/AnimatedDotGrid";
import { AnimatedGradient } from "@/components/AnimatedGradient";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
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
            <CardTitle className="text-3xl text-[#F3F4F6] font-bold">Bem-vindo de volta!</CardTitle>
            <CardDescription className="text-[#9CA3AF] text-base mt-2">
              Entre para continuar gerenciando seus projetos
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                    className="bg-[#0F0F14] border border-[rgba(139,92,246,0.25)] rounded-xl pl-12 pr-4 py-3.5 text-[#F3F4F6] text-base placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[4px] focus:ring-[rgba(139,92,246,0.1)] focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
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
                    className="bg-[#0F0F14] border border-[rgba(139,92,246,0.25)] rounded-xl pl-12 pr-12 py-3.5 text-[#F3F4F6] text-base placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[4px] focus:ring-[rgba(139,92,246,0.1)] focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-[rgba(139,92,246,0.4)] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#8B5CF6] data-[state=checked]:to-[#A855F7]"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-[#D1D5DB] cursor-pointer"
                  >
                    Lembrar de mim
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#8B5CF6] hover:text-[#A855F7] hover:underline transition-colors"
                  onClick={() => toast({ title: "Em breve", description: "Funcionalidade em desenvolvimento" })}
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-90 py-4 text-lg font-semibold rounded-xl shadow-[0_8px_24px_rgba(139,92,246,0.4)] transition-all hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)] disabled:opacity-80 disabled:cursor-wait"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
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
                onClick={() => toast({ title: "Em breve", description: "Login com Google em desenvolvimento" })}
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
                onClick={() => toast({ title: "Em breve", description: "Login com GitHub em desenvolvimento" })}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continuar com GitHub
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#9CA3AF]">
                Não tem uma conta?{" "}
                <button
                  onClick={() => onNavigate("signup")}
                  className="text-[#8B5CF6] hover:text-[#A855F7] hover:underline font-medium transition-colors"
                >
                  Criar conta
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};