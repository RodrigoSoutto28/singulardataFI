import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export function useExportTrades() {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const prepareTradeData = (trades: Trade[]) => {
    return trades.map((trade) => ({
      Symbol: trade.symbol,
      Direction: trade.direction.toUpperCase(),
      Status: trade.status.toUpperCase(),
      'Entry Price': trade.entryPrice,
      'Exit Price': trade.exitPrice ?? '-',
      Quantity: trade.quantity,
      'P&L ($)': trade.pnl?.toFixed(2) ?? '-',
      'P&L (%)': trade.pnlPercentage?.toFixed(2) ?? '-',
      'Entry Date': formatDate(trade.entryDate),
      'Exit Date': trade.exitDate ? formatDate(trade.exitDate) : '-',
      Strategy: trade.strategy ?? '-',
      Rating: trade.rating ? `${trade.rating}/5` : '-',
      Tags: trade.tags?.join(', ') ?? '-',
      Notes: trade.notes ?? '-',
    }));
  };

  const exportToExcel = useCallback((trades: Trade[], filename = 'trading-journal') => {
    const data = prepareTradeData(trades);
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // Symbol
      { wch: 10 }, // Direction
      { wch: 10 }, // Status
      { wch: 12 }, // Entry Price
      { wch: 12 }, // Exit Price
      { wch: 10 }, // Quantity
      { wch: 12 }, // P&L ($)
      { wch: 10 }, // P&L (%)
      { wch: 18 }, // Entry Date
      { wch: 18 }, // Exit Date
      { wch: 15 }, // Strategy
      { wch: 8 },  // Rating
      { wch: 20 }, // Tags
      { wch: 30 }, // Notes
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trades');
    
    // Add summary sheet
    const summary = calculateSummary(trades);
    const summaryData = [
      { Metric: 'Total Trades', Value: summary.totalTrades },
      { Metric: 'Winning Trades', Value: summary.winningTrades },
      { Metric: 'Losing Trades', Value: summary.losingTrades },
      { Metric: 'Win Rate', Value: `${summary.winRate.toFixed(2)}%` },
      { Metric: 'Total P&L', Value: `$${summary.totalPnl.toFixed(2)}` },
      { Metric: 'Average P&L', Value: `$${summary.avgPnl.toFixed(2)}` },
      { Metric: 'Largest Win', Value: `$${summary.largestWin.toFixed(2)}` },
      { Metric: 'Largest Loss', Value: `$${summary.largestLoss.toFixed(2)}` },
      { Metric: 'Profit Factor', Value: summary.profitFactor.toFixed(2) },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }, []);

  const exportToPDF = useCallback((trades: Trade[], filename = 'trading-journal') => {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(66, 158, 189); // Primary color
    doc.text('Trading Journal Report', 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString('es-ES')}`, 14, 28);
    
    // Summary section
    const summary = calculateSummary(trades);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Performance Summary', 14, 40);
    
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Trades', summary.totalTrades.toString()],
        ['Win Rate', `${summary.winRate.toFixed(2)}%`],
        ['Total P&L', `$${summary.totalPnl.toFixed(2)}`],
        ['Profit Factor', summary.profitFactor.toFixed(2)],
        ['Largest Win', `$${summary.largestWin.toFixed(2)}`],
        ['Largest Loss', `$${summary.largestLoss.toFixed(2)}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 158, 189] },
      margin: { left: 14 },
      tableWidth: 80,
    });
    
    // Trades table
    doc.setFontSize(12);
    doc.text('Trade Details', 14, (doc as any).lastAutoTable.finalY + 15);
    
    const tableData = trades.map((trade) => [
      trade.symbol,
      trade.direction.toUpperCase(),
      trade.status.toUpperCase(),
      trade.entryPrice.toString(),
      trade.exitPrice?.toString() ?? '-',
      trade.pnl?.toFixed(2) ?? '-',
      `${trade.pnlPercentage?.toFixed(2) ?? '-'}%`,
      formatDate(trade.entryDate),
      trade.strategy ?? '-',
    ]);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Symbol', 'Dir', 'Status', 'Entry', 'Exit', 'P&L ($)', 'P&L (%)', 'Date', 'Strategy']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 158, 189] },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        5: { 
          cellWidth: 20,
          fontStyle: 'bold',
        },
      },
      didParseCell: (data: any) => {
        // Color P&L column
        if (data.column.index === 5 && data.section === 'body') {
          const value = parseFloat(data.cell.raw as string);
          if (!isNaN(value)) {
            if (value > 0) {
              data.cell.styles.textColor = [34, 197, 94];
            } else if (value < 0) {
              data.cell.styles.textColor = [239, 68, 68];
            }
          }
        }
      },
    });
    
    doc.save(`${filename}.pdf`);
  }, []);

  const exportToHTML = useCallback((trades: Trade[], filename = 'trading-journal') => {
    const summary = calculateSummary(trades);
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trading Journal Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: linear-gradient(135deg, #053F5C 0%, #0a1929 100%);
      color: #e0f2fe;
      padding: 2rem;
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 {
      color: #5FE2F5;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #429EBD;
      margin-bottom: 2rem;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background: rgba(66, 158, 189, 0.1);
      border: 1px solid rgba(95, 226, 245, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
    }
    .summary-card label {
      color: #7dd3fc;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .summary-card .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
    }
    .profit { color: #22c55e !important; }
    .loss { color: #ef4444 !important; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: rgba(5, 63, 92, 0.5);
      border-radius: 12px;
      overflow: hidden;
    }
    th {
      background: #429EBD;
      color: white;
      padding: 1rem;
      text-align: left;
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(95, 226, 245, 0.1);
    }
    tr:hover { background: rgba(95, 226, 245, 0.05); }
    .tag {
      display: inline-block;
      background: rgba(95, 226, 245, 0.2);
      color: #5FE2F5;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      margin-right: 0.25rem;
    }
    .long { color: #22c55e; }
    .short { color: #ef4444; }
    @media print {
      body { background: white; color: #1a1a1a; }
      .summary-card { border: 1px solid #e5e7eb; }
      table { background: white; }
      th { background: #429EBD; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Trading Journal Report</h1>
    <p class="subtitle">Generated on ${new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>
    
    <div class="summary-grid">
      <div class="summary-card">
        <label>Total Trades</label>
        <div class="value">${summary.totalTrades}</div>
      </div>
      <div class="summary-card">
        <label>Win Rate</label>
        <div class="value">${summary.winRate.toFixed(1)}%</div>
      </div>
      <div class="summary-card">
        <label>Total P&L</label>
        <div class="value ${summary.totalPnl >= 0 ? 'profit' : 'loss'}">
          ${summary.totalPnl >= 0 ? '+' : ''}$${summary.totalPnl.toFixed(2)}
        </div>
      </div>
      <div class="summary-card">
        <label>Profit Factor</label>
        <div class="value">${summary.profitFactor.toFixed(2)}</div>
      </div>
      <div class="summary-card">
        <label>Largest Win</label>
        <div class="value profit">+$${summary.largestWin.toFixed(2)}</div>
      </div>
      <div class="summary-card">
        <label>Largest Loss</label>
        <div class="value loss">-$${Math.abs(summary.largestLoss).toFixed(2)}</div>
      </div>
    </div>
    
    <h2 style="color: #5FE2F5; margin: 2rem 0 1rem;">Trade History</h2>
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Direction</th>
          <th>Status</th>
          <th>Entry</th>
          <th>Exit</th>
          <th>P&L</th>
          <th>Date</th>
          <th>Strategy</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        ${trades.map(trade => `
          <tr>
            <td><strong>${trade.symbol}</strong></td>
            <td class="${trade.direction}">${trade.direction.toUpperCase()}</td>
            <td>${trade.status.toUpperCase()}</td>
            <td>$${trade.entryPrice}</td>
            <td>${trade.exitPrice ? `$${trade.exitPrice}` : '-'}</td>
            <td class="${(trade.pnl ?? 0) >= 0 ? 'profit' : 'loss'}">
              ${trade.pnl !== undefined ? `${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}` : '-'}
            </td>
            <td>${formatDate(trade.entryDate)}</td>
            <td>${trade.strategy ?? '-'}</td>
            <td>${trade.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') ?? '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportToExcel, exportToPDF, exportToHTML };
}

function calculateSummary(trades: Trade[]) {
  const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== undefined);
  const winningTrades = closedTrades.filter(t => (t.pnl ?? 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.pnl ?? 0) < 0);
  
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0));
  
  return {
    totalTrades: trades.length,
    closedTrades: closedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
    totalPnl,
    avgPnl: closedTrades.length > 0 ? totalPnl / closedTrades.length : 0,
    largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl ?? 0)) : 0,
    largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl ?? 0)) : 0,
    profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
  };
}