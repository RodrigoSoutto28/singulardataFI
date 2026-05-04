import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";
import { StudyContent } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Trash2, Edit, Star, FileText, File, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { getUserErrorMessage } from "@/shared/lib/errors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

export function StudyContentList({ onEdit }: { onEdit: (content: StudyContent) => void }) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['admin_study_contents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_content')
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: true });
      
      if (error) throw error;
      return data as StudyContent[];
    }
  });

  const { data: metrics } = useQuery({
    queryKey: ['admin_study_metrics'],
    queryFn: async () => {
      const [{ count: publishedCount }, { count: weekCount }, { count: readsCount }] = await Promise.all([
        supabase.from('study_content').select('*', { count: 'exact', head: true }).lte('published_at', new Date().toISOString()),
        supabase.from('study_content').select('*', { count: 'exact', head: true }).eq('week_number', getWeekNumber(new Date())),
        supabase.from('study_progress').select('*', { count: 'exact', head: true }).eq('completed', true)
      ]);
      return {
        published: publishedCount || 0,
        week: weekCount || 0,
        reads: readsCount || 0
      };
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('study_content').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_study_contents'] });
      queryClient.invalidateQueries({ queryKey: ['admin_study_metrics'] });
      toast.success("Contenido eliminado");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo eliminar el contenido.'));
      setDeleteId(null);
    }
  });

  const getStatus = (publishedAt: string | null) => {
    if (!publishedAt) return { label: 'Borrador', color: 'bg-muted text-muted-foreground' };
    if (new Date(publishedAt) > new Date()) return { label: 'Programado', color: 'bg-amber-500/10 text-amber-500' };
    return { label: 'Publicado', color: 'bg-green-500/10 text-green-500' };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.published ?? '-'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.week ?? '-'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lecturas Completadas</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.reads ?? '-'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sem</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-[300px]">Título</TableHead>
              <TableHead>Categorías</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Cargando...</TableCell>
              </TableRow>
            ) : contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay contenidos todavía</TableCell>
              </TableRow>
            ) : (
              contents.map((item) => {
                const status = getStatus(item.published_at);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-muted-foreground">W{item.week_number}</TableCell>
                    <TableCell>
                      {item.type === 'summary' ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-200/20">
                          <FileText className="w-3 h-3 mr-1" /> Resumen
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-200/20">
                          <File className="w-3 h-3 mr-1" /> Paper PDF
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate max-w-[250px] block" title={item.title}>
                          {item.title}
                        </span>
                        {item.is_featured && <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {item.categories?.map(cat => (
                          <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive/70 hover:text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el contenido
              y todo el progreso asociado a los usuarios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  var weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  return weekNo;
}

