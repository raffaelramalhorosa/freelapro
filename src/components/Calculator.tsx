import { useState, useEffect } from "react";
import { DollarSign, Clock, Briefcase, TrendingUp, Calculator as CalculatorIcon, User, FileText, Percent, Save } from "lucide-react";
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
  id: number;
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

export const Calculator = () => {
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

  // Carregar projetos do localStorage ao montar o componente
  useEffect(() => {
    try {
      const loadedProjects: Project[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("project:")) {
          const projectData = localStorage.getItem(key);
          if (projectData) {
            loadedProjects.push(JSON.parse(projectData));
          }
        }
      }
      setProjects(loadedProjects);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      alert("Erro ao carregar projetos salvos.");
    }
  }, []);

  const handleCalculate = () => {
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

  const handleSaveProject = () => {
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
      const timestamp = Date.now();
      const now = new Date().toISOString();
      
      const project: Project = {
        id: timestamp,
        clientName,
        projectName,
        serviceType,
        hoursEstimated: parseFloat(estimatedHours) || 0,
        desiredHourlyRate: parseFloat(hourlyRate) || 0,
        fixedCosts: parseFloat(fixedCosts) || 0,
        variableCosts: parseFloat(variableCosts) || 0,
        taxType: taxRegime,
        profitMargin: profitMargin[0],
        results: calculatedResults,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      localStorage.setItem(`project:${timestamp}`, JSON.stringify(project));
      setProjects([...projects, project]);
      
      toast({
        title: "Sucesso!",
        description: "Projeto salvo com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o projeto.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-2 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CalculatorIcon className="w-6 h-6 text-primary" />
            Novo Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cliente e Projeto */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name" className="text-gray-700 font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nome do Cliente
              </Label>
              <Input
                id="client-name"
                type="text"
                placeholder="Ex: João Silva"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-gray-700 font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Nome do Projeto
              </Label>
              <Input
                id="project-name"
                type="text"
                placeholder="Ex: Website Institucional"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Tipo de Serviço */}
          <div className="space-y-2">
            <Label htmlFor="service-type" className="text-gray-700 font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Tipo de Serviço
            </Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Horas e Valor */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated-hours" className="text-gray-700 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Horas Estimadas
              </Label>
              <Input
                id="estimated-hours"
                type="number"
                placeholder="Ex: 40"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                min="0"
                step="0.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly-rate" className="text-gray-700 font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Valor por Hora (R$)
              </Label>
              <Input
                id="hourly-rate"
                type="number"
                placeholder="Ex: 150.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Custos */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fixed-costs" className="text-gray-700 font-medium">
                Custos Fixos (R$)
              </Label>
              <p className="text-xs text-gray-500 mb-1">Internet, software, etc</p>
              <Input
                id="fixed-costs"
                type="number"
                placeholder="Ex: 200.00"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable-costs" className="text-gray-700 font-medium">
                Custos Variáveis (R$)
              </Label>
              <p className="text-xs text-gray-500 mb-1">Fonts, fotos, plugins, etc</p>
              <Input
                id="variable-costs"
                type="number"
                placeholder="Ex: 150.00"
                value={variableCosts}
                onChange={(e) => setVariableCosts(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Regime Tributário */}
          <div className="space-y-2">
            <Label htmlFor="tax-regime" className="text-gray-700 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Regime Tributário
            </Label>
            <Select value={taxRegime} onValueChange={setTaxRegime}>
              <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Selecione o regime tributário" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {taxRegimes.map((regime) => (
                  <SelectItem key={regime.value} value={regime.value}>
                    {regime.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Margem de Lucro */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <Percent className="w-4 h-4 text-primary" />
                Margem de Lucro
              </Label>
              <span className="text-2xl font-bold text-primary">{profitMargin[0]}%</span>
            </div>
            <Slider
              value={profitMargin}
              onValueChange={setProfitMargin}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <Button 
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg text-white font-medium py-6 text-lg"
          >
            Calcular Preço
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="w-6 h-6 text-primary" />
            Resultado da Precificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {calculatedResults ? (
            <>
              <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
                <p className="text-sm text-gray-600 mb-1">Valor Base (Horas × Taxa)</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {calculatedResults.valorBase.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
                <p className="text-sm text-gray-600 mb-1">Custos Totais (Fixos + Variáveis)</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {calculatedResults.custosTotais.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
                <p className="text-sm text-gray-600 mb-1">Subtotal (Base + Custos)</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {calculatedResults.subtotal.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
                <p className="text-sm text-gray-600 mb-1">Lucro ({profitMargin[0]}%)</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {calculatedResults.lucro.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
                <p className="text-sm text-gray-600 mb-1">Antes dos Impostos</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {calculatedResults.antesImpostos.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
                <p className="text-sm text-gray-600 mb-1">Impostos</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {calculatedResults.impostos.toFixed(2)}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg">
                <p className="text-sm text-white/90 mb-1">💰 Valor Final do Projeto</p>
                <p className="text-4xl font-bold text-white mb-3">
                  R$ {calculatedResults.valorFinal.toFixed(2)}
                </p>
                <div className="pt-3 border-t border-white/20">
                  <p className="text-xs text-white/70 mb-1">Valor por Hora Efetivo</p>
                  <p className="text-xl font-bold text-white">
                    R$ {calculatedResults.valorHoraEfetivo.toFixed(2)}/hora
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-dashed border-primary">
                <p className="text-xs text-gray-600 mb-2">💡 Dica Profissional</p>
                <p className="text-sm text-foreground">
                  Seu valor efetivo por hora considera todos os custos, impostos e margem de lucro.
                </p>
              </div>

              <Button 
                onClick={handleSaveProject}
                disabled={!clientName.trim() || !projectName.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                Salvar Projeto
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                <CalculatorIcon className="w-10 h-10 text-primary" />
              </div>
              <p className="text-gray-600 font-medium mb-2">Aguardando cálculo</p>
              <p className="text-sm text-gray-500">
                Preencha os campos e clique em "Calcular Preço"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
