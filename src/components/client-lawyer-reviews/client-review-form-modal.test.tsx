import { fireEvent, render, screen } from '@testing-library/react-native';

import { ClientReviewFormModal } from './client-review-form-modal.component';

describe('ClientReviewFormModal', () => {
  it('submits a rating without requiring a comment', () => {
    const onSubmit = jest.fn();

    render(
      <ClientReviewFormModal
        onClose={jest.fn()}
        onSubmit={onSubmit}
        visible
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Avaliar' }));

    expect(onSubmit).toHaveBeenCalledWith({ rating: 5, comment: '' });
    expect(screen.queryByText('Escreva sua avaliação.')).toBeNull();
  });
});
