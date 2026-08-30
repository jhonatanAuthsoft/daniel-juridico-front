import { Pressable, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, useForm } from '@/atomic/form';
import { Link } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateLawyerDocumentation } from '@/domain/lawyer';

import {
  createEmptySupplementalOab,
  MAX_SUPPLEMENTAL_OABS,
  type DocumentationForm,
} from './lawyer-edit-profile';
import { OabEntryCard } from './oab-entry-card.component';
import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type ExpandedId = 'primary' | number | null;
type EditingId = 'primary' | number | null;

export function LawyerEditDocumentationScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateDocumentation = useUpdateLawyerDocumentation();
  const form = useForm<DocumentationForm>({
    defaultValues: {
      oabNumber: profile.oabNumber,
      oabUf: profile.oabUf,
      oabIssueDate: profile.oabIssueDate,
      oabPhotoUris: profile.oabPhotoUris,
      oabPhotoKeys: profile.oabPhotoKeys,
      supplementalOabs: profile.supplementalOabs,
    },
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      oabNumber: fromMe.oabNumber,
      oabUf: fromMe.oabUf,
      oabIssueDate: fromMe.oabIssueDate,
      oabPhotoUris: fromMe.oabPhotoUris,
      oabPhotoKeys: fromMe.oabPhotoKeys,
      supplementalOabs: fromMe.supplementalOabs,
    });
  }, [form, fromMe]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'supplementalOabs',
  });
  const [expandedId, setExpandedId] = useState<ExpandedId>(
    fields.length > 0 ? 0 : 'primary',
  );
  const [editingId, setEditingId] = useState<EditingId>(null);
  const [isCreating, setIsCreating] = useState(false);

  const oabNumber = useWatch({ control: form.control, name: 'oabNumber' }) ?? '';
  const oabUf = useWatch({ control: form.control, name: 'oabUf' }) ?? '';
  const oabPhotoUris = useWatch({ control: form.control, name: 'oabPhotoUris' }) ?? [];
  const supplementalOabs =
    useWatch({ control: form.control, name: 'supplementalOabs' }) ?? [];

  const canAddMore =
    editingId === null && fields.length < MAX_SUPPLEMENTAL_OABS;

  const toggle = (id: ExpandedId) => {
    if (editingId != null) {
      return;
    }
    setExpandedId((current) => (current === id ? null : id));
  };

  const startEdit = (id: Exclude<EditingId, null>) => {
    setIsCreating(false);
    setExpandedId(id);
    setEditingId(id);
  };

  const closeEdit = () => {
    if (editingId == null) {
      return;
    }
    if (isCreating && typeof editingId === 'number') {
      remove(editingId);
      setExpandedId(null);
    }
    setIsCreating(false);
    setEditingId(null);
  };

  const startCreate = () => {
    if (fields.length >= MAX_SUPPLEMENTAL_OABS) {
      return;
    }
    append(createEmptySupplementalOab());
    setIsCreating(true);
    setExpandedId(fields.length);
    setEditingId(fields.length);
  };

  const deleteSupplemental = (index: number) => {
    remove(index);
    if (editingId === index) {
      setEditingId(null);
      setIsCreating(false);
    } else if (typeof editingId === 'number' && editingId > index) {
      setEditingId(editingId - 1);
    }
    if (expandedId === index) {
      setExpandedId(null);
    } else if (typeof expandedId === 'number' && expandedId > index) {
      setExpandedId(expandedId - 1);
    }
  };

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateDocumentation.mutateAsync({
        oabNumber: formValues.oabNumber,
        oabUf: formValues.oabUf,
        oabIssueDate: formValues.oabIssueDate,
        oabPhotoKeys: formValues.oabPhotoKeys,
        supplementalOabs: formValues.supplementalOabs.map((entry) => ({
          number: entry.number,
          uf: entry.uf,
          issueDate: entry.issueDate,
          photoKeys: entry.photoKeys,
        })),
      });
      router.back();
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
        'error',
      );
    }
  });

  return (
    <AccountStackScreen title="Alterar documentação">
      <Form {...form}>
        <View style={styles.list}>
          <OabEntryCard
            title="OAB Principal"
            number={oabNumber}
            uf={oabUf}
            photoUris={oabPhotoUris}
            isExpanded={expandedId === 'primary'}
            isEditing={editingId === 'primary'}
            numberName="oabNumber"
            ufName="oabUf"
            issueDateName="oabIssueDate"
            photosName="oabPhotoUris"
            keysName="oabPhotoKeys"
            onToggle={() => toggle('primary')}
            onEdit={() => startEdit('primary')}
            onCloseEdit={closeEdit}
          />

          {fields.map((field, index) => {
            const entry = supplementalOabs[index] ?? field;
            return (
              <OabEntryCard
                key={field.id}
                title="OAB Suplementar"
                number={entry.number}
                uf={entry.uf}
                photoUris={entry.photoUris ?? []}
                isExpanded={expandedId === index}
                isEditing={editingId === index}
                canDelete
                numberName={`supplementalOabs.${index}.number`}
                ufName={`supplementalOabs.${index}.uf`}
                issueDateName={`supplementalOabs.${index}.issueDate`}
                photosName={`supplementalOabs.${index}.photoUris`}
                keysName={`supplementalOabs.${index}.photoKeys`}
                onToggle={() => toggle(index)}
                onEdit={() => startEdit(index)}
                onCloseEdit={closeEdit}
                onDelete={() => deleteSupplemental(index)}
              />
            );
          })}

          {canAddMore ? (
            <Pressable
              accessibilityLabel="Adicionar OAB suplementar"
              accessibilityRole="button"
              onPress={startCreate}
              style={({ pressed }) => [styles.addRow, pressed && styles.pressed]}>
              <Link color={BrandColors.primary.light}>+ Adicionar OAB Suplementar</Link>
            </Pressable>
          ) : null}
        </View>
      </Form>
      <Button
        disabled={updateDocumentation.isPending}
        isLoading={updateDocumentation.isPending}
        onPress={() => void onSubmit()}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
    width: '100%',
  },
  addRow: {
    alignSelf: 'flex-start',
    minHeight: 40,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
