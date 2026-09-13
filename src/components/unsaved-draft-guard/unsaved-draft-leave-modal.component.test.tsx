import { fireEvent, render, screen } from '@testing-library/react-native';

import { UnsavedDraftLeaveModal } from './unsaved-draft-leave-modal.component';

describe('UnsavedDraftLeaveModal', () => {
  it('explains the unsaved item and offers cancel or continue', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    render(
      <UnsavedDraftLeaveModal
        itemLabel="OAB suplementar"
        onCancel={onCancel}
        onConfirm={onConfirm}
        visible
      />,
    );

    expect(screen.getByText('Alterações não salvas')).toBeTruthy();
    expect(
      screen.getByText(
        'A OAB suplementar não foi salva. Se continuar, esses dados serão perdidos.',
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Cancelar'));
    expect(onCancel).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText('Continuar'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
