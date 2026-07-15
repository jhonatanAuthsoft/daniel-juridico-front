import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { Separator } from '@/atomic/separator';
import { Body1, InputCaption } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { SelectFieldShell } from '../select-field-shell';
import { signupClientSharedStyles } from '../shared.styles';

export function StepProfile() {
  return (
    <View style={signupClientSharedStyles.fields}>
      <SelectFieldShell
        name="pronouns"
        label="Pronomes de tratamento"
        placeholder="Selecione o pronome"
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adicionar imagem de perfil"
        style={styles.profileImagePlaceholder}
        onPress={() => {}}>
        <SymbolView
          name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
          size={28}
          tintColor={BrandColors.neutral.xlight}
        />
        <Separator size="xxs" />
        <Body1 color={BrandColors.primary.light}>Adicione uma imagem</Body1>
        <Separator size="xxxs" />
        <InputCaption color={BrandColors.neutral.light}>Formato: .jpeg, .png</InputCaption>
        <InputCaption color={BrandColors.neutral.light}>Tamanho máximo: 25 MB</InputCaption>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImagePlaceholder: {
    minHeight: 160,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
});
