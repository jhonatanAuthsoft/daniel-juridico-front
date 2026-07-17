import { Redirect } from 'expo-router';

import { useAuth } from '@/domain/auth';

export default function Index() {
  const { isAuthenticated, homeHref } = useAuth();

  if (isAuthenticated) {
    return <Redirect href={homeHref} />;
  }

  return <Redirect href="/login" />;
}
