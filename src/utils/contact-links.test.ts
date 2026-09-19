import {
  buildMailtoUrl,
  buildSmsUrl,
  buildTelUrl,
  buildWhatsAppUrl,
} from './contact-links';

describe('contact-links', () => {
  it('builds a mailto url from the email', () => {
    expect(buildMailtoUrl('luiz.advogada@gmail.com')).toBe(
      'mailto:luiz.advogada@gmail.com',
    );
  });

  it('returns null for an empty or invalid email', () => {
    expect(buildMailtoUrl('')).toBeNull();
    expect(buildMailtoUrl('   ')).toBeNull();
    expect(buildMailtoUrl('sem-arroba')).toBeNull();
  });

  it('builds tel, sms and WhatsApp urls from a masked Brazilian mobile', () => {
    const phone = '(75) 98888-0502';

    expect(buildTelUrl(phone)).toBe('tel:+5575988880502');
    expect(buildSmsUrl(phone)).toBe('sms:+5575988880502');
    expect(buildWhatsAppUrl(phone)).toBe('https://wa.me/5575988880502');
  });

  it('does not prefix 55 twice when the number already has the country code', () => {
    expect(buildWhatsAppUrl('+55 75 98888-0502')).toBe('https://wa.me/5575988880502');
    expect(buildTelUrl('5575988880502')).toBe('tel:+5575988880502');
  });

  it('returns null for an empty or incomplete phone', () => {
    expect(buildTelUrl('')).toBeNull();
    expect(buildSmsUrl('1234')).toBeNull();
    expect(buildWhatsAppUrl('Não informado')).toBeNull();
  });
});
