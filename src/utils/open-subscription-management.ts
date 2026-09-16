import { Linking, Platform } from 'react-native';

export function getSubscriptionManagementUrl(): string {
  return Platform.OS === 'ios'
    ? 'https://apps.apple.com/account/subscriptions'
    : 'https://play.google.com/store/account/subscriptions';
}

export function openSubscriptionManagement() {
  return Linking.openURL(getSubscriptionManagementUrl());
}
