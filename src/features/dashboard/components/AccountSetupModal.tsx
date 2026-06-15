import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useTradingAccount } from '@/features/dashboard/hooks/useTradingAccount';
import { useTradingAccounts, type TradingAccount } from '@/features/dashboard/hooks/useTradingAccounts';
import { toast } from 'sonner';

interface AccountSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * 'auto'          — edit current active account if exists, otherwise create (legacy)
   * 'create'        — always create a new account
   * 'edit-specific' — edit the account provided in `editingAccount`
   */
  mode?: 'auto' | 'create' | 'edit-specific';
  editingAccount?: TradingAccount | null;
}

export function AccountSetupModal({
  open,
  onOpenChange,
  mode = 'auto',
  editingAccount = null,
}: AccountSetupModalProps) {
  const { t } = useLanguage();
  const { account, createAccount, isCreating, isUpdating } = useTradingAccount();
  const { updateAccount: updateAnyAccount } = useTradingAccounts();

  const [name, setName] = useState('');
  const [broker, setBroker] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');

  const targetAccount: TradingAccount | null =
    mode === 'edit-specific' ? editingAccount : mode === 'auto' ? account : null;
  const isEditing = (mode === 'auto' && !!account) || (mode === 'edit-specific' && !!editingAccount);
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (isEditing && targetAccount && open) {
      setName(targetAccount.name || '');
      setBroker(targetAccount.broker || '');
      setInitialBalance(String(targetAccount.initial_balance || 0));
      setCurrentBalance(String(targetAccount.current_balance || 0));
    } else if (open) {
      setName('');
      setBroker('');
      setInitialBalance('');
      setCurrentBalance('');
    }
  }, [targetAccount, open, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedInitial = parseFloat(initialBalance);
    const parsedCurrent = parseFloat(currentBalance);

    if (!name.trim()) {
      toast.error('El nombre de la cuenta es requerido');
      return;
    }

    // NaN (campo vacío) o negativo son inválidos
    if (isNaN(parsedInitial) || parsedInitial < 0) {
      toast.error('El balance inicial debe ser un número mayor o igual a 0');
      return;
    }
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      toast.error('El balance actual debe ser un número mayor o igual a 0');
      return;
    }

    try {
      if (isEditing && targetAccount) {
        await updateAnyAccount({
          id: targetAccount.id,
          name: name.trim(),
          broker: broker.trim() || null,
          initial_balance: parsedInitial,
          current_balance: parsedCurrent,
        });
        // El toast lo emite onSuccess de la mutación (useTradingAccounts)
      } else {
        await createAccount({
          name: name.trim(),
          broker: broker.trim() || null,
          initial_balance: parsedInitial,
          current_balance: parsedCurrent,
          currency: 'USD',
          account_type: 'real',
        });
        toast.success('Cuenta creada correctamente');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al guardar la cuenta');
    }
  };




  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t.dashboard.editBalance : t.dashboard.accountSetup}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.dashboard.accountName} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mi cuenta de trading"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="broker">{t.dashboard.broker}</Label>
            <Input
              id="broker"
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              placeholder="Interactive Brokers, TD Ameritrade..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initialBalance">{t.dashboard.initialBalance} *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                min="0"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="pl-7"
                placeholder="10000.00"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentBalance">{t.dashboard.currentBalance} *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="currentBalance"
                type="number"
                step="0.01"
                min="0"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                className="pl-7"
                placeholder="12500.00"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? t.common.loading 
                : isEditing 
                  ? t.dashboard.saveAccount 
                  : t.dashboard.createAccount
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


