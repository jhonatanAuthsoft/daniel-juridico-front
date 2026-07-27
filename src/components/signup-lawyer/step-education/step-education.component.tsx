import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Link as TypographLink } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues, PostgraduateEntry } from '../types';

function createEmptyPostgraduate(): PostgraduateEntry {
  return {
    university: '',
    course: '',
    year: '',
  };
}

export function StepEducation() {
  const { control } = useFormContext<LawyerSignupFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'postgraduates',
  });
  const postgraduates = useWatch({ control, name: 'postgraduates' }) ?? [];

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const canAddMore = editingIndex === null;

  const startCreate = () => {
    append(createEmptyPostgraduate());
    setIsCreating(true);
    setEditingIndex(fields.length);
  };

  const startEdit = (index: number) => {
    setIsCreating(false);
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    if (editingIndex == null) {
      return;
    }

    if (isCreating) {
      remove(editingIndex);
    }

    setIsCreating(false);
    setEditingIndex(null);
  };

  const saveEdit = () => {
    setIsCreating(false);
    setEditingIndex(null);
  };

  const deleteAt = (index: number) => {
    remove(index);
    if (editingIndex == null) {
      return;
    }
    if (editingIndex === index) {
      setIsCreating(false);
      setEditingIndex(null);
      return;
    }
    if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
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

      {fields.map((field, index) => {
        if (editingIndex === index) {
          return (
            <View key={field.id} style={styles.editCard}>
              <View style={styles.editHeader}>
                <Body1 color={BrandColors.neutral.white}>Pós-graduação</Body1>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar pós-graduação"
                  hitSlop={Spacing.xxs}
                  onPress={cancelEdit}>
                  <XIcon color={BrandColors.neutral.white} />
                </Pressable>
              </View>

              <Separator size="sm" />

              <InputTextField
                name={`postgraduates.${index}.university`}
                label="Universidade de Formação"
                placeholder="Digite o nome da universidade"
                autoCapitalize="words"
              />
              <InputTextField
                name={`postgraduates.${index}.course`}
                label="Curso"
                placeholder="Digite o curso"
                autoCapitalize="sentences"
              />
              <InputTextField
                name={`postgraduates.${index}.year`}
                label="Ano de formação"
                placeholder="Digite o ano de formação"
                keyboardType="number-pad"
              />

              <Button variant="primary" onPress={saveEdit}>
                Salvar
              </Button>
            </View>
          );
        }

        const entry = postgraduates[index] ?? field;
        const universityYearLabel = [entry.university, entry.year].filter(Boolean).join(' - ');

        return (
          <View key={field.id} style={styles.savedCard}>
            <View style={styles.savedHeader}>
              <Body1 bold color={BrandColors.neutral.white}>
                Pós-graduação
              </Body1>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Excluir pós-graduação"
                hitSlop={Spacing.xxs}
                onPress={() => deleteAt(index)}>
                <SymbolView
                  name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                  size={20}
                  tintColor={BrandColors.primary.light}
                />
              </Pressable>
            </View>

            <Separator size="xxs" />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar pós-graduação"
              onPress={() => startEdit(index)}>
              <View style={styles.courseRow}>
                <SymbolView
                  name={{
                    ios: 'graduationcap',
                    android: 'school',
                    web: 'school',
                  }}
                  size={16}
                  tintColor={BrandColors.neutral.white}
                />
                <Body1 color={BrandColors.neutral.white}>
                  {entry.course || 'Nome do curso'}
                </Body1>
              </View>
              <Separator size="xxxs" />
              <Body1 color={BrandColors.primary.light}>
                {universityYearLabel || 'Universidade - Ano'}
              </Body1>
            </Pressable>
          </View>
        );
      })}

      {canAddMore ? (
        <Pressable
          accessibilityRole="button"
          onPress={startCreate}
          style={styles.addLink}>
          <TypographLink color={BrandColors.primary.light}>
            + Adicionar Pós-Graduação
          </TypographLink>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  addLink: {
    alignSelf: 'flex-start',
  },
  editCard: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedCard: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.dark,
    backgroundColor: BrandColors.neutral.xdark,
    padding: Spacing.sm,
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
});
