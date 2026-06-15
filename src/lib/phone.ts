// Phone-number helpers for building messaging deep links.
// Patient numbers may be stored in national format (e.g. "070-123 45 67").
// We default such numbers to Sweden (+46) since the patient base is Swedish.

const DEFAULT_COUNTRY_CODE = '46';

/**
 * International digits only (no "+"), as required by wa.me links.
 * "070-123 45 67" -> "4670123 4567" cleaned -> "46701234567"
 */
export const toWhatsAppNumber = (raw: string, countryCode = DEFAULT_COUNTRY_CODE): string => {
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return cleaned.slice(1);
  if (cleaned.startsWith('00')) return cleaned.slice(2);
  const digits = cleaned.replace(/\D/g, '');
  if (digits.startsWith('0')) return countryCode + digits.slice(1);
  return digits;
};

/**
 * E.164-style number (with leading "+") for sms: links.
 */
export const toSmsNumber = (raw: string, countryCode = DEFAULT_COUNTRY_CODE): string => {
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('00')) return '+' + cleaned.slice(2);
  if (cleaned.startsWith('0')) return '+' + countryCode + cleaned.slice(1);
  return '+' + cleaned;
};
