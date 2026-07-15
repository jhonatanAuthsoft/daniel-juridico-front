import type { PropsWithChildren } from 'react';
import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';

export type FormProps<TFieldValues extends FieldValues> = PropsWithChildren<
  UseFormReturn<TFieldValues>
>;

/**
 * Spreads react-hook-form methods into FormProvider so fields can use useFormContext.
 *
 * @example
 * const form = useForm();
 * return (
 *   <Form {...form}>
 *     <InputTextField name="email" label="E-mail" />
 *   </Form>
 * );
 */
export function Form<TFieldValues extends FieldValues>({
  children,
  ...methods
}: FormProps<TFieldValues>) {
  return <FormProvider {...methods}>{children}</FormProvider>;
}
