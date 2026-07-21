import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  PanResponder,
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
const STAR_VALUES = [1, 2, 3, 4, 5] as const;
const HALF_STAR_VALUES = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;
const STAR_SIZE = 44;
const STAR_COUNT = STAR_VALUES.length;

type StarFill = 'empty' | 'half' | 'full';

type ClientReviewFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
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

/** Maps X across a space-between star row, ignoring the gaps between icons. */
function ratingFromTrackX(x: number, trackWidth: number): number {
  if (trackWidth <= 0) {
    return 0.5;
  }

  const gapTotal = trackWidth - STAR_COUNT * STAR_SIZE;
  const gap = STAR_COUNT > 1 ? Math.max(0, gapTotal / (STAR_COUNT - 1)) : 0;
  const clampedX = Math.max(0, Math.min(trackWidth, x));

  for (let index = 0; index < STAR_COUNT; index += 1) {
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

function starOffset(index: number, trackWidth: number): number {
  const gapTotal = trackWidth - STAR_COUNT * STAR_SIZE;
  const gap = STAR_COUNT > 1 ? Math.max(0, gapTotal / (STAR_COUNT - 1)) : 0;
  return index * (STAR_SIZE + gap);
}

function RatingStar({ fill }: { fill: StarFill }) {
  return (
    <View pointerEvents="none" style={styles.starSlot}>
      <SymbolView
        name={{
          ios: 'star',
          android: 'star_border',
          web: 'star_border',
        }}
        size={STAR_SIZE}
        tintColor={BrandColors.neutral.white}
      />
      {fill !== 'empty' ? (
        <View
          style={[
            styles.starFillMask,
            fill === 'half' ? styles.starFillHalf : styles.starFillFull,
          ]}>
          <SymbolView
            name={{
              ios: 'star.fill',
              android: 'star',
              web: 'star',
            }}
            size={STAR_SIZE}
            tintColor={BrandColors.neutral.white}
          />
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
  const trackWidthRef = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const onChangeRef = useRef(onChangeRating);
  onChangeRef.current = onChangeRating;

  const updateFromX = (x: number) => {
    onChangeRef.current(ratingFromTrackX(x, trackWidthRef.current));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        updateFromX(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => {
        updateFromX(event.nativeEvent.locationX);
      },
    }),
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      accessibilityLabel="Nota da conexão"
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        trackWidthRef.current = width;
        setTrackWidth(width);
      }}
      style={styles.stars}>
      {STAR_VALUES.map((star) => (
        <RatingStar key={star} fill={resolveStarFill(star, rating)} />
      ))}

      {/* Labels for a11y/tests; real touches are handled by PanResponder (click + drag). */}
      <View pointerEvents="box-none" style={styles.a11yLayer}>
        {HALF_STAR_VALUES.map((value) => {
          const starIndex = Math.ceil(value) - 1;
          const isHalf = !Number.isInteger(value);
          const left =
            starOffset(starIndex, trackWidth) + (isHalf ? 0 : STAR_SIZE / 2);

          return (
            <Pressable
              key={value}
              accessibilityLabel={formatRatingLabel(value)}
              accessibilityRole="button"
              accessibilityState={{ selected: rating === value }}
              onPress={() => onChangeRating(value)}
              style={[
                styles.a11ySegment,
                {
                  left,
                  width: STAR_SIZE / 2,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

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
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: STAR_SIZE,
  },
  a11yLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  a11ySegment: {
    position: 'absolute',
    top: 0,
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
  },
  inputError: {
    borderColor: BrandColors.feedback.error.medium,
  },
});
