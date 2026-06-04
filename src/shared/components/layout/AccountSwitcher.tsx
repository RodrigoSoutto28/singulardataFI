import { useState } from 'react';
import { Wallet, Check, Plus, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { useTradingAccounts, type TradingAccount } from '@/features/dashboard/hooks/useTradingAccounts';
import { AccountSetupModal } from '@/features/dashboard/components/AccountSetupModal';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

export function AccountSwitcher() {
  const { t } = useLanguage();
  const {
    accounts,
    selectedAccount,
    selectedAccountId,
    setSelectedAccountId,
    deactivateAccount,
    isLoading,
  } = useTradingAccounts();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<TradingAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<TradingAccount | null>(null);

  if (isLoading) return null;

  const label = t.topbar.accountsCenter;
  const onlyOne = accounts.length <= 1;

  const handleDelete = async () => {
    if (!deletingAccount) return;
    try {
      await deactivateAccount(deletingAccount.id);
      toast.success('Cuenta eliminada');
      setDeletingAccount(null);
    } catch {
      toast.error('No se pudo eliminar la cuenta');
    }
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 gap-2 px-2 md:px-3 rounded-md hover:bg-muted/60"
            aria-label={t.dashboard.accountSetup}
          >
            <Wallet className="h-4 w-4 text-primary" />
            <span className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-xs font-medium text-foreground truncate max-w-[140px]">
                {label}
              </span>
              {broker && (
                <span className="text-[10px] text-muted-foreground truncate max-w-[140px] font-mono">
                  {broker}
                </span>
              )}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 bg-popover border-border">
          <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            {accounts.length > 0
              ? `${accounts.length} ${accounts.length === 1 ? 'cuenta' : 'cuentas'}`
              : 'Sin cuentas'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {accounts.map((acc) => {
            const isActive = acc.id === selectedAccountId;
            return (
              <div
                key={acc.id}
                className="group flex items-center gap-1 px-1 py-0.5 rounded-sm hover:bg-accent/50"
              >
                <button
                  type="button"
                  onClick={() => setSelectedAccountId(acc.id)}
                  className="flex-1 flex items-center gap-2 py-1.5 px-1 min-w-0 text-left rounded-sm"
                >
                  <Check
                    className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'opacity-0')}
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{acc.name}</span>
                    {acc.broker && (
                      <span className="text-[11px] text-muted-foreground truncate font-mono">
                        {acc.broker}
                      </span>
                    )}
                  </div>
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-60 hover:opacity-100 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAccount(acc);
                  }}
                  aria-label={`Editar ${acc.name}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>

                {onlyOne ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled
                          className="h-7 w-7 opacity-30"
                          aria-label="No se puede eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      Debe existir al menos una cuenta
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-60 hover:opacity-100 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingAccount(acc);
                    }}
                    aria-label={`Eliminar ${acc.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            );
          })}

          {accounts.length > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer gap-2 text-primary focus:text-primary"
          >
            <Plus className="h-4 w-4" />
            Agregar cuenta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AccountSetupModal open={createOpen} onOpenChange={setCreateOpen} mode="create" />

      <AccountSetupModal
        open={!!editingAccount}
        onOpenChange={(o) => !o && setEditingAccount(null)}
        mode="edit-specific"
        editingAccount={editingAccount}
      />

      <AlertDialog open={!!deletingAccount} onOpenChange={(o) => !o && setDeletingAccount(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cuenta</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que quieres eliminar <strong>{deletingAccount?.name}</strong>? Las
              operaciones históricas se conservan, pero la cuenta dejará de aparecer en el
              selector.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
