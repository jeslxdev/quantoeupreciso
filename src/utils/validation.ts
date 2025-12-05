export const sanitizeText = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 200);
};

export const sanitizeNumber = (value: number): number => {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }
  return Math.max(0, Math.min(num, 999999999));
};

export const validateDate = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const monthsBetween = (date1: Date, date2: Date): number => {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12 +
                 (date2.getMonth() - date1.getMonth());
  return Math.max(1, months);
};
