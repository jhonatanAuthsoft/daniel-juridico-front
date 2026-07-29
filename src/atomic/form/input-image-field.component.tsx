import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
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

import {
  ImageField,
  type ImageFieldMultiProps,
  type ImageFieldSingleProps,
} from './image-field.component';

type InputImageFieldBaseProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  emptyTitle?: string;
  emptyCaption?: string;
  aspect?: [number, number];
  maxCount?: number;
  /** When set with `keyName`, uploads to S3 after crop and stores the object key. */
  uploadFinalidade?: ArquivoFinalidade;
  keyName?: FieldPath<TFieldValues>;
  /** When true, empty URI fails validation. */
  required?: boolean;
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
  } = props;
  const [isUploading, setIsUploading] = useState(false);

  const uploadAndSet = useCallback(
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
        Alert.alert('Upload', message);
        setError(keyName, { type: 'manual', message });
      } finally {
        setIsUploading(false);
      }
    },
    [clearErrors, keyName, name, setError, setValue, uploadFinalidade],
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          if (!required) {
            return true;
          }
          const uri = typeof value === 'string' ? value.trim() : '';
          if (!uri) {
            return 'Campo obrigatório';
          }
          if (keyName) {
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
          const fieldProps: ImageFieldMultiProps = {
            multiple: true,
            label,
            emptyTitle,
            emptyCaption,
            aspect,
            maxCount,
            value: Array.isArray(value) ? value : [],
            onChange,
            isUploading,
            errorMessage: error?.message,
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
            void uploadAndSet(nextUri, onChange);
          },
        };
        return <ImageField {...fieldProps} />;
      }}
    />
  );
}
