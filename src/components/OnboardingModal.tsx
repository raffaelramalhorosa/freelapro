import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    icon: Calculator,
    title: "Calcule preços justos",
    description: "Considere todos os custos, impostos e margem de lucro em segundos",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: FileText,
    title: "Gere contratos profissionais",
    description: "Templates prontos e personalizáveis para seus serviços",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Acompanhe seus resultados",
    description: "Dashboard com todas as métricas importantes",
    color: "from-green-500 to-teal-600",
  },
];

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onClose();
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-lg p-0 overflow-hidden">
        {/* Skip button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          Pular tutorial
        </button>

        {/* Content */}
        <div className="p-8 pt-12">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6 animate-scale-in">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-3">{step.title}</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {step.description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-primary w-8"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isLastStep ? (
                "Começar"
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Step indicator */}
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              {currentStep + 1}/{onboardingSteps.length}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
