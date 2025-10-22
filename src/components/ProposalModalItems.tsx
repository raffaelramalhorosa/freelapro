import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// Phase Item Component - Memoized
export const PhaseItem = memo(({ 
  phase, 
  index, 
  onUpdate, 
  onDelete 
}: { 
  phase: any; 
  index: number; 
  onUpdate: (id: number, field: string, value: any) => void; 
  onDelete: (id: number) => void;
}) => {
  const [localBudget, setLocalBudget] = useState(String(phase.budget));
  const [localDuration, setLocalDuration] = useState(String(phase.duration));
  const debouncedBudget = useDebounce(localBudget, 400);
  const debouncedDuration = useDebounce(localDuration, 400);

  useEffect(() => {
    if (debouncedBudget !== String(phase.budget)) {
      onUpdate(phase.id, 'budget', Number(debouncedBudget) || 0);
    }
  }, [debouncedBudget, phase.id, phase.budget, onUpdate]);

  useEffect(() => {
    if (debouncedDuration !== String(phase.duration)) {
      onUpdate(phase.id, 'duration', Number(debouncedDuration) || 0);
    }
  }, [debouncedDuration, phase.id, phase.duration, onUpdate]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(phase.id, 'name', e.target.value);
  }, [phase.id, onUpdate]);

  const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(phase.id, 'summary', e.target.value);
  }, [phase.id, onUpdate]);

  const handleUnitChange = useCallback((value: string) => {
    onUpdate(phase.id, 'durationUnit', value);
  }, [phase.id, onUpdate]);

  const handleStartDateChange = useCallback((date: Date | undefined) => {
    onUpdate(phase.id, 'startDate', date);
  }, [phase.id, onUpdate]);

  const handleEndDateChange = useCallback((date: Date | undefined) => {
    onUpdate(phase.id, 'endDate', date);
  }, [phase.id, onUpdate]);

  const handleDeleteClick = useCallback(() => {
    onDelete(phase.id);
  }, [phase.id, onDelete]);

  return (
    <Card className="bg-white/5 border-purple-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-white text-lg">Fase {index + 1}</CardTitle>
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Nome da Fase *</Label>
            <Input
              value={phase.name}
              onChange={handleNameChange}
              className="bg-white/5 border-purple-500/20 text-white"
              placeholder="Ex: Planejamento"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Duração</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={localDuration}
                onChange={(e) => setLocalDuration(e.target.value)}
                className="bg-white/5 border-purple-500/20 text-white"
                placeholder="0"
              />
              <Select value={phase.durationUnit} onValueChange={handleUnitChange}>
                <SelectTrigger className="bg-white/5 border-purple-500/20 text-white w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dias">Dias</SelectItem>
                  <SelectItem value="semanas">Semanas</SelectItem>
                  <SelectItem value="meses">Meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Resumo da Fase</Label>
          <Textarea
            value={phase.summary}
            onChange={handleSummaryChange}
            className="bg-white/5 border-purple-500/20 text-white min-h-[80px]"
            placeholder="Descreva as atividades desta fase..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Data Inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/5 border-purple-500/20 text-white hover:bg-white/10",
                    !phase.startDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {phase.startDate ? format(phase.startDate, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={phase.startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Data Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/5 border-purple-500/20 text-white hover:bg-white/10",
                    !phase.endDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {phase.endDate ? format(phase.endDate, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={phase.endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Verba da Fase *</Label>
            <Input
              type="number"
              value={localBudget}
              onChange={(e) => setLocalBudget(e.target.value)}
              className="bg-white/5 border-purple-500/20 text-white"
              placeholder="0.00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PhaseItem.displayName = 'PhaseItem';

// Cost Item Component - Memoized
export const CostItem = memo(({ 
  cost, 
  index, 
  onUpdate, 
  onDelete 
}: { 
  cost: any; 
  index: number; 
  onUpdate: (id: number, field: string, value: any) => void; 
  onDelete: (id: number) => void;
}) => {
  const [localValue, setLocalValue] = useState(String(cost.value));
  const [localDescription, setLocalDescription] = useState(cost.description);
  const debouncedValue = useDebounce(localValue, 400);
  const debouncedDescription = useDebounce(localDescription, 600);

  useEffect(() => {
    if (debouncedValue !== String(cost.value)) {
      onUpdate(cost.id, 'value', Number(debouncedValue) || 0);
    }
  }, [debouncedValue, cost.id, cost.value, onUpdate]);

  useEffect(() => {
    if (debouncedDescription !== cost.description) {
      onUpdate(cost.id, 'description', debouncedDescription);
    }
  }, [debouncedDescription, cost.id, cost.description, onUpdate]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(cost.id, 'name', e.target.value);
  }, [cost.id, onUpdate]);

  const handleDeleteClick = useCallback(() => {
    onDelete(cost.id);
  }, [cost.id, onDelete]);

  return (
    <Card className="bg-white/5 border-purple-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-white text-lg">Custo {index + 1}</CardTitle>
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Nome do Custo *</Label>
            <Input
              value={cost.name}
              onChange={handleNameChange}
              className="bg-white/5 border-purple-500/20 text-white"
              placeholder="Ex: Hospedagem"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Valor *</Label>
            <Input
              type="number"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              className="bg-white/5 border-purple-500/20 text-white"
              placeholder="0.00"
            />
            <p className="text-sm text-gray-400">
              R$ {(Number(localValue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Descrição</Label>
          <Textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            className="bg-white/5 border-purple-500/20 text-white min-h-[60px]"
            placeholder="Descreva o custo..."
          />
        </div>
      </CardContent>
    </Card>
  );
});

CostItem.displayName = 'CostItem';

// Benefit Item Component - Memoized
export const BenefitItem = memo(({ 
  benefit, 
  index, 
  onUpdate, 
  onDelete 
}: { 
  benefit: any; 
  index: number; 
  onUpdate: (id: number, field: string, value: any) => void; 
  onDelete: (id: number) => void;
}) => {
  const [localDescription, setLocalDescription] = useState(benefit.description);
  const debouncedDescription = useDebounce(localDescription, 600);

  useEffect(() => {
    if (debouncedDescription !== benefit.description) {
      onUpdate(benefit.id, 'description', debouncedDescription);
    }
  }, [debouncedDescription, benefit.id, benefit.description, onUpdate]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(benefit.id, 'name', e.target.value);
  }, [benefit.id, onUpdate]);

  const handleDeleteClick = useCallback(() => {
    onDelete(benefit.id);
  }, [benefit.id, onDelete]);

  return (
    <Card className="bg-white/5 border-purple-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-white text-lg">Benefício {index + 1}</CardTitle>
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Nome do Benefício *</Label>
          <Input
            value={benefit.name}
            onChange={handleNameChange}
            className="bg-white/5 border-purple-500/20 text-white"
            placeholder="Ex: Aumento de conversão"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Descrição</Label>
          <Textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            className="bg-white/5 border-purple-500/20 text-white min-h-[60px]"
            placeholder="Descreva o benefício esperado..."
          />
        </div>
      </CardContent>
    </Card>
  );
});

BenefitItem.displayName = 'BenefitItem';

// Lazy Chart Component - Only renders when visible
export const LazyPhaseChart = memo(({ 
  phaseChartData, 
  CHART_COLORS 
}: { 
  phaseChartData: any[]; 
  CHART_COLORS: string[];
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay chart render to avoid blocking UI
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  if (!isLoaded) {
    return (
      <Card className="bg-white/5 border-purple-500/20">
        <CardContent className="py-16 text-center">
          <p className="text-gray-400">Carregando gráfico...</p>
        </CardContent>
      </Card>
    );
  }

  // Lazy import recharts
  const { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } = require('recharts');

  return (
    <Card className="bg-white/5 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Distribuição de Verba por Fase</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={phaseChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {phaseChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

LazyPhaseChart.displayName = 'LazyPhaseChart';
