import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

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
  const { control } = useFormContext<TFieldValues>();
  const { name, label, emptyTitle, emptyCaption, aspect, maxCount, multiple } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
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
          onChange,
        };
        return <ImageField {...fieldProps} />;
      }}
    />
  );
}
