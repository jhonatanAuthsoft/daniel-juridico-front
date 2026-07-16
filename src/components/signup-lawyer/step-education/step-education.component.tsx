import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Link as TypographLink } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

export function StepEducation() {
  const { setValue } = useFormContext<LawyerSignupFormValues>();
  const [postgraduateOpen, setPostgraduateOpen] = useState(false);
  const [postgraduateSaved, setPostgraduateSaved] = useState(false);

  const clearPostgraduate = () => {
    setValue('postgraduateUniversity', '');
    setValue('postgraduateCourse', '');
    setValue('postgraduateYear', '');
  };

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <InputTextField
        name="university"
        label="Universidade de Formação"
        placeholder="Digite o nome da universidade"
        autoCapitalize="words"
      />
      <InputTextField
        name="course"
        label="Curso"
        placeholder="Digite o curso"
        autoCapitalize="sentences"
      />
      <InputTextField
        name="graduationYear"
        label="Ano de formação"
        placeholder="Digite o ano de formação"
        keyboardType="number-pad"
      />

      {postgraduateOpen ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Body1 color={BrandColors.neutral.white}>Pós-graduação</Body1>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar pós-graduação"
              hitSlop={Spacing.xxs}
              onPress={() => {
                setPostgraduateOpen(false);
                setPostgraduateSaved(false);
                clearPostgraduate();
              }}>
              <XIcon color={BrandColors.neutral.white} />
            </Pressable>
          </View>

          <Separator size="sm" />

          <InputTextField
            name="postgraduateUniversity"
            label="Universidade de Formação"
            placeholder="Digite o nome da universidade"
            autoCapitalize="words"
          />
          <InputTextField
            name="postgraduateCourse"
            label="Curso"
            placeholder="Digite o curso"
            autoCapitalize="sentences"
          />
          <InputTextField
            name="postgraduateYear"
            label="Ano de formação"
            placeholder="Digite o ano de formação"
            keyboardType="number-pad"
          />

          <Button
            variant="primary"
            onPress={() => {
              setPostgraduateSaved(true);
              setPostgraduateOpen(false);
            }}>
            Salvar
          </Button>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => setPostgraduateOpen(true)}
          style={styles.addLink}>
          <TypographLink color={BrandColors.primary.light}>
            {postgraduateSaved ? '+ Editar Pós-Graduação' : '+ Adicionar Pós-Graduação'}
          </TypographLink>
        </Pressable>
      )}

      {postgraduateSaved && !postgraduateOpen ? (
        <Body2 color={BrandColors.neutral.light}>Pós-graduação salva nesta etapa.</Body2>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  addLink: {
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
