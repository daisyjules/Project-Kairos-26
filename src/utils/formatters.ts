export function formatTZS(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'TZS 0';
  }

  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 1_000_000_000) {
      return `${sign}${(abs / 1_000_000_000).toFixed(2)}B TZS`;
    }
    if (abs >= 1_000_000) {
      return `${sign}${(abs / 1_000_000).toFixed(2)}M TZS`;
    }
    if (abs >= 1_000) {
      return `${sign}${(abs / 1_000).toFixed(1)}k TZS`;
    }
    return `${sign}${Math.round(abs).toLocaleString()} TZS`;
  }

  const rounded = Math.round(amount);
  const formatted = Math.abs(rounded).toLocaleString('en-US');
  return rounded < 0 ? `-TZS ${formatted}` : `TZS ${formatted}`;
}

export function formatNumber(val: number, decimals: number = 0): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(val: number | null | undefined, decimals: number = 1): string {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) return '0.0%';
  return `${Number(val).toFixed(decimals)}%`;
}

export function formatRatio(val: number | null | undefined, decimals: number = 2): string {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) return '0.00x';
  return `${Number(val).toFixed(decimals)}x`;
}
