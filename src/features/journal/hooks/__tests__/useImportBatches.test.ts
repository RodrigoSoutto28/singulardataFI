import { describe, it, expect } from 'vitest';
import { hashFile, hashRow } from '../useImportBatches';

function makeFile(content: string, name = 'a.csv'): File {
  return new File([content], name, { type: 'text/csv' });
}

describe('useImportBatches — hashing', () => {
  it('hashFile produces the same hash for identical content', async () => {
    const a = await hashFile(makeFile('hello,world\n1,2'));
    const b = await hashFile(makeFile('hello,world\n1,2', 'other.csv'));
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('hashFile differs for different content', async () => {
    const a = await hashFile(makeFile('one'));
    const b = await hashFile(makeFile('two'));
    expect(a).not.toBe(b);
  });

  it('hashRow is stable and depends on userId', async () => {
    const u1 = await hashRow('user-1', 'EURUSD|2025-01-15');
    const u1Again = await hashRow('user-1', 'EURUSD|2025-01-15');
    const u2 = await hashRow('user-2', 'EURUSD|2025-01-15');
    expect(u1).toBe(u1Again);
    expect(u1).not.toBe(u2);
  });
});
