import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { StudyContentList } from "@/features/study/components/StudyContentList";
import { StudyContentForm } from "@/features/study/components/StudyContentForm";
import { StudyContent } from "@/types/database";

export default function StudyAdmin() {
  const [activeTab, setActiveTab] = useState("list");
  const [editingContent, setEditingContent] = useState<StudyContent | null>(null);

  const handleEdit = (content: StudyContent) => {
    setEditingContent(content);
    setActiveTab("new");
  };

  const handleFormSuccess = () => {
    setActiveTab("list");
    setEditingContent(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin: Zona de Estudio</h1>
        <p className="text-muted-foreground">
          Gestiona los contenidos, resúmenes y papers de la zona de estudio.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="list" onClick={() => setEditingContent(null)}>Contenidos</TabsTrigger>
          <TabsTrigger value="new">
            {editingContent ? "Editar contenido" : "Nuevo contenido"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6 outline-none">
          <StudyContentList onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="new" className="space-y-6 outline-none">
          <div className="bg-card border border-border rounded-lg p-6">
            <StudyContentForm 
              initialData={editingContent} 
              onSuccess={handleFormSuccess} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


