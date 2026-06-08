import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Smoke test for the unified single-step "Add Trade" dialog.
 * We assert the wizard-step logic was fully removed and the form
 * renders all relevant fields in a single panel, so the stop-loss
 * detection cannot fire on partial data anymore.
 */
describe('Journal — unified Add Trade form', () => {
  const src = readFileSync(
    resolve(__dirname, '../Journal.tsx'),
    'utf8',
  );

  it('removes all wizardStep state and conditionals', () => {
    expect(src).not.toMatch(/wizardStep\s*===\s*1/);
    expect(src).not.toMatch(/wizardStep\s*===\s*2/);
    expect(src).not.toMatch(/setWizardStep\(/);
    expect(src).not.toMatch(/useState<1 \| 2>/);
  });

  it('keeps the form submit guarded by zod, not by step', () => {
    expect(src).not.toMatch(/if \(wizardStep !== 2\) return/);
    expect(src).toMatch(/tradeFormSchema\.safeParse\(formData\)/);
  });

  it('renders entry price and stop loss inputs in the same form body', () => {
    const formStart = src.indexOf('<form onSubmit={handleAddTrade}');
    const formEnd = src.indexOf('</form>', formStart);
    expect(formStart).toBeGreaterThan(-1);
    expect(formEnd).toBeGreaterThan(formStart);
    const body = src.slice(formStart, formEnd);
    expect(body).toMatch(/formData\.entry_price/);
    expect(body).toMatch(/formData\.stop_loss/);
    expect(body).toMatch(/formData\.take_profit/);
    expect(body).toMatch(/formData\.exit_price/);
  });

  it('keeps psychological detection wired (Taxometer alert on missing SL)', () => {
    expect(src).toMatch(/detectPsychologicalErrors\(/);
    expect(src).toMatch(/setTaxometerOpen\(true\)/);
  });
});
