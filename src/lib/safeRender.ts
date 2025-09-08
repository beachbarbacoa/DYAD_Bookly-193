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

export const SafeRender = ({ value, fallback }: { value: unknown, fallback?: ReactNode }) => {
  if (value === null || value === undefined) return fallback || null;
  if (typeof value === 'object') {
    try {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    } catch {
      return fallback || null;
    }
  }
  return <>{String(value)}</>;
};