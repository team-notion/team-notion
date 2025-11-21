import { useMemo } from "react";

interface NumberFormatOptions {
  decimals?: number;
  commas?: boolean;
  prefix?: string;
  suffix?: string;
}

function formatNumber(value: number | string | null | undefined, options: NumberFormatOptions = {}) {
  const {
    decimals = 2,
    commas = true,
    prefix = '',
    suffix = ''
  } = options;

  if (value === null || value === undefined || isNaN(Number(value))) {
    return '-';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: commas
  }).format(Number(value));

  return `${prefix}${formatted}${suffix}`;
}

export const useNumberFormatter = (options = {}) => {
  return useMemo(() => {
    return (value) => formatNumber(value, options);
  }, [options]);
};