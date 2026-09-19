import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';

import { ClientConnectionAccepted } from './client-connection-accepted.component';

const phone = '(75) 98888-0502';
const email = 'luiz.advogada@gmail.com';

describe('ClientConnectionAccepted', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('opens mailto when the email is pressed', () => {
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined as never);

    render(<ClientConnectionAccepted email={email} phone={phone} />);

    fireEvent.press(screen.getByRole('button', { name: email }));

    expect(openURL).toHaveBeenCalledWith(`mailto:${email}`);
  });

  it('opens a menu with Ligar, SMS and WhatsApp after pressing the phone', () => {
    render(<ClientConnectionAccepted email={email} phone={phone} />);

    expect(screen.queryByRole('button', { name: 'Ligar' })).toBeNull();

    fireEvent.press(screen.getByRole('button', { name: phone }));

    expect(screen.getByRole('button', { name: 'Ligar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'SMS' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'WhatsApp' })).toBeTruthy();
  });

  it('opens tel, sms and WhatsApp from the phone menu', () => {
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined as never);

    render(<ClientConnectionAccepted email={email} phone={phone} />);
    fireEvent.press(screen.getByRole('button', { name: phone }));

    fireEvent.press(screen.getByRole('button', { name: 'Ligar' }));
    expect(openURL).toHaveBeenCalledWith('tel:+5575988880502');

    fireEvent.press(screen.getByRole('button', { name: phone }));
    fireEvent.press(screen.getByRole('button', { name: 'SMS' }));
    expect(openURL).toHaveBeenCalledWith('sms:+5575988880502');

    fireEvent.press(screen.getByRole('button', { name: phone }));
    fireEvent.press(screen.getByRole('button', { name: 'WhatsApp' }));
    expect(openURL).toHaveBeenCalledWith('https://wa.me/5575988880502');
  });
});
