// Backend deployed URL: https://skillora-1-qx0w.onrender.com
export const BACKEND_URL =
  (import.meta as any).env?.VITE_BACKEND_URL || 'https://skillora-1-qx0w.onrender.com';

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || `${BACKEND_URL.replace(/\/+$/, '')}/api/v1`;

/**
 * Resolves a media or file URL.
 * If the path is relative (e.g. '/uploads/logo.png'), it prefixes the deployed backend URL.
 */
export const getMediaUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanBase = BACKEND_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

