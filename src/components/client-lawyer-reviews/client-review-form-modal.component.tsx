import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/atomic/button';
import { Body1, Body2, Heading1 } from '@/atomic/typography';
import {
  BrandColors,
  InterFontFamily,
  Radius,
  Spacing,
} from '@/constants/theme';

const MAX_COMMENT_LENGTH = 800;
const RATINGS = [1, 2, 3, 4, 5] as const;

type ClientReviewFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function ClientReviewFormModal({
  visible,
  onClose,
  onSubmit,
}: ClientReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState(false);
  const [commentError, setCommentError] = useState(false);

  const selectRating = (value: number) => {
    setRating(value);
    setRatingError(false);
  };

  const updateComment = (value: string) => {
    setComment(value);
    setCommentError(false);
  };

  const submitReview = () => {
    const hasRatingError = rating === 0;
    const hasCommentError = comment.trim().length === 0;

    setRatingError(hasRatingError);
    setCommentError(hasCommentError);

    if (hasRatingError || hasCommentError) {
      return;
    }

    onSubmit();
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View
          accessibilityRole="dialog"
          accessibilityViewIsModal
          style={styles.sheet}>
          <View style={styles.handle} />

          <Pressable
            accessibilityLabel="Fechar avaliação"
            accessibilityRole="button"
            hitSlop={Spacing.xxs}
            onPress={onClose}
            style={styles.closeButton}>
            <SymbolView
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              size={22}
              tintColor={BrandColors.neutral.white}
            />
          </Pressable>

          <View style={styles.intro}>
            <Heading1 color={BrandColors.neutral.white}>
              Qual nota você daria para essa conexão?
            </Heading1>
            <Body1 color={BrandColors.neutral.white}>
              Conte-nos sobre a sua experiência com essa conexão
            </Body1>
          </View>

          <View style={styles.ratingField}>
            <View style={styles.stars}>
              {RATINGS.map((value) => {
                const selected = value <= rating;

                return (
                  <Pressable
                    key={value}
                    accessibilityLabel={`Dar ${value} estrelas`}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectRating(value)}
                    style={({ pressed }) => pressed && styles.pressed}>
                    <SymbolView
                      name={{
                        ios: selected ? 'star.fill' : 'star',
                        android: selected ? 'star' : 'star_border',
                        web: selected ? 'star' : 'star_border',
                      }}
                      size={44}
                      tintColor={BrandColors.neutral.white}
                    />
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.ratingLabels}>
              <Body1 color={BrandColors.neutral.white}>Péssima</Body1>
              <Body1 color={BrandColors.neutral.white}>Ótimo</Body1>
            </View>
            {ratingError ? (
              <Body2 color={BrandColors.feedback.error.medium}>
                Selecione uma nota.
              </Body2>
            ) : null}
          </View>

          <View style={styles.commentField}>
            <Body1 color={BrandColors.neutral.white}>
              Escreva sua avaliação
            </Body1>
            <TextInput
              accessibilityLabel="Escreva sua avaliação"
              maxLength={MAX_COMMENT_LENGTH}
              multiline
              onChangeText={updateComment}
              placeholder="Descreva sua experiência..."
              placeholderTextColor={BrandColors.neutral.light}
              style={[
                styles.input,
                commentError && styles.inputError,
              ]}
              textAlignVertical="top"
              value={comment}
            />
            <Body2 color={BrandColors.neutral.white}>
              {MAX_COMMENT_LENGTH - comment.length} caracteres
            </Body2>
            {commentError ? (
              <Body2 color={BrandColors.feedback.error.medium}>
                Escreva sua avaliação.
              </Body2>
            ) : null}
          </View>

          <Button
            accessibilityLabel="Avaliar"
            onPress={submitReview}
            variant="primary">
            Avaliar
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(18, 20, 24, 0.72)',
  },
  sheet: {
    maxHeight: '94%',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderTopLeftRadius: Radius.large,
    borderTopRightRadius: Radius.large,
    backgroundColor: BrandColors.neutral.xdark,
  },
  handle: {
    width: 60,
    height: 5,
    alignSelf: 'center',
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.medium,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    zIndex: 1,
  },
  intro: {
    gap: Spacing.xxs,
    paddingRight: Spacing.lg,
  },
  ratingField: {
    gap: Spacing.xxs,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentField: {
    gap: Spacing.xxs,
  },
  input: {
    minHeight: 150,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: BrandColors.neutral.medium,
    borderRadius: Radius.large,
    color: BrandColors.neutral.white,
    fontFamily: InterFontFamily[400],
    fontSize: 16,
  },
  inputError: {
    borderColor: BrandColors.feedback.error.medium,
  },
  pressed: {
    opacity: 0.7,
  },
});
