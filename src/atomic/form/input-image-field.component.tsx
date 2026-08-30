import { useCallback, useState } from 'react';
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form';

import type { ArquivoFinalidade } from '@/data/arquivo';
import { uploadLocalImage } from '@/data/arquivo';
import { getErrorMessage } from '@/data/http';
import { useBanner } from '@/atomic/feedback-banner';

import {
  ImageField,
  type ImageFieldMultiProps,
  type ImageFieldSingleProps,
} from './image-field.component';
import { validateImageUriList } from './validate-image-uri-list';

type InputImageFieldBaseProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  emptyTitle?: string;
  emptyCaption?: string;
  aspect?: [number, number];
  maxCount?: number;
  /** When set with `keyName`, uploads to S3 after crop and stores the object key(s). */
  uploadFinalidade?: ArquivoFinalidade;
  keyName?: FieldPath<TFieldValues>;
  /** When true, empty value fails validation. */
  required?: boolean;
  /**
   * Minimum images when `multiple`.
   * - With `required`: must reach this count.
   * - Without `required`: 0 images OR at least this count (e.g. OAB frente+verso).
   */
  minCount?: number;
};

export type InputImageFieldSingleProps<TFieldValues extends FieldValues = FieldValues> =
  InputImageFieldBaseProps<TFieldValues> & {
    multiple?: false;
  };

export type InputImageFieldMultiProps<TFieldValues extends FieldValues = FieldValues> =
  InputImageFieldBaseProps<TFieldValues> & {
    multiple: true;
  };

export type InputImageFieldProps<TFieldValues extends FieldValues = FieldValues> =
  | InputImageFieldSingleProps<TFieldValues>
  | InputImageFieldMultiProps<TFieldValues>;

export function InputImageField<TFieldValues extends FieldValues = FieldValues>(
  props: InputImageFieldProps<TFieldValues>,
) {
  const { control, setValue, getValues, clearErrors, setError } =
    useFormContext<TFieldValues>();
  const banner = useBanner();
  const {
    name,
    label,
    emptyTitle,
    emptyCaption,
    aspect,
    maxCount,
    multiple,
    uploadFinalidade,
    keyName,
    required = false,
    minCount,
  } = props;
  const [isUploading, setIsUploading] = useState(false);

  const uploadSingle = useCallback(
    async (uri: string, onChangeUri: (next: string) => void) => {
      if (!uploadFinalidade || !keyName) {
        onChangeUri(uri);
        return;
      }

      setIsUploading(true);
      try {
        const key = await uploadLocalImage({
          uri,
          finalidade: uploadFinalidade,
        });
        onChangeUri(uri);
        setValue(keyName, key as PathValue<TFieldValues, FieldPath<TFieldValues>>, {
          shouldDirty: true,
          shouldValidate: true,
        });
        clearErrors([name, keyName]);
      } catch (error) {
        const message = getErrorMessage(error, 'Não foi possível enviar a imagem.');
        banner(message, 'error');
        setError(keyName, { type: 'manual', message });
      } finally {
        setIsUploading(false);
      }
    },
    [banner, clearErrors, keyName, name, setError, setValue, uploadFinalidade],
  );

  const syncMultiKeys = useCallback(
    (nextUris: string[], previousUris: string[], previousKeys: string[]) => {
      return previousUris
        .map((uri, index) => ({ uri, key: previousKeys[index] ?? '' }))
        .filter((item) => nextUris.includes(item.uri))
        .map((item) => item.key)
        .filter(Boolean);
    },
    [],
  );

  const uploadMultiAppend = useCallback(
    async (
      newUri: string,
      previousUris: string[],
      onChangeUris: (next: string[]) => void,
    ) => {
      if (!uploadFinalidade || !keyName) {
        onChangeUris([...previousUris, newUri]);
        return;
      }

      const previousKeys = (getValues(keyName) as string[] | undefined) ?? [];
      setIsUploading(true);
      try {
        const key = await uploadLocalImage({
          uri: newUri,
          finalidade: uploadFinalidade,
        });
        const nextUris = [...previousUris, newUri];
        const nextKeys = [...previousKeys, key];
        onChangeUris(nextUris);
        setValue(keyName, nextKeys as PathValue<TFieldValues, FieldPath<TFieldValues>>, {
          shouldDirty: true,
          shouldValidate: true,
        });
        clearErrors([name, keyName]);
      } catch (error) {
        const message = getErrorMessage(error, 'Não foi possível enviar a imagem.');
        banner(message, 'error');
        setError(keyName, { type: 'manual', message });
      } finally {
        setIsUploading(false);
      }
    },
    [banner, clearErrors, getValues, keyName, name, setError, setValue, uploadFinalidade],
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          const base = validateImageUriList(value, {
            required,
            minCount,
            multiple: Boolean(multiple),
          });
          if (base !== true) {
            return base;
          }

          if (multiple) {
            const uris = Array.isArray(value) ? value.filter(Boolean) : [];
            if (uris.length > 0 && keyName) {
              const keys = (getValues(keyName) as string[] | undefined) ?? [];
              if (keys.filter(Boolean).length < uris.length) {
                return 'Aguarde o envio da imagem ou tente novamente';
              }
            }
            return true;
          }

          if (required && keyName) {
            const key = String(getValues(keyName) ?? '').trim();
            if (!key) {
              return 'Aguarde o envio da imagem ou tente novamente';
            }
          }
          return true;
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        if (multiple) {
          const currentUris = Array.isArray(value) ? value.filter(Boolean) : [];
          const fieldProps: ImageFieldMultiProps = {
            multiple: true,
            label,
            emptyTitle,
            emptyCaption,
            aspect,
            maxCount,
            value: currentUris,
            isUploading,
            errorMessage: error?.message,
            onChange: (nextUris) => {
              const previousUris = currentUris;
              const previousKeys =
                (keyName
                  ? ((getValues(keyName) as string[] | undefined) ?? [])
                  : []) ?? [];

              if (nextUris.length < previousUris.length) {
                onChange(nextUris);
                if (keyName) {
                  const nextKeys = syncMultiKeys(nextUris, previousUris, previousKeys);
                  setValue(
                    keyName,
                    nextKeys as PathValue<TFieldValues, FieldPath<TFieldValues>>,
                    { shouldDirty: true, shouldValidate: true },
                  );
                }
                return;
              }

              if (nextUris.length > previousUris.length) {
                const addedUri = nextUris[nextUris.length - 1];
                if (addedUri) {
                  void uploadMultiAppend(addedUri, previousUris, onChange);
                }
                return;
              }

              onChange(nextUris);
            },
          };
          return <ImageField {...fieldProps} />;
        }

        const fieldProps: ImageFieldSingleProps = {
          multiple: false,
          label,
          emptyTitle,
          emptyCaption,
          aspect,
          value: typeof value === 'string' ? value : '',
          isUploading,
          errorMessage: error?.message,
          onChange: (nextUri) => {
            if (!nextUri) {
              onChange('');
              if (keyName) {
                setValue(
                  keyName,
                  '' as PathValue<TFieldValues, FieldPath<TFieldValues>>,
                  { shouldDirty: true, shouldValidate: true },
                );
              }
              return;
            }
            void uploadSingle(nextUri, onChange);
          },
        };
        return <ImageField {...fieldProps} />;
      }}
    />
  );
}
