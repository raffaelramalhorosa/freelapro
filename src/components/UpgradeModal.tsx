import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, X } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName?: string;
}

export const UpgradeModal = ({
  isOpen,
  onClose,
  onUpgrade,
  featureName = "Este recurso",
}: UpgradeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Recurso Premium</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {featureName} está disponível apenas nos planos Pro e Business
          </DialogDescription>
        </DialogHeader>

        {/* Comparison */}
        <div className="space-y-4 py-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">Seu plano: Free</span>
              <span className="text-sm text-gray-600">R$ 0/mês</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                2 projetos por mês
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <X className="w-4 h-4 text-red-400" />
                Dashboard avançado
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <X className="w-4 h-4 text-red-400" />
                Relatórios em PDF
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-primary rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">Plano Pro</span>
              <span className="text-sm font-medium text-primary">R$ 29/mês</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                Projetos ilimitados
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                Dashboard completo
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                Exportar relatórios PDF
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                Múltiplos regimes tributários
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Continuar no Free
          </Button>
          <Button
            onClick={onUpgrade}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Ver Planos e Preços
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
