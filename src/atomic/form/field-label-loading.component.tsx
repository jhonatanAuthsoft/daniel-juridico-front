import { ActivityIndicator, StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/theme';

type FieldLabelLoadingProps = {
  visible?: boolean;
};

export function FieldLabelLoading({ visible = false }: FieldLabelLoadingProps) {
  if (!visible) {
    return null;
  }

  return (
    <ActivityIndicator
      accessible
      accessibilityLabel="Carregando"
      color={BrandColors.primary.light}
      size="small"
      style={styles.spinner}
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    transform: [{ scale: 0.7 }],
  },
});
