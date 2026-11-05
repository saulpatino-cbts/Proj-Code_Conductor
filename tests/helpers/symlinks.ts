import { existsSync, symlinkSync } from 'node:fs';

export function createTestSymlink(target: string, path: string, type: 'file' | 'dir'): boolean {
  const linkType = process.platform === 'win32' && type === 'dir' && existsSync(target) ? 'junction' : type;
  try {
    symlinkSync(target, path, linkType);
    return true;
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string' ? error.code : undefined;
    if (process.platform === 'win32' && (code === 'EPERM' || code === 'EACCES')) return false;
    throw error;
  }
}
