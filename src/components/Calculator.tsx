import { useState, useEffect } from "react";
import { DollarSign, Clock, Briefcase, TrendingUp, Calculator as CalculatorIcon, User, FileText, Percent, Save, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/formatters";
import { PlanLimitModal } from "@/components/PlanLimitModal";
import { supabase } from "@/integrations/supabase/client";

const serviceTypes = [
  "Design Gráfico",
  "Desenvolvimento",
  "Marketing Digital",
  "Consultoria",
  "Redação/Copywriting",
  "Edição de Vídeo",
];

const taxRegimes = [
  { label: "MEI (6%)", value: "mei", rate: 0.06 },
  { label: "Simples Nacional (15.5%)", value: "simples", rate: 0.155 },
  { label: "Lucro Presumido (13.5%)", value: "presumido", rate: 0.135 },
];

interface CalculatedResults {
  valorBase: number;
  custosTotais: number;
  subtotal: number;
  lucro: number;
  antesImpostos: number;
  impostos: number;
  valorFinal: number;
  valorHoraEfetivo: number;
}

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  serviceType: string;
  hoursEstimated: number;
  desiredHourlyRate: number;
  fixedCosts: number;
  variableCosts: number;
  taxType: string;
  profitMargin: number;
  results: CalculatedResults;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface CalculatorProps {
  editingProject?: Project | null;
  onEditComplete?: () => void;
  userPlan?: string;
  onNavigateToPricing?: () => void;
}

export const Calculator = ({ editingProject, onEditComplete, userPlan = "free", onNavigateToPricing }: CalculatorProps) => {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCosts, setVariableCosts] = useState("");
  const [taxRegime, setTaxRegime] = useState("");
  const [profitMargin, setProfitMargin] = useState([20]);
  const [calculatedResults, setCalculatedResults] = useState<CalculatedResults | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Validar campos obrigatórios
  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!estimatedHours || parseFloat(estimatedHours) <= 0) {
      newErrors.estimatedHours = "Horas estimadas são obrigatórias";
    }
    if (!hourlyRate || parseFloat(hourlyRate) <= 0) {
      newErrors.hourlyRate = "Valor por hora é obrigatório";
    }
    if (!taxRegime) {
      newErrors.taxRegime = "Selecione um regime tributário";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isCalculateDisabled = !estimatedHours || !hourlyRate || !taxRegime;

  // Carregar dados do projeto para edição
  useEffect(() => {
    if (editingProject) {
      setClientName(editingProject.clientName);
      setProjectName(editingProject.projectName);
      setServiceType(editingProject.serviceType);
      setEstimatedHours(editingProject.hoursEstimated.toString());
      setHourlyRate(editingProject.desiredHourlyRate.toString());
      setFixedCosts(editingProject.fixedCosts.toString());
      setVariableCosts(editingProject.variableCosts.toString());
      setTaxRegime(editingProject.taxType);
      setProfitMargin([editingProject.profitMargin]);
      setCalculatedResults(editingProject.results);
      setCurrentEditingId(editingProject.id);
    }
  }, [editingProject]);

  // Carregar projetos do Supabase ao montar o componente
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProjects = data?.map(p => ({
        id: p.id,
        clientName: p.client_name,
        projectName: p.project_name,
        serviceType: p.service_type || '',
        hoursEstimated: Number(p.hours_estimated),
        desiredHourlyRate: Number(p.desired_hourly_rate),
        fixedCosts: Number(p.fixed_costs),
        variableCosts: Number(p.variable_costs),
        taxType: p.tax_type,
        profitMargin: Number(p.profit_margin),
        results: p.results as unknown as CalculatedResults,
        status: p.status as "pending" | "approved" | "rejected" | "completed",
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      })) || [];

      setProjects(mappedProjects);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos.",
        variant: "destructive",
      });
    }
  };

  const handleCalculate = () => {
    if (!validateFields()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de calcular.",
        variant: "destructive",
      });
      return;
    }

    const hours = parseFloat(estimatedHours) || 0;
    const rate = parseFloat(hourlyRate) || 0;
    const fixed = parseFloat(fixedCosts) || 0;
    const variable = parseFloat(variableCosts) || 0;
    const margin = profitMargin[0] / 100;
    
    const selectedTaxRegime = taxRegimes.find(t => t.value === taxRegime);
    const taxRate = selectedTaxRegime?.rate || 0;

    // Cálculos conforme especificado
    const valorBase = hours * rate;
    const custosTotais = fixed + variable;
    const subtotal = valorBase + custosTotais;
    const lucro = subtotal * margin;
    const antesImpostos = subtotal + lucro;
    const impostos = antesImpostos * taxRate;
    const valorFinal = antesImpostos + impostos;
    const valorHoraEfetivo = hours > 0 ? valorFinal / hours : 0;

    setCalculatedResults({
      valorBase,
      custosTotais,
      subtotal,
      lucro,
      antesImpostos,
      impostos,
      valorFinal,
      valorHoraEfetivo,
    });
  };

  const handleSaveProject = async () => {
    if (!clientName.trim() || !projectName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente e do projeto são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!calculatedResults) {
      toast({
        title: "Erro",
        description: "Calcule o preço antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para salvar projetos.",
          variant: "destructive",
        });
        return;
      }

      if (currentEditingId) {
        // Modo de edição - atualizar projeto existente
        const { error } = await supabase
          .from('projects')
          .update({
            client_name: clientName,
            project_name: projectName,
            service_type: serviceType,
            hours_estimated: parseFloat(estimatedHours) || 0,
            desired_hourly_rate: parseFloat(hourlyRate) || 0,
            fixed_costs: parseFloat(fixedCosts) || 0,
            variable_costs: parseFloat(variableCosts) || 0,
            tax_type: taxRegime,
            profit_margin: profitMargin[0],
            results: calculatedResults as unknown as any,
          })
          .eq('id', currentEditingId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Projeto atualizado com sucesso.",
        });

        // Limpar formulário e sair do modo de edição
        handleCancel();
        
        // Recarregar projetos
        await loadProjects();
        
        // Voltar para a tab de projetos
        if (onEditComplete) {
          onEditComplete();
        }
      } else {
        // Modo de criação - novo projeto
        // Check plan limits
        if (userPlan.toLowerCase() === "free" && projects.length >= 5) {
          setShowLimitModal(true);
          return;
        }

        const { error } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            client_name: clientName,
            project_name: projectName,
            service_type: serviceType,
            hours_estimated: parseFloat(estimatedHours) || 0,
            desired_hourly_rate: parseFloat(hourlyRate) || 0,
            fixed_costs: parseFloat(fixedCosts) || 0,
            variable_costs: parseFloat(variableCosts) || 0,
            tax_type: taxRegime,
            profit_margin: profitMargin[0],
            results: calculatedResults as unknown as any,
            status: "pending",
          });

        if (error) throw error;

        // Recarregar projetos
        await loadProjects();
        
        toast({
          title: "Sucesso!",
          description: "Projeto salvo com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o projeto.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Limpar todos os campos do formulário
    setClientName("");
    setProjectName("");
    setServiceType("");
    setEstimatedHours("");
    setHourlyRate("");
    setFixedCosts("");
    setVariableCosts("");
    setTaxRegime("");
    setProfitMargin([20]);
    setCalculatedResults(null);
    setCurrentEditingId(null);
  };

  return (
    <>
      <PlanLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onUpgrade={() => {
          setShowLimitModal(false);
          if (onNavigateToPricing) {
            onNavigateToPricing();
          }
        }}
      />
      <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-[#1C1C26] border border-[rgba(139,92,246,0.15)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-[#F3F4F6] font-bold">
            <CalculatorIcon className="w-6 h-6 text-[#8B5CF6]" />
            Novo Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cliente e Projeto */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name" className="text-[#D1D5DB] text-sm font-medium tracking-wide flex items-center gap-2">
                <User className="w-4 h-4 text-[#8B5CF6] opacity-60" />
                Nome do Cliente
              </Label>
              <Input
                id="client-name"
                type="text"
                placeholder="Ex: João Silva"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-[#0F0F14] border border-[rgba(139,92,246,0.2)] rounded-xl px-4 py-3 text-[#F3F4F6] placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.1)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-[#D1D5DB] text-sm font-medium tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8B5CF6] opacity-60" />
                Nome do Projeto
              </Label>
              <Input
                id="project-name"
                type="text"
                placeholder="Ex: Website Institucional"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-[#0F0F14] border border-[rgba(139,92,246,0.2)] rounded-xl px-4 py-3 text-[#F3F4F6] placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.1)]"
              />
            </div>
          </div>

          {/* Tipo de Serviço */}
          <div className="space-y-2">
            <Label htmlFor="service-type" className="text-[#D1D5DB] text-sm font-medium tracking-wide flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#8B5CF6] opacity-60" />
              Tipo de Serviço
            </Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="bg-[#0F0F14] border border-[rgba(139,92,246,0.2)] rounded-xl px-4 py-3 text-[#F3F4F6] focus:border-[rgba(139,92,246,0.6)] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.1)]">
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C26] border border-[rgba(139,92,246,0.2)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50">
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-[#F3F4F6] hover:bg-[rgba(139,92,246,0.15)] focus:bg-[rgba(139,92,246,0.25)]">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Horas e Valor */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated-hours" className="text-[#D1D5DB] text-sm font-medium tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8B5CF6] opacity-60" />
                Horas Estimadas *
              </Label>
              <Input
                id="estimated-hours"
                type="number"
                placeholder="Ex: 40"
                value={estimatedHours}
                onChange={(e) => {
                  setEstimatedHours(e.target.value);
                  if (errors.estimatedHours) {
                    setErrors({ ...errors, estimatedHours: "" });
                  }
                }}
                className={`bg-[#0F0F14] border rounded-xl px-4 py-3 text-[#F3F4F6] placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.1)] transition-all ${
                  errors.estimatedHours ? "border-[#EF4444] focus:ring-[rgba(239,68,68,0.1)]" : "border-[rgba(139,92,246,0.2)]"
                }`}
                min="0"
                step="0.5"
              />
              {errors.estimatedHours && (
                <p className="text-xs text-[#EF4444] animate-fade-in">{errors.estimatedHours}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly-rate" className="text-[#D1D5DB] text-sm font-medium tracking-wide flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#8B5CF6] opacity-60" />
                Valor por Hora (R$) *
              </Label>
              <Input
                id="hourly-rate"
                type="number"
                placeholder="Ex: 150.00"
                value={hourlyRate}
                onChange={(e) => {
                  setHourlyRate(e.target.value);
                  if (errors.hourlyRate) {
                    setErrors({ ...errors, hourlyRate: "" });
                  }
                }}
                className={`bg-[#0F0F14] border rounded-xl px-4 py-3 text-[#F3F4F6] placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.1)] transition-all ${
                  errors.hourlyRate ? "border-[#EF4444] focus:ring-[rgba(239,68,68,0.1)]" : "border-[rgba(139,92,246,0.2)]"
                }`}
                min="0"
                step="0.01"
              />
              {errors.hourlyRate && (
                <p className="text-xs text-[#EF4444] animate-fade-in">{errors.hourlyRate}</p>
              )}
            </div>
          </div>

          {/* Custos */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fixed-costs" className="text-[#D1D5DB] text-sm font-medium tracking-wide">
                Custos Fixos (R$)
              </Label>
              <p className="text-xs text-[#6B7280] italic mb-1">Internet, software, etc</p>
              <Input
                id="fixed-costs"
                type="number"
                placeholder="Ex: 200.00"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(e.target.value)}
                className="bg-[#0F0F14] border border-[rgba(139,92,246,0.2)] rounded-xl px-4 py-3 text-[#F3F4F6] placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.1)]"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable-costs" className="text-[#D1D5DB] text-sm font-medium tracking-wide">
                Custos Variáveis (R$)
              </Label>
              <p className="text-xs text-[#6B7280] italic mb-1">Fonts, fotos, plugins, etc</p>
              <Input
                id="variable-costs"
                type="number"
                placeholder="Ex: 150.00"
                value={variableCosts}
                onChange={(e) => setVariableCosts(e.target.value)}
                className="bg-[#0F0F14] border border-[rgba(139,92,246,0.2)] rounded-xl px-4 py-3 text-[#F3F4F6] placeholder:text-[#6B7280] focus:border-[rgba(139,92,246,0.6)] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.1)]"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Regime Tributário */}
          <div className="space-y-2">
            <Label htmlFor="tax-regime" className="text-[#D1D5DB] text-sm font-medium tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8B5CF6] opacity-60" />
              Regime Tributário *
            </Label>
            <Select 
              value={taxRegime} 
              onValueChange={(value) => {
                setTaxRegime(value);
                if (errors.taxRegime) {
                  setErrors({ ...errors, taxRegime: "" });
                }
              }}
            >
              <SelectTrigger className={`bg-[#0F0F14] border rounded-xl px-4 py-3 text-[#F3F4F6] focus:border-[rgba(139,92,246,0.6)] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.1)] transition-all ${
                errors.taxRegime ? "border-[#EF4444] focus:ring-[rgba(239,68,68,0.1)]" : "border-[rgba(139,92,246,0.2)]"
              }`}>
                <SelectValue placeholder="Selecione o regime tributário" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C26] border border-[rgba(139,92,246,0.2)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50">
                {taxRegimes.map((regime) => (
                  <SelectItem key={regime.value} value={regime.value} className="text-[#F3F4F6] hover:bg-[rgba(139,92,246,0.15)] focus:bg-[rgba(139,92,246,0.25)]">
                    {regime.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.taxRegime && (
              <p className="text-xs text-[#EF4444] animate-fade-in">{errors.taxRegime}</p>
            )}
          </div>

          {/* Margem de Lucro */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[#D1D5DB] text-sm font-medium tracking-wide flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#8B5CF6] opacity-60" />
                Margem de Lucro
              </Label>
              <span className="text-2xl font-bold text-[#A855F7]">{profitMargin[0]}%</span>
            </div>
            <Slider
              value={profitMargin}
              onValueChange={setProfitMargin}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <Button 
            onClick={handleCalculate}
            disabled={isCalculateDisabled}
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-90 shadow-[0_8px_24px_rgba(139,92,246,0.4)] text-white font-semibold py-6 text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px] active:scale-[0.98]"
          >
            <CalculatorIcon className="w-5 h-5 mr-2" />
            Calcular Preço
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Valor Final Card */}
        {calculatedResults && (
          <div className="p-8 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-2xl shadow-[0_20px_60px_rgba(139,92,246,0.4)] animate-fade-in" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}>
            <p className="text-base text-white opacity-90 mb-2">💰 Valor Final do Projeto</p>
            <p className="text-5xl font-extrabold text-white mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              {formatCurrency(calculatedResults.valorFinal)}
            </p>
            <div className="pt-3 border-t border-white/20">
              <p className="text-sm text-white/80 mb-1">Valor por Hora Efetivo</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(calculatedResults.valorHoraEfetivo)}/hora
              </p>
            </div>
          </div>
        )}

        {/* Details Card */}
        <Card className="bg-[#1C1C26] border border-[rgba(139,92,246,0.15)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-[#F3F4F6] font-bold">
              <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />
              Detalhamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculatedResults ? (
              <div className="space-y-1 animate-fade-in">
                <div className="flex justify-between items-center py-4 border-b border-[rgba(139,92,246,0.1)]">
                  <span className="text-[#D1D5DB] text-base">Valor Base</span>
                  <span className="text-[#F3F4F6] text-lg font-semibold">{formatCurrency(calculatedResults.valorBase)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[rgba(139,92,246,0.1)]">
                  <span className="text-[#D1D5DB] text-base">Custos Totais</span>
                  <span className="text-[#F3F4F6] text-lg font-semibold">{formatCurrency(calculatedResults.custosTotais)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[rgba(139,92,246,0.1)]">
                  <span className="text-[#D1D5DB] text-base">Subtotal</span>
                  <span className="text-[#F3F4F6] text-lg font-semibold">{formatCurrency(calculatedResults.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[rgba(139,92,246,0.1)]">
                  <span className="text-[#D1D5DB] text-base">Lucro ({profitMargin[0]}%)</span>
                  <span className="text-[#10B981] text-lg font-semibold">{formatCurrency(calculatedResults.lucro)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[rgba(139,92,246,0.1)]">
                  <span className="text-[#D1D5DB] text-base">Antes dos Impostos</span>
                  <span className="text-[#F3F4F6] text-lg font-semibold">{formatCurrency(calculatedResults.antesImpostos)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[rgba(139,92,246,0.1)]">
                  <span className="text-[#D1D5DB] text-base">Impostos</span>
                  <span className="text-[#EF4444] text-lg font-semibold">{formatCurrency(calculatedResults.impostos)}</span>
                </div>
                <div className="flex justify-between items-center py-5">
                  <span className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">{formatCurrency(calculatedResults.valorFinal)}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleSaveProject}
                    disabled={!clientName.trim() || !projectName.trim()}
                    className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:opacity-90 text-white font-semibold py-6 text-lg rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:translate-y-[-2px]"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {currentEditingId ? "Atualizar Projeto" : "Salvar Projeto"}
                  </Button>
                  
                  {currentEditingId && (
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                      className="w-full font-medium py-6 text-lg bg-[#0F0F14] border-[rgba(139,92,246,0.2)] text-[#D1D5DB] hover:bg-[rgba(139,92,246,0.1)] rounded-xl transition-all"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center mb-4">
                  <CalculatorIcon className="w-10 h-10 text-[#8B5CF6]" />
                </div>
                <p className="text-[#D1D5DB] font-medium mb-2">Aguardando cálculo</p>
                <p className="text-sm text-[#9CA3AF]">
                  Preencha os campos e clique em "Calcular Preço"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};
