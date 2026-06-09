/**
 * Centralized registry mapping icon names to their 3D asset paths.
 * All icons are generated as photorealistic 3D sculpted PNGs.
 */

import dashboardIcon from '@/assets/icons3d/dashboard.png';
import journalIcon from '@/assets/icons3d/journal.png';
import analyticsIcon from '@/assets/icons3d/analytics.png';
import brainIcon from '@/assets/icons3d/brain.png';
import newTradeIcon from '@/assets/icons3d/new_trade.png';
import checkinIcon from '@/assets/icons3d/checkin.png';
import balanceIcon from '@/assets/icons3d/balance.png';
import pnlIcon from '@/assets/icons3d/pnl.png';
import winrateIcon from '@/assets/icons3d/winrate.png';
import disciplineIcon from '@/assets/icons3d/discipline.png';
import equityCurveIcon from '@/assets/icons3d/equity_curve.png';
import taxometerIcon from '@/assets/icons3d/taxometer.png';
import activityIcon from '@/assets/icons3d/activity.png';

export const icon3dRegistry = {
  dashboard: dashboardIcon,
  journal: journalIcon,
  analytics: analyticsIcon,
  brain: brainIcon,
  newTrade: newTradeIcon,
  checkin: checkinIcon,
  balance: balanceIcon,
  pnl: pnlIcon,
  winrate: winrateIcon,
  discipline: disciplineIcon,
  equityCurve: equityCurveIcon,
  taxometer: taxometerIcon,
  activity: activityIcon,
} as const;

export type Icon3DName = keyof typeof icon3dRegistry;
