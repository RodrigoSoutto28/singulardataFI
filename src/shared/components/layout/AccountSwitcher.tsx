import { useState } from 'react';
import { Wallet, Check, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useTradingAccounts } from '@/features/dashboard/hooks/useTradingAccounts';
import { AccountSetupModal } from '@/features/dashboard/components/AccountSetupModal';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { cn } from '@/shared/lib/utils';

export function AccountSwitcher() {
  const { t } = useLanguage();
  const { accounts, selectedAccount, selectedAccountId, setSelectedAccountId, isLoading } =
    useTradingAccounts();
  const [createOpen, setCreateOpen] = useState(false);

  if (isLoading) return null;

  const label = selectedAccount?.name ?? t.dashboard.accountSetup;
  const broker = selectedAccount?.broker;

  return (
    <>
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
        <DropdownMenuContent align="end" className="w-64 bg-popover border-border">
          <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            {accounts.length > 0 ? `${accounts.length} ${accounts.length === 1 ? 'cuenta' : 'cuentas'}` : 'Sin cuentas'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {accounts.map((acc) => {
            const isActive = acc.id === selectedAccountId;
            return (
              <DropdownMenuItem
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className="cursor-pointer gap-2 py-2"
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
              </DropdownMenuItem>
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
    </>
  );
}
