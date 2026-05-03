import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ClipboardCheck, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProtocolItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

const getInitialProtocol = (): ProtocolItem[] => [
  { id: '1', title: 'Análisis de mercado', category: 'Pre-Market', completed: false },
  { id: '2', title: 'Revisar niveles clave', category: 'Pre-Market', completed: false },
  { id: '3', title: 'Definir gestión de riesgo', category: 'Pre-Market', completed: false },
];

export function TasksCard({ className }: { className?: string }) {
  const { t } = useLanguage();
  const [items, setItems] = useState<ProtocolItem[]>(getInitialProtocol());
  const [newItem, setNewItem] = useState('');

  const pendingCount = items.filter(i => !i.completed).length;

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      title: newItem,
      category: 'Pre-Market',
      completed: false,
    }]);
    setNewItem('');
  };

  return (
    <div className={cn('p-5 rounded-lg bg-card border border-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-medium">{t.dashboard.preMarketProtocol}</h3>
        </div>
        <Badge className="bg-primary/10 text-primary text-xs">
          {pendingCount} {t.common.pending}
        </Badge>
      </div>

      {/* Add Item */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder={t.dashboard.newProtocolItem}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className="flex-1 bg-muted border-border text-sm"
        />
        <Button 
          size="icon" 
          onClick={addItem}
          className="bg-primary hover:bg-primary/90 shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Protocol List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={cn(
              'flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors',
              item.completed 
                ? 'bg-success/5 border border-success/30' 
                : 'bg-muted/50 hover:bg-muted'
            )}
          >
            <div className={cn(
              'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all',
              item.completed 
                ? 'bg-success border-success' 
                : 'border-muted-foreground/30'
            )}>
              {item.completed && <Check className="h-3 w-3 text-success-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm transition-all',
                item.completed && 'line-through text-muted-foreground'
              )}>
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {item.category}
              </p>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t.dashboard.emptyList}</p>
          </div>
        )}
      </div>
    </div>
  );
}
