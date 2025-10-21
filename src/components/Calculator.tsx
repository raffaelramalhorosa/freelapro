import { useState } from "react";
import { DollarSign, Clock, Calendar, TrendingUp, Calculator as CalculatorIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Calculator = () => {
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerProject, setHoursPerProject] = useState("");
  const [expenses, setExpenses] = useState("");
  const [profit, setProfit] = useState("");

  const calculateTotal = () => {
    const hours = parseFloat(hoursPerProject) || 0;
    const rate = parseFloat(hourlyRate) || 0;
    const exp = parseFloat(expenses) || 0;
    const prof = parseFloat(profit) || 20;

    const base = hours * rate;
    const withExpenses = base + exp;
    const total = withExpenses * (1 + prof / 100);

    return {
      base: base.toFixed(2),
      withExpenses: withExpenses.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const result = calculateTotal();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalculatorIcon className="w-5 h-5 text-primary" />
            Dados do Projeto
          </CardTitle>
          <CardDescription>Insira as informações do seu projeto freelance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hourly-rate" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Taxa por Hora (R$)
            </Label>
            <Input
              id="hourly-rate"
              type="number"
              placeholder="150.00"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Horas Estimadas
            </Label>
            <Input
              id="hours"
              type="number"
              placeholder="40"
              value={hoursPerProject}
              onChange={(e) => setHoursPerProject(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenses" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Despesas Extras (R$)
            </Label>
            <Input
              id="expenses"
              type="number"
              placeholder="500.00"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profit" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Margem de Lucro (%)
            </Label>
            <Input
              id="profit"
              type="number"
              placeholder="20"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              className="text-lg"
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg">
            Calcular Preço
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Resultado da Precificação
          </CardTitle>
          <CardDescription>Valores calculados para o seu projeto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Valor Base (Horas × Taxa)</p>
            <p className="text-2xl font-bold text-foreground">R$ {result.base}</p>
          </div>

          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Valor + Despesas</p>
            <p className="text-2xl font-bold text-foreground">R$ {result.withExpenses}</p>
          </div>

          <div className="p-6 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg">
            <p className="text-sm text-white/80 mb-1">Valor Total do Projeto</p>
            <p className="text-4xl font-bold text-white">R$ {result.total}</p>
          </div>

          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-dashed border-primary">
            <p className="text-xs text-muted-foreground mb-2">💡 Dica Profissional</p>
            <p className="text-sm text-foreground">
              Sempre considere um buffer de 20-30% para imprevistos e revisões no projeto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
