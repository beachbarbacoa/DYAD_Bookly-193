export const renderSafe = (value: any, fallback = '') => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}