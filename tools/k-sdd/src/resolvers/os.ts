export type OSType = 'mac' | 'windows' | 'linux';

type EnvLike = {
  platform?: string;
  env?: Record<string, string | undefined>;
};

export const resolveOs = (input: 'auto' | OSType, runtime: EnvLike = {}): OSType => {
  if (input !== 'auto') return input;

  const platform = runtime.platform ?? process.platform;

  if (platform === 'darwin') return 'mac';
  if (platform === 'win32') return 'windows';
  if (platform === 'linux') {
    // WSL은 최종적으로 linux로 취급
    return 'linux';
  }

  // 알 수 없는 플랫폼은 linux로 폴백
  return 'linux';
};
