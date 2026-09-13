import { Pressable, Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import {
  UnsavedDraftProvider,
  useRegisterUnsavedDraft,
  useUnsavedDraftLeave,
} from './unsaved-draft-guard';

function DraftHost({
  filled,
  onLeft,
}: {
  filled: boolean;
  onLeft: () => void;
}) {
  const requestLeave = useUnsavedDraftLeave();
  useRegisterUnsavedDraft({
    itemLabel: 'OAB suplementar',
    hasUnsavedDraft: () => filled,
    discardUnsavedDraft: jest.fn(),
  });

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => requestLeave(onLeft)}>
      <Text>Sair</Text>
    </Pressable>
  );
}

describe('UnsavedDraftProvider', () => {
  it('asks before leaving a filled unsaved draft', () => {
    const onLeft = jest.fn();
    render(
      <UnsavedDraftProvider>
        <DraftHost filled onLeft={onLeft} />
      </UnsavedDraftProvider>,
    );

    fireEvent.press(screen.getByText('Sair'));
    expect(onLeft).not.toHaveBeenCalled();
    expect(screen.getByText('Alterações não salvas')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Cancelar'));
    expect(onLeft).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Sair'));
    fireEvent.press(screen.getByLabelText('Continuar'));
    expect(onLeft).toHaveBeenCalledTimes(1);
  });

  it('leaves immediately when the draft is empty', () => {
    const onLeft = jest.fn();
    render(
      <UnsavedDraftProvider>
        <DraftHost filled={false} onLeft={onLeft} />
      </UnsavedDraftProvider>,
    );

    fireEvent.press(screen.getByText('Sair'));
    expect(onLeft).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Alterações não salvas')).toBeNull();
  });
});
