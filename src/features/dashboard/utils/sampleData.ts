import { Trade } from '@/features/journal/hooks/useTrades';

type SampleTrade = Omit<
  Trade,
  'id' | 'user_id' | 'created_at' | 'updated_at' | 'account_id' | 'import_batch_id' | 'import_row_hash'
>;

const SYMBOLS = [
  { symbol: 'BTCUSD', asset_class: 'crypto' as const, basePrice: 67000, vol: 800 },
  { symbol: 'EURUSD', asset_class: 'forex' as const, basePrice: 1.085, vol: 0.004 },
  { symbol: 'XAUUSD', asset_class: 'commodities' as const, basePrice: 2350, vol: 12 },
];

const STRATEGIES = ['Breakout', 'Pullback', 'Trend Following', 'Reversal', 'Range'];
const NOTES_WIN = [
  'Entrada limpia confirmada por estructura.',
  'Respeté el plan, salida en TP.',
  'Confluencia de niveles, gestión correcta.',
];
const NOTES_LOSS = [
  'Entré por FOMO sin confirmación.',
  'No respeté el stop original.',
  'Operación contra-tendencia, mala lectura del contexto.',
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Genera 30 operaciones de muestra distribuidas en los últimos 60 días,
 * con ~55% de win rate, distintos símbolos y notas conductuales.
 * Devuelve datos listos para insertar (sin user_id).
 */
export function generateSampleTrades(): SampleTrade[] {
  const trades: SampleTrade[] = [];
  const now = Date.now();
  const sixtyDays = 60 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 30; i++) {
    const sym = SYMBOLS[i % SYMBOLS.length];
    const isWin = Math.random() < 0.55;
    const direction: 'long' | 'short' = Math.random() < 0.55 ? 'long' : 'short';

    const entryDate = new Date(now - Math.random() * sixtyDays);
    // Duración entre 30min y 8h
    const durationMs = rand(30 * 60 * 1000, 8 * 60 * 60 * 1000);
    const exitDate = new Date(entryDate.getTime() + durationMs);

    const entry = sym.basePrice + rand(-sym.vol * 5, sym.vol * 5);
    const moveR = isWin ? rand(0.6, 2.5) : -rand(0.5, 1.2);
    const move = sym.vol * moveR * (direction === 'long' ? 1 : -1);
    const exit = entry + move;

    // Tamaño consistente por símbolo
    const quantity =
      sym.symbol === 'BTCUSD' ? rand(0.05, 0.3) : sym.symbol === 'EURUSD' ? rand(1, 5) : rand(0.5, 2);
    // PnL aproximado (escala arbitraria pero coherente)
    const pnlMultiplier = sym.symbol === 'EURUSD' ? 100000 : sym.symbol === 'XAUUSD' ? 100 : 1;
    const pnl = Number(((exit - entry) * (direction === 'long' ? 1 : -1) * quantity * pnlMultiplier).toFixed(2));
    const pnlPct = Number(((pnl / (entry * quantity * pnlMultiplier)) * 100).toFixed(2));

    const stopDistance = Math.abs(entry - exit) * rand(0.6, 1.4);
    const takeDistance = Math.abs(entry - exit) * rand(1.2, 2.2);

    trades.push({
      symbol: sym.symbol,
      asset_class: sym.asset_class,
      direction,
      status: 'closed',
      entry_price: Number(entry.toFixed(5)),
      exit_price: Number(exit.toFixed(5)),
      quantity: Number(quantity.toFixed(3)),
      stop_loss: Number(
        (direction === 'long' ? entry - stopDistance : entry + stopDistance).toFixed(5),
      ),
      stop_size: null,
      take_profit: Number(
        (direction === 'long' ? entry + takeDistance : entry - takeDistance).toFixed(5),
      ),
      pnl,
      pnl_percentage: pnlPct,
      commission: Number(rand(0.5, 5).toFixed(2)),
      swap: 0,
      strategy: STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)],
      setup_type: null,
      timeframe: ['M15', 'H1', 'H4'][Math.floor(Math.random() * 3)],
      entry_date: entryDate.toISOString(),
      exit_date: exitDate.toISOString(),
      notes:
        Math.random() < 0.4
          ? (isWin ? NOTES_WIN : NOTES_LOSS)[Math.floor(Math.random() * 3)]
          : null,
      tags: null,
      rating: isWin ? Math.floor(rand(3, 6)) : Math.floor(rand(1, 4)),
    });
  }

  return trades.sort(
    (a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime(),
  );
}

