import { fireEvent, render, screen } from '@testing-library/react-native';

import { ClientLawyerReviews } from './client-lawyer-reviews.component';

jest.mock('@/components/profile-avatar', () => ({
  ProfileAvatar: () => null,
}));

const ownReview = {
  id: 'rev-own',
  reviewerName: 'Você',
  rating: 4,
  comment: 'Gostei do atendimento.',
  isOwn: true,
};

const otherReview = {
  id: 'rev-other',
  reviewerName: 'Ana Souza',
  rating: 2.5,
  comment: '',
};

describe('ClientLawyerReviews', () => {
  it('shows reviewer and stars without a comment block when comment is empty', () => {
    render(
      <ClientLawyerReviews
        reviews={[otherReview]}
        total={1}
      />,
    );

    expect(screen.getByText('Ana Souza')).toBeTruthy();
    expect(screen.getByLabelText('2,5 estrelas')).toBeTruthy();
    expect(screen.queryByText('Gostei do atendimento.')).toBeNull();
  });

  it('keeps the review action when the client already has a review for another connection', () => {
    render(
      <ClientLawyerReviews
        canReview
        reviews={[ownReview]}
        total={1}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Deixar uma avaliação' }),
    ).toBeTruthy();
  });

  it('loads the next page from Ver mais instead of expanding locally', () => {
    const onLoadMore = jest.fn();
    const reviews = Array.from({ length: 10 }, (_, index) => ({
      id: `rev-${index}`,
      reviewerName: `Cliente ${index + 1}`,
      rating: 5,
      comment: `Comentário ${index + 1}`,
    }));

    render(
      <ClientLawyerReviews
        hasNextPage
        onLoadMore={onLoadMore}
        reviews={reviews}
        total={12}
      />,
    );

    expect(screen.getByText('Cliente 10')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Ver mais' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('shows the reviews section with total and average stars', () => {
    render(
      <ClientLawyerReviews
        averageRating={4.5}
        reviews={[otherReview]}
        total={12}
      />,
    );

    expect(screen.getByText('Avaliações')).toBeTruthy();
    expect(screen.getByText('(12)')).toBeTruthy();
    expect(screen.getByLabelText('4,5 estrelas em média')).toBeTruthy();
    expect(screen.getByText('4,5')).toBeTruthy();
  });

  it('keeps the empty reviews section visible when forced', () => {
    render(
      <ClientLawyerReviews alwaysVisible reviews={[]} total={0} />,
    );

    expect(screen.getByText('Avaliações')).toBeTruthy();
    expect(screen.getByText('(0)')).toBeTruthy();
    expect(screen.getByText('Nenhuma avaliação ainda.')).toBeTruthy();
  });

  it('hides Ver mais when there is no further page', () => {
    render(
      <ClientLawyerReviews
        hasNextPage={false}
        reviews={[otherReview]}
        total={1}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Ver mais' })).toBeNull();
  });
});
