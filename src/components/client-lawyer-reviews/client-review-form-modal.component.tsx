import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { StarIcon } from '@/assets/icon/star';
import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { ModalScrim } from '@/atomic/modal';
import { Body1, Body2, Heading1 } from '@/atomic/typography';
import {
  BrandColors,
  InterFontFamily,
  Radius,
  Spacing,
} from '@/constants/theme';

const MAX_COMMENT_LENGTH = 800;
const STAR_VALUES = [1, 2, 3, 4, 5] as const;
const STAR_SIZE = 44;

type StarFill = 'empty' | 'half' | 'full';

type ClientReviewFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: { rating: number; comment: string }) => void;
  isSubmitting?: boolean;
};

function formatRatingLabel(value: number): string {
  const formatted = Number.isInteger(value)
    ? String(value)
    : value.toFixed(1).replace('.', ',');
  const unit = value === 1 ? 'estrela' : 'estrelas';
  return `Dar ${formatted} ${unit}`;
}

function resolveStarFill(star: number, rating: number): StarFill {
  if (rating >= star) {
    return 'full';
  }
  if (rating >= star - 0.5) {
    return 'half';
  }
  return 'empty';
}

/** Maps page-relative X across a space-between star row. */
function ratingFromTrackX(x: number, trackWidth: number): number {
  if (trackWidth <= 0) {
    return 0.5;
  }

  const gapTotal = trackWidth - STAR_VALUES.length * STAR_SIZE;
  const gap =
    STAR_VALUES.length > 1 ? Math.max(0, gapTotal / (STAR_VALUES.length - 1)) : 0;
  const clampedX = Math.max(0, Math.min(trackWidth, x));

  for (let index = 0; index < STAR_VALUES.length; index += 1) {
    const left = index * (STAR_SIZE + gap);
    const right = left + STAR_SIZE;
    const middle = left + STAR_SIZE / 2;

    if (clampedX < left) {
      return index === 0 ? 0.5 : index;
    }

    if (clampedX <= right) {
      return clampedX < middle ? index + 0.5 : index + 1;
    }
  }

  return 5;
}

function RatingStar({ fill }: { fill: StarFill }) {
  const emptyColor = BrandColors.neutral.white;
  const filledColor = BrandColors.feedback.warning.medium;

  return (
    <View pointerEvents="none" style={styles.starSlot}>
      <StarIcon color={emptyColor} filled={false} size={STAR_SIZE} />
      {fill !== 'empty' ? (
        <View
          style={[
            styles.starFillMask,
            fill === 'half' ? styles.starFillHalf : styles.starFillFull,
          ]}>
          <StarIcon color={filledColor} filled size={STAR_SIZE} />
        </View>
      ) : null}
    </View>
  );
}

type StarRatingInputProps = {
  rating: number;
  onChangeRating: (value: number) => void;
};

function StarRatingInput({ rating, onChangeRating }: StarRatingInputProps) {
  const trackRef = useRef<View>(null);
  const originXRef = useRef(0);
  const widthRef = useRef(0);
  const onChangeRef = useRef(onChangeRating);
  onChangeRef.current = onChangeRating;

  const measureTrack = () => {
    trackRef.current?.measureInWindow((x, _y, width) => {
      originXRef.current = x;
      widthRef.current = width;
    });
  };

  const applyPageX = (pageX: number) => {
    onChangeRef.current(ratingFromTrackX(pageX - originXRef.current, widthRef.current));
  };

  const snapBy = (delta: number) => {
    const current = rating > 0 ? rating : 0.5;
    const next = Math.min(5, Math.max(0.5, current + delta));
    onChangeRating(next);
  };

  return (
    <View
      ref={trackRef}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      accessibilityLabel="Nota da conexão"
      accessibilityRole="adjustable"
      accessibilityValue={{
        min: 0.5,
        max: 5,
        now: rating || 0,
        text: rating > 0 ? formatRatingLabel(rating) : 'Nenhuma nota',
      }}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') {
          snapBy(0.5);
        } else if (event.nativeEvent.actionName === 'decrement') {
          snapBy(-0.5);
        }
      }}
      onLayout={measureTrack}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(event) => {
        measureTrack();
        applyPageX(event.nativeEvent.pageX);
      }}
      onResponderMove={(event) => {
        applyPageX(event.nativeEvent.pageX);
      }}
      onStartShouldSetResponder={() => true}
      style={styles.stars}>
      {STAR_VALUES.map((star) => (
        <RatingStar key={star} fill={resolveStarFill(star, rating)} />
      ))}
    </View>
  );
}

export function ClientReviewFormModal({
  visible,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ClientReviewFormModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState(false);
  const [commentError, setCommentError] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setRating(5);
    setComment('');
    setRatingError(false);
    setCommentError(false);
  }, [visible]);

  const selectRating = (value: number) => {
    setRating(value);
    setRatingError(false);
  };

  const updateComment = (value: string) => {
    setComment(value);
    setCommentError(false);
  };

  const submitReview = () => {
    if (isSubmitting) {
      return;
    }

    const hasRatingError = rating === 0;
    const hasCommentError = comment.trim().length === 0;

    setRatingError(hasRatingError);
    setCommentError(hasCommentError);

    if (hasRatingError || hasCommentError) {
      return;
    }

    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <Modal
      animationType="fade"
      navigationBarTranslucent
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}>
      <ModalScrim
        accessibilityLabel="Fechar avaliação"
        align="bottom"
        keyboardBehavior="lift"
        onDismiss={onClose}>
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />

          <Pressable
            accessibilityLabel="Fechar avaliação"
            accessibilityRole="button"
            hitSlop={Spacing.xxs}
            onPress={onClose}
            style={styles.closeButton}>
            <XIcon color={BrandColors.neutral.white} height={18} width={18} />
          </Pressable>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}>
            <View style={styles.intro}>
              <Heading1 color={BrandColors.neutral.white}>
                Qual nota você daria para essa conexão?
              </Heading1>
              <Body1 color={BrandColors.neutral.white}>
                Conte-nos sobre a sua experiência com essa conexão
              </Body1>
            </View>

            <View style={styles.ratingField}>
              <StarRatingInput onChangeRating={selectRating} rating={rating} />
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
                style={[styles.input, commentError && styles.inputError]}
                textAlignVertical="top"
                underlineColorAndroid="transparent"
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
              disabled={isSubmitting}
              isLoading={isSubmitting}
              onPress={submitReview}
              variant="primary">
              Avaliar
            </Button>
          </ScrollView>
        </View>
      </ModalScrim>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.medium,
    backgroundColor: BrandColors.neutral.xdark,
  },
  scrollContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
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
    height: STAR_SIZE,
  },
  starSlot: {
    width: STAR_SIZE,
    height: STAR_SIZE,
  },
  starFillMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: STAR_SIZE,
    overflow: 'hidden',
  },
  starFillHalf: {
    width: STAR_SIZE / 2,
  },
  starFillFull: {
    width: STAR_SIZE,
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
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0)' : 'transparent',
  },
  inputError: {
    borderColor: BrandColors.feedback.error.medium,
  },
});
