import { onlyDigits } from '@/utils/br-input';

function toBrazilianInternationalDigits(phone: string): string | null {
  const digits = onlyDigits(phone);
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return null;
}

export function buildMailtoUrl(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed.includes('@')) {
    return null;
  }
  return `mailto:${trimmed}`;
}

export function buildTelUrl(phone: string): string | null {
  const digits = toBrazilianInternationalDigits(phone);
  return digits ? `tel:+${digits}` : null;
}

export function buildSmsUrl(phone: string): string | null {
  const digits = toBrazilianInternationalDigits(phone);
  return digits ? `sms:+${digits}` : null;
}

export function buildWhatsAppUrl(phone: string): string | null {
  const digits = toBrazilianInternationalDigits(phone);
  return digits ? `https://wa.me/${digits}` : null;
}
