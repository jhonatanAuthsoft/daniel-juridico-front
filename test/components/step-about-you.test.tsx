import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { BrandColors } from '@/constants/theme';
import { defaultValues } from '@/components/signup-lawyer/constants';
import { StepAboutYou } from '@/components/signup-lawyer/step-about-you/step-about-you.component';

jest.mock('expo-symbols', () => ({
  SymbolView: 'SymbolView',
}));

jest.mock('@/hooks/use-image-edit-flow', () => ({
  useImageEditFlow: () => ({
    pickEditedImage: jest.fn(),
    editModal: null,
    isUploading: false,
  }),
}));

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) {
    return {};
  }
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.filter(Boolean).map(flattenStyle));
  }
  return style as Record<string, unknown>;
}

function StepHarness() {
  const form = useForm({
    defaultValues,
    mode: 'onBlur',
  });

  return (
    <FormProvider {...form}>
      <StepAboutYou />
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void form.trigger('profileImageKey');
        }}>
        <Text>Continuar</Text>
      </Pressable>
    </FormProvider>
  );
}

describe('StepAboutYou', () => {
  it('shows a red border on the empty profile image dropzone after validation', async () => {
    const screen = render(<StepHarness />);
    const dropzone = screen.getByLabelText('Adicionar imagem de perfil');

    expect(flattenStyle(dropzone.props.style).borderColor).toBe(
      BrandColors.neutral.white,
    );

    fireEvent.press(screen.getByText('Continuar'));

    await waitFor(() => {
      expect(screen.getByText('Adicione e envie uma imagem de perfil')).toBeTruthy();
      expect(
        flattenStyle(screen.getByLabelText('Adicionar imagem de perfil').props.style)
          .borderColor,
      ).toBe(BrandColors.feedback.error.medium);
    });
  });
});
