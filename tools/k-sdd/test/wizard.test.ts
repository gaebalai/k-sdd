import { describe, it, expect } from 'vitest';
import {
  confirmFinalProceed,
  ensureBackupSelection,
  ensureKiroDirSelection,
  ensureLanguageSelection,
  ensureProfileSelection,
} from '../src/cli/wizard';

const makeIO = () => {
  const logs: string[] = [];
  const errs: string[] = [];
  let exitCode: number | null = null;
  return {
    io: {
      log: (m: string) => logs.push(m),
      error: (m: string) => errs.push(m),
      exit: (c: number) => {
        exitCode = c;
      },
    },
    get logs() {
      return logs;
    },
    get errs() {
      return errs;
    },
    get exitCode() {
      return exitCode;
    },
  };
};

describe('wizard ensure*', () => {
  describe('non-TTY environment (vitest default)', () => {
    it('ensureLanguageSelection returns provided value as-is', async () => {
      const ctx = makeIO();
      const out = await ensureLanguageSelection('ko', false, ctx.io);
      expect(out).toBe('ko');
      expect(ctx.logs).toEqual([]);
    });

    it('ensureLanguageSelection falls back to "en" without prompt', async () => {
      const ctx = makeIO();
      const out = await ensureLanguageSelection(undefined, false, ctx.io);
      expect(out).toBe('en');
      expect(ctx.logs).toEqual([]);
    });

    it('ensureKiroDirSelection returns provided value as-is', async () => {
      const ctx = makeIO();
      const out = await ensureKiroDirSelection('docs/specs', false, ctx.io);
      expect(out).toBe('docs/specs');
    });

    it('ensureKiroDirSelection returns undefined without prompt (lets default apply)', async () => {
      const ctx = makeIO();
      const out = await ensureKiroDirSelection(undefined, false, ctx.io);
      expect(out).toBeUndefined();
      expect(ctx.logs).toEqual([]);
    });

    it('ensureProfileSelection returns provided value as-is', async () => {
      const ctx = makeIO();
      const out = await ensureProfileSelection('minimal', false, ctx.io);
      expect(out).toBe('minimal');
    });

    it('ensureProfileSelection returns undefined without prompt', async () => {
      const ctx = makeIO();
      const out = await ensureProfileSelection(undefined, false, ctx.io);
      expect(out).toBeUndefined();
    });

    it('ensureBackupSelection passes through explicit value', async () => {
      const ctx = makeIO();
      const out = await ensureBackupSelection(true, false, ctx.io);
      expect(out).toBe(true);
    });

    it('ensureBackupSelection passes through string backup dir', async () => {
      const ctx = makeIO();
      const out = await ensureBackupSelection('custom-backup', false, ctx.io);
      expect(out).toBe('custom-backup');
    });

    it('ensureBackupSelection returns undefined without prompt', async () => {
      const ctx = makeIO();
      const out = await ensureBackupSelection(undefined, false, ctx.io);
      expect(out).toBeUndefined();
    });

    it('confirmFinalProceed returns true without prompt', async () => {
      const ctx = makeIO();
      const out = await confirmFinalProceed(false, ctx.io);
      expect(out).toBe(true);
    });
  });

  describe('with --yes flag', () => {
    it('ensureLanguageSelection skips prompt and returns default', async () => {
      const ctx = makeIO();
      const out = await ensureLanguageSelection(undefined, true, ctx.io);
      expect(out).toBe('en');
      expect(ctx.logs).toEqual([]);
    });

    it('ensureLanguageSelection still respects explicit value', async () => {
      const ctx = makeIO();
      const out = await ensureLanguageSelection('ja', true, ctx.io);
      expect(out).toBe('ja');
    });

    it('ensureKiroDirSelection returns undefined', async () => {
      const ctx = makeIO();
      const out = await ensureKiroDirSelection(undefined, true, ctx.io);
      expect(out).toBeUndefined();
    });

    it('ensureProfileSelection returns undefined', async () => {
      const ctx = makeIO();
      const out = await ensureProfileSelection(undefined, true, ctx.io);
      expect(out).toBeUndefined();
    });

    it('ensureBackupSelection returns undefined', async () => {
      const ctx = makeIO();
      const out = await ensureBackupSelection(undefined, true, ctx.io);
      expect(out).toBeUndefined();
    });

    it('confirmFinalProceed returns true', async () => {
      const ctx = makeIO();
      const out = await confirmFinalProceed(true, ctx.io);
      expect(out).toBe(true);
    });
  });
});
