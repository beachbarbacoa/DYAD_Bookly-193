import React from 'react';

export const renderSafe = (value: unknown, fallback = ''): string => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return fallback;
    }
  }
  return String(value);
};

interface SafeRenderProps {
  value: unknown;
  fallback?: React.ReactNode;
}

export const SafeRender: React.FC<SafeRenderProps> = ({ value, fallback }) => {
  if (value === null || value === undefined) return <>{fallback || null}</>;
  if (typeof value === 'object') {
    try {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    } catch {
      return <>{fallback || null}</>;
    }
  }
  return <>{String(value)}</>;
};