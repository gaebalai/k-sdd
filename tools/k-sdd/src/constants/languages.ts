export const supportedLanguages = [
  'ko',
  'en',
  'zh-TW',
  'zh',
  'es',
  'pt',
  'de',
  'fr',
  'ru',
  'it',
  'ja',
  'ar',
  'el',
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];
