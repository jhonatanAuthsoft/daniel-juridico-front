import { Linking } from 'react-native';

export const SUPPORT_EMAIL = 'support@laweact.com';

export function openSupportEmail() {
  return Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
}
