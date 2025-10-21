import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sparkles } from "lucide-react";

interface PlanLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PlanLimitModal = ({ isOpen, onClose, onUpgrade }: PlanLimitModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            Limite de projetos atingido
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Você atingiu o limite de 2 projetos do plano Free.
            <br />
            <br />
            <span className="font-medium text-foreground">
              Faça upgrade para Pro e tenha projetos ilimitados!
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onUpgrade}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Ver Planos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
