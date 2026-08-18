import { fireEvent, render } from '@testing-library/react-native';

import { ImageField } from './image-field.component';

jest.mock('expo-symbols', () => ({
  SymbolView: 'SymbolView',
}));

jest.mock('@/utils/pick-image-from-gallery', () => ({
  pickImageFromGallery: jest.fn(),
}));

jest.mock('./image-edit-modal.component', () => ({
  ImageEditModal: () => null,
}));

describe('ImageField', () => {
  it('hides the add button for a single filled image', () => {
    const onChange = jest.fn();
    const screen = render(
      <ImageField
        label="Foto da Carteira"
        value="file://front.jpg"
        onChange={onChange}
      />,
    );

    expect(screen.getByText('Foto da Carteira')).toBeTruthy();
    expect(screen.getByLabelText('Remover imagem')).toBeTruthy();
    expect(screen.queryByLabelText('Adicionar imagem')).toBeNull();
  });

  it('shows the add button when multiple is enabled', () => {
    const onChange = jest.fn();
    const screen = render(
      <ImageField
        multiple
        label="Anexos"
        value={['file://one.jpg']}
        onChange={onChange}
      />,
    );

    expect(screen.getByLabelText('Adicionar imagem')).toBeTruthy();
    expect(screen.getByLabelText('Remover imagem 1')).toBeTruthy();
  });

  it('switches preview when an unselected thumbnail is pressed', () => {
    const onChange = jest.fn();
    const screen = render(
      <ImageField
        multiple
        label="Anexos"
        value={['file://one.jpg', 'file://two.jpg']}
        onChange={onChange}
      />,
    );

    fireEvent.press(screen.getByLabelText('Selecionar imagem 2'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Remover imagem 2')).toBeTruthy();
    expect(screen.getByLabelText('Selecionar imagem 1')).toBeTruthy();
  });

  it('shows the standard error border, icon, and caption', () => {
    const onChange = jest.fn();
    const screen = render(
      <ImageField
        multiple
        label="Foto da Carteira"
        value={['file://front.jpg']}
        errorMessage="Anexe as fotos de frente e verso"
        onChange={onChange}
      />,
    );

    expect(screen.getByText('Anexe as fotos de frente e verso')).toBeTruthy();
    expect(screen.getByLabelText('Pré-visualização de Foto da Carteira')).toBeTruthy();
  });
});
