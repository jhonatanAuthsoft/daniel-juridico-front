import { Linking, Platform } from 'react-native';

import {
  getSubscriptionManagementUrl,
  openSubscriptionManagement,
} from './open-subscription-management';

describe('open-subscription-management', () => {
  it('opens the platform subscriptions page', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined as never);

    await openSubscriptionManagement();

    expect(openURL).toHaveBeenCalledWith(getSubscriptionManagementUrl());
    expect(getSubscriptionManagementUrl()).toContain(
      Platform.OS === 'ios' ? 'apps.apple.com' : 'play.google.com',
    );

    openURL.mockRestore();
  });
});
