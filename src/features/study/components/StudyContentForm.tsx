import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StudyContent } from "@/types/database";
import { supabase } from "@/config/supabase";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { FileText, File, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserErrorMessage } from "@/shared/lib/errors";
import ReactMarkdown from "react-markdown";

const PREDEFINED_CATEGORIES = [
  "Psicología", "Risk management", "Disciplina", "Comportamiento", 
  "Estrategia", "Prop firms", "Mercados", "Análisis técnico"
];

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida").max(200, "Máximo 200 caracteres"),
  type: z.enum(["summary", "paper_pdf"]),
  categories: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
  read_time_minutes: z.coerce.number().min(1, "Debe ser al menos 1 minuto"),
  week_number: z.coerce.number().min(1).max(52),
  is_featured: z.boolean().default(false),
  content_md: z.string().optional(),
  pdf_url: z.string().optional(),
  published_at_date: z.string().optional(),
  published_at_time: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function StudyContentForm({ 
  initialData, 
  onSuccess 
}: { 
  initialData?: StudyContent | null, 
  onSuccess: () => void 
}) {
  const queryClient = useQueryClient();
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || "summary",
      categories: initialData?.categories || [],
      read_time_minutes: initialData?.read_time_minutes || 5,
      week_number: initialData?.week_number || getWeekNumber(new Date()),
      is_featured: initialData?.is_featured || false,
      content_md: initialData?.content_md || "",
      pdf_url: initialData?.pdf_url || "",
      published_at_date: initialData?.published_at ? initialData.published_at.split('T')[0] : "",
      published_at_time: initialData?.published_at ? new Date(initialData.published_at).toTimeString().slice(0,5) : "",
    }
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        type: initialData.type || "summary",
        categories: initialData.categories || [],
        read_time_minutes: initialData.read_time_minutes || 5,
        week_number: initialData.week_number || getWeekNumber(new Date()),
        is_featured: initialData.is_featured || false,
        content_md: initialData.content_md || "",
        pdf_url: initialData.pdf_url || "",
        published_at_date: initialData.published_at ? initialData.published_at.split('T')[0] : "",
        published_at_time: initialData.published_at ? new Date(initialData.published_at).toTimeString().slice(0,5) : "",
      });
    } else {
      form.reset({
        title: "", description: "", type: "summary", categories: [], read_time_minutes: 5,
        week_number: getWeekNumber(new Date()), is_featured: false, content_md: "", pdf_url: "",
        published_at_date: "", published_at_time: ""
      });
    }
  }, [initialData, form]);

  const type = form.watch("type");
  const categories = form.watch("categories");
  const description = form.watch("description");

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      form.setValue("categories", categories.filter(c => c !== cat), { shouldValidate: true });
    } else {
      form.setValue("categories", [...categories, cat], { shouldValidate: true });
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('study-pdfs')
        .upload(fileName, file);

      if (error) throw error;

      // Bucket es privado: guardamos el path. La URL firmada se genera al leer.
      form.setValue("pdf_url", fileName);
      toast.success("PDF subido correctamente");
    } catch (error) {
      toast.error(getUserErrorMessage(error, 'No se pudo subir el PDF.'));
    } finally {
      setUploadingPdf(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async ({ values, status }: { values: FormValues, status: 'draft' | 'publish' | 'schedule' }) => {
      let published_at = null;
      if (status === 'publish') {
        published_at = new Date().toISOString();
      } else if (status === 'schedule' && values.published_at_date) {
        const timeStr = values.published_at_time || "00:00";
        published_at = new Date(`${values.published_at_date}T${timeStr}:00`).toISOString();
      }

      const payload = {
        title: values.title,
        description: values.description,
        type: values.type,
        categories: values.categories,
        read_time_minutes: values.read_time_minutes,
        week_number: values.week_number,
        is_featured: values.is_featured,
        content_md: values.type === 'summary' ? values.content_md : null,
        pdf_url: values.type === 'paper_pdf' ? values.pdf_url : null,
        published_at
      };

      if (initialData?.id) {
        const { error } = await supabase.from('study_content').update(payload).eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('study_content').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_study_contents'] });
      queryClient.invalidateQueries({ queryKey: ['admin_study_metrics'] });
      toast.success(initialData ? "Contenido actualizado" : "Contenido creado");
      onSuccess();
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo guardar el contenido.'));
    }
  });

  const onSubmit = (values: FormValues, status: 'draft' | 'publish' | 'schedule') => {
    saveMutation.mutate({ values, status });
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        
        {/* TIPO DE CONTENIDO */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de contenido</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${field.value === 'summary' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    onClick={() => field.onChange('summary')}
                  >
                    <FileText className="w-8 h-8 mb-2 text-emerald-500" />
                    <h3 className="font-semibold">Resumen</h3>
                    <p className="text-sm text-muted-foreground">Resumen propio escrito en markdown</p>
                  </div>
                  <div 
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${field.value === 'paper_pdf' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    onClick={() => field.onChange('paper_pdf')}
                  >
                    <File className="w-8 h-8 mb-2 text-blue-500" />
                    <h3 className="font-semibold">Paper PDF</h3>
                    <p className="text-sm text-muted-foreground">Paper académico con link al archivo</p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: La psicología del trading" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción corta</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Breve resumen del contenido..." 
                    className="resize-none h-10" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-right text-xs">
                  {description.length}/200
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="week_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semana del año (1-52)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={52} {...field} />
                </FormControl>
                <FormDescription>La semana actual es {getWeekNumber(new Date())}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="read_time_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiempo de lectura (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <FormLabel>Categorías</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_CATEGORIES.map(cat => (
                    <Badge 
                      key={cat}
                      variant={categories.includes(cat) ? "default" : "outline"}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                      {categories.includes(cat) && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end border p-4 rounded-lg bg-muted/20">
          <FormField
            control={form.control}
            name="published_at_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de publicación (Opcional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published_at_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora (Opcional)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Destacado</FormLabel>
                <FormDescription>
                  Aparecerá en la sección superior de la Zona de Estudio
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* CONTENIDO CONDICIONAL */}
        {type === 'summary' && (
          <FormField
            control={form.control}
            name="content_md"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido en Markdown</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 h-[500px] border rounded-md overflow-hidden">
                    <Textarea 
                      placeholder="Escribe aquí en markdown..." 
                      className="h-full border-0 rounded-none focus-visible:ring-0 resize-none p-4"
                      {...field}
                    />
                    <div className="h-full border-l bg-muted/10 p-4 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                      {/* Safe markdown rendering — react-markdown escapes HTML and disables raw HTML by default. javascript: URIs are stripped. */}
                      <ReactMarkdown
                        urlTransform={(url) => {
                          const safe = url.trim().toLowerCase();
                          if (safe.startsWith('javascript:') || safe.startsWith('data:') || safe.startsWith('vbscript:')) {
                            return '';
                          }
                          return url;
                        }}
                      >
                        {field.value || ''}
                      </ReactMarkdown>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === 'paper_pdf' && (
          <FormField
            control={form.control}
            name="pdf_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del PDF</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <div className="relative">
                    <Button type="button" variant="secondary" disabled={uploadingPdf}>
                      <UploadCloud className="w-4 h-4 mr-2" />
                      {uploadingPdf ? 'Subiendo...' : 'Subir PDF'}
                    </Button>
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-4 justify-end pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onSubmit(form.getValues(), 'draft')}
            disabled={saveMutation.isPending}
          >
            Guardar como borrador
          </Button>
          
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => onSubmit(form.getValues(), 'schedule')}
            disabled={saveMutation.isPending || !form.getValues('published_at_date')}
          >
            Programar
          </Button>
          
          <Button 
            type="button" 
            onClick={() => onSubmit(form.getValues(), 'publish')}
            disabled={saveMutation.isPending}
          >
            Publicar ahora
          </Button>
        </div>

      </form>
    </Form>
  );
}

function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  var weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  return weekNo;
}

