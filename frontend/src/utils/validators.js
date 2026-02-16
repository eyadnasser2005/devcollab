export function isRequired(value) {
  return String(value ?? '').trim().length > 0;
}

export function isEmail(value) {
  const email = String(value ?? '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function minLength(value, length) {
  return String(value ?? '').length >= Number(length || 0);
}

export function isNonNegativeNumber(value) {
  if (value === '' || value === null || value === undefined) return false;
  const number = Number(value);
  return !Number.isNaN(number) && number >= 0;
}
