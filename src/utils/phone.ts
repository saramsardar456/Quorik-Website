/**
 * Formats a phone number for WhatsApp deep links (https://wa.me/<number>).
 * Handles local leading zero formats (e.g., 03214020330 -> 923214020330)
 * as well as international formats (+15550192834 -> 15550192834).
 */
export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '92' + clean.slice(1);
  }
  return clean;
}
