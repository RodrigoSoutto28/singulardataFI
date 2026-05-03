import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, DollarSign, Building, Info } from 'lucide-react';
import { useTradingAccount } from '@/hooks/useTradingAccount';
import { toast } from 'sonner';

interface Props {
  onNext: () => void;
}

export function AccountSetupStep({ onNext }: Props) {
  const [accountName, setAccountName] = useState('Cuenta Principal');
  const [broker, setBroker] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [currency, setCurrency] = useState('USD');
  const { account, createAccount, isCreating } = useTradingAccount();

  const handleSubmit = async () => {
    if (account) {
      onNext();
      return;
    }
    const bal = parseFloat(initialBalance);
    if (!bal || bal <= 0) {
      toast.error('Ingresa un balance inicial válido');
      return;
    }
    try {
      await createAccount({
        name: accountName,
        broker: broker || null,
        initial_balance: bal,
        current_balance: bal,
        currency,
      });
      onNext();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <div className="space-y-5 py-2">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Configura tu Cuenta de Trading</h2>
        <p className="text-sm text-muted-foreground">Datos básicos para comenzar</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <span className="font-semibold">Privacidad:</span> Tus datos financieros son 100% privados.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Nombre de la cuenta</Label>
            <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} disabled={!!account} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Building className="h-4 w-4" /> Broker (opcional)</Label>
            <Input value={broker} onChange={(e) => setBroker(e.target.value)} placeholder="Ej: Interactive Brokers" disabled={!!account} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Balance inicial *</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="10000"
                min="0"
                step="0.01"
                className="flex-1"
                disabled={!!account}
              />
              <Select value={currency} onValueChange={setCurrency} disabled={!!account}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="MXN">MXN</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {account && (
            <p className="text-xs text-muted-foreground">Ya tienes una cuenta configurada. Puedes continuar.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isCreating}>
          {isCreating ? 'Creando...' : account ? 'Continuar' : 'Crear cuenta y continuar'}
        </Button>
      </div>
    </div>
  );
}
