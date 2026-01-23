import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Image,
  Star,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Trade {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  status: 'open' | 'closed';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  pnlPercentage?: number;
  entryDate: string;
  exitDate?: string;
  strategy?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
}

// Mock data
const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'EUR/USD',
    direction: 'long',
    status: 'closed',
    entryPrice: 1.0850,
    exitPrice: 1.0920,
    quantity: 100000,
    pnl: 700,
    pnlPercentage: 0.65,
    entryDate: '2025-01-22T14:30:00',
    exitDate: '2025-01-22T18:45:00',
    strategy: 'Breakout',
    notes: 'Strong momentum after news release',
    rating: 4,
    tags: ['forex', 'breakout', 'news'],
  },
  {
    id: '2',
    symbol: 'BTC/USD',
    direction: 'short',
    status: 'closed',
    entryPrice: 42500,
    exitPrice: 41800,
    quantity: 0.5,
    pnl: 350,
    pnlPercentage: 1.65,
    entryDate: '2025-01-21T10:15:00',
    exitDate: '2025-01-21T16:30:00',
    strategy: 'Trend Following',
    rating: 5,
    tags: ['crypto', 'trend'],
  },
  {
    id: '3',
    symbol: 'AAPL',
    direction: 'long',
    status: 'closed',
    entryPrice: 178.50,
    exitPrice: 176.20,
    quantity: 100,
    pnl: -230,
    pnlPercentage: -1.29,
    entryDate: '2025-01-20T09:35:00',
    exitDate: '2025-01-20T15:50:00',
    strategy: 'Support Bounce',
    notes: 'Should have waited for confirmation',
    rating: 2,
    tags: ['stocks', 'support'],
  },
  {
    id: '4',
    symbol: 'GBP/JPY',
    direction: 'long',
    status: 'open',
    entryPrice: 188.45,
    quantity: 50000,
    pnl: 125,
    pnlPercentage: 0.28,
    entryDate: '2025-01-23T09:00:00',
    strategy: 'Range Trade',
    tags: ['forex', 'range'],
  },
  {
    id: '5',
    symbol: 'TSLA',
    direction: 'short',
    status: 'closed',
    entryPrice: 245.00,
    exitPrice: 252.30,
    quantity: 50,
    pnl: -365,
    pnlPercentage: -2.98,
    entryDate: '2025-01-19T11:20:00',
    exitDate: '2025-01-19T14:45:00',
    strategy: 'Reversal',
    notes: 'Bad timing, trend continued up',
    rating: 1,
    tags: ['stocks', 'reversal'],
  },
];

function TradeRow({ trade }: { trade: Trade }) {
  const isProfit = (trade.pnl ?? 0) >= 0;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-4">
        {/* Direction Icon */}
        <div
          className={cn(
            'flex items-center justify-center h-12 w-12 rounded-xl',
            trade.direction === 'long' ? 'bg-success/10' : 'bg-destructive/10'
          )}
        >
          {trade.direction === 'long' ? (
            <ArrowUpRight className="h-6 w-6 text-success" />
          ) : (
            <ArrowDownRight className="h-6 w-6 text-destructive" />
          )}
        </div>

        {/* Trade Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{trade.symbol}</span>
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] h-5',
                trade.status === 'open'
                  ? 'border-primary text-primary'
                  : 'border-muted-foreground/50 text-muted-foreground'
              )}
            >
              {trade.status.toUpperCase()}
            </Badge>
            {trade.strategy && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {trade.strategy}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="font-mono-numbers">
              Entry: ${trade.entryPrice.toLocaleString()}
            </span>
            {trade.exitPrice && (
              <span className="font-mono-numbers">
                Exit: ${trade.exitPrice.toLocaleString()}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(trade.entryDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Rating */}
        {trade.rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < trade.rating!
                    ? 'fill-warning text-warning'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
        )}

        {/* P&L */}
        <div className="text-right min-w-[100px]">
          <p
            className={cn(
              'text-lg font-bold font-mono-numbers',
              isProfit ? 'text-profit' : 'text-loss'
            )}
          >
            {isProfit ? '+' : ''}${(trade.pnl ?? 0).toFixed(2)}
          </p>
          <p
            className={cn(
              'text-xs font-mono-numbers',
              isProfit ? 'text-profit' : 'text-loss'
            )}
          >
            {isProfit ? '+' : ''}
            {(trade.pnlPercentage ?? 0).toFixed(2)}%
          </p>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Trade
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Image className="h-4 w-4 mr-2" />
              Add Screenshot
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function Journal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);

  const filteredTrades = mockTrades.filter((trade) => {
    const matchesSearch = trade.symbol
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || trade.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPnl = filteredTrades.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0);
  const winningTrades = filteredTrades.filter((t) => (t.pnl ?? 0) > 0).length;
  const winRate = filteredTrades.length > 0 
    ? (winningTrades / filteredTrades.length * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trade Journal</h1>
          <p className="text-muted-foreground">Track and analyze your trades</p>
        </div>

        <Dialog open={isAddTradeOpen} onOpenChange={setIsAddTradeOpen}>
          <DialogTrigger asChild>
            <Button variant="glow" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Trade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Trade</DialogTitle>
              <DialogDescription>
                Log a new trade to your journal
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Symbol</Label>
                  <Input placeholder="EUR/USD" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Entry Price</Label>
                  <Input type="number" step="any" placeholder="0.00" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" step="any" placeholder="0" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Stop Loss</Label>
                  <Input type="number" step="any" placeholder="0.00" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Take Profit</Label>
                  <Input type="number" step="any" placeholder="0.00" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Strategy</Label>
                  <Input placeholder="e.g., Breakout" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Entry Date</Label>
                  <Input type="datetime-local" className="bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add any notes about this trade..."
                  className="bg-muted/50 min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddTradeOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="glow">
                  Add Trade
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total Trades</p>
          <p className="text-2xl font-bold font-mono-numbers">{filteredTrades.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-2xl font-bold font-mono-numbers text-primary">{winRate}%</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total P&L</p>
          <p className={cn(
            'text-2xl font-bold font-mono-numbers',
            totalPnl >= 0 ? 'text-profit' : 'text-loss'
          )}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-muted/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trades</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trades List */}
      <div className="space-y-3">
        {filteredTrades.map((trade) => (
          <TradeRow key={trade.id} trade={trade} />
        ))}

        {filteredTrades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No trades found</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setIsAddTradeOpen(true)}
            >
              Add your first trade
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
