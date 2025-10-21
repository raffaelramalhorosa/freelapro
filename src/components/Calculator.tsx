import { useState } from "react";
import { DollarSign, Clock, Briefcase, TrendingUp, Calculator as CalculatorIcon, User, FileText } from "lucide-react";
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

const serviceTypes = [
  "Design Gráfico",
  "Desenvolvimento",
  "Marketing Digital",
  "Consultoria",
  "Redação/Copywriting",
  "Edição de Vídeo",
];

export const Calculator = () => {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCosts, setVariableCosts] = useState("");

  const calculateTotal = () => {
    const hours = parseFloat(estimatedHours) || 0;
    const rate = parseFloat(hourlyRate) || 0;
    const fixed = parseFloat(fixedCosts) || 0;
    const variable = parseFloat(variableCosts) || 0;

    const labor = hours * rate;
    const totalCosts = fixed + variable;
    const subtotal = labor + totalCosts;
    const withProfit = subtotal * 1.2; // 20% profit margin

    return {
      labor: labor.toFixed(2),
      costs: totalCosts.toFixed(2),
      subtotal: subtotal.toFixed(2),
      total: withProfit.toFixed(2),
    };
  };

  const result = calculateTotal();

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

          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg text-white font-medium py-6">
            Calcular Orçamento
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
          <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
            <p className="text-sm text-gray-600 mb-1">Mão de Obra (Horas × Taxa)</p>
            <p className="text-2xl font-bold text-foreground">R$ {result.labor}</p>
          </div>

          <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
            <p className="text-sm text-gray-600 mb-1">Custos Totais (Fixos + Variáveis)</p>
            <p className="text-2xl font-bold text-foreground">R$ {result.costs}</p>
          </div>

          <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-border">
            <p className="text-sm text-gray-600 mb-1">Subtotal</p>
            <p className="text-2xl font-bold text-foreground">R$ {result.subtotal}</p>
          </div>

          <div className="p-6 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg">
            <p className="text-sm text-white/90 mb-1">Valor Total do Projeto</p>
            <p className="text-xs text-white/70 mb-2">(com margem de lucro 20%)</p>
            <p className="text-4xl font-bold text-white">R$ {result.total}</p>
          </div>

          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-dashed border-primary">
            <p className="text-xs text-gray-600 mb-2">💡 Dica Profissional</p>
            <p className="text-sm text-foreground">
              Este valor já inclui uma margem de lucro de 20% sobre seus custos totais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
