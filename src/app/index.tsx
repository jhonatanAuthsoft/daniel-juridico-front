import { Redirect } from 'expo-router';

import { useAuth } from '@/domain/auth';

export default function Index() {
  const { isAuthenticated, homeHref, isHydrating, user } = useAuth();

  if (isHydrating) {
    return null;
  }

  if (isAuthenticated && user) {
    if (!user.termsAccepted) {
      return <Redirect href="/signup/terms" />;
    }
    return <Redirect href={homeHref} />;
  }

  return <Redirect href="/login" />;
}
