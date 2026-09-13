import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { useAuth } from '@/domain/auth';

export default function Index() {
  const { isHydrating, homeHref } = useAuth();

  if (isHydrating) {
    return <View style={{ flex: 1, backgroundColor: BrandColors.neutral.xdark }} />;
  }

  return <Redirect href={homeHref} />;
}
