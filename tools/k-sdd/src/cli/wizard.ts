import { supportedLanguages, type SupportedLanguage } from '../constants/languages.js';
import type { ParsedArgs } from './args.js';
import type { CliIO } from './io.js';
import { formatHeading } from './ui/colors.js';
import { isInteractive, promptConfirm, promptSelect, promptText } from './ui/prompt.js';

const LANG_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  ko: '한국어 (Korean)',
  'zh-TW': '繁體中文 (Traditional Chinese)',
  zh: '简体中文 (Simplified Chinese)',
  es: 'Español (Spanish)',
  pt: 'Português (Portuguese)',
  de: 'Deutsch (German)',
  fr: 'Français (French)',
  ru: 'Русский (Russian)',
  it: 'Italiano (Italian)',
  ja: '日本語 (Japanese)',
  ar: 'العربية (Arabic)',
  el: 'Ελληνικά (Greek)',
};

const DEFAULT_LANG: SupportedLanguage = 'en';
const DEFAULT_KIRO_DIR = '.kiro';

export const ensureLanguageSelection = async (
  current: SupportedLanguage | undefined,
  yes: boolean,
  io: CliIO,
): Promise<SupportedLanguage> => {
  if (current) return current;
  if (yes || !isInteractive()) return DEFAULT_LANG;

  io.log('');
  io.log(formatHeading('Select documentation language:'));
  const choices = supportedLanguages.map((value) => ({
    value,
    label: `${LANG_LABELS[value]} (${value})`,
  }));
  const defaultIndex = Math.max(
    choices.findIndex((c) => c.value === DEFAULT_LANG),
    0,
  );
  return promptSelect('Language', choices, defaultIndex);
};

export const ensureKiroDirSelection = async (
  current: string | undefined,
  yes: boolean,
  io: CliIO,
): Promise<string | undefined> => {
  if (current) return current;
  if (yes || !isInteractive()) return undefined;

  io.log('');
  io.log(formatHeading('Spec directory:'));
  return promptText('Path (relative to project root)', DEFAULT_KIRO_DIR);
};

export const ensureProfileSelection = async (
  current: 'full' | 'minimal' | undefined,
  yes: boolean,
  io: CliIO,
): Promise<'full' | 'minimal' | undefined> => {
  if (current) return current;
  if (yes || !isInteractive()) return undefined;

  io.log('');
  io.log(formatHeading('Template profile:'));
  return promptSelect<'full' | 'minimal'>(
    'Profile',
    [
      { value: 'full', label: 'Full', description: 'All commands and skills.' },
      { value: 'minimal', label: 'Minimal', description: 'Smaller subset for a quick trial.' },
    ],
    0,
  );
};

export const ensureBackupSelection = async (
  current: ParsedArgs['backup'],
  yes: boolean,
  io: CliIO,
): Promise<ParsedArgs['backup']> => {
  if (typeof current !== 'undefined') return current;
  if (yes || !isInteractive()) return undefined;

  io.log('');
  const enable = await promptConfirm(
    'Create a backup before overwriting existing files?',
    false,
  );
  return enable ? true : undefined;
};

export const confirmFinalProceed = async (
  yes: boolean,
  io: CliIO,
): Promise<boolean> => {
  if (yes || !isInteractive()) return true;
  io.log('');
  return promptConfirm('Proceed with installation?', true);
};
