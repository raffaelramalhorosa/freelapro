import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Projects = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Meus Projetos</h2>
          <p className="text-muted-foreground">Gerencie seus projetos freelance</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <Card className="border-2 border-dashed border-border">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
            <FolderKanban className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="mb-2">Nenhum projeto ainda</CardTitle>
          <CardDescription className="mb-6 max-w-md">
            Comece criando seu primeiro projeto para acompanhar orçamentos, contratos e prazos.
          </CardDescription>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Projeto
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
