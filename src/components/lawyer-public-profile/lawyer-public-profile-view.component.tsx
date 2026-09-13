import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { StarRating } from '@/assets/icon/star';
import { AvailabilityBadge } from '@/atomic/availability-badge';
import { Body1, Body2, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import {
  formatPublicLawyerEducation,
  formatPublicLawyerModalities,
  formatPublicLawyerOabLabel,
  formatPublicLawyerRegistration,
  type PublicLawyerProfile,
} from '@/data/lawyer';
import { useObjectReadUrl } from '@/domain/arquivo';

const NO_IMAGE_PLACEHOLDER = require('@/assets/images/no-image-placeholder.png');

type ProfileFieldProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
};

function ProfileField({ icon, label, children }: ProfileFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabel}>
        {icon}
        <Body1 color={BrandColors.neutral.white}>{label}</Body1>
      </View>
      {children}
    </View>
  );
}

function formatIdentitySubtitle(profile: PublicLawyerProfile): string {
  const modality = formatPublicLawyerModalities(profile);
  const registration = formatPublicLawyerRegistration(profile);
  return [modality, registration].filter(Boolean).join(' - ');
}

function formatSupplementalOabs(profile: PublicLawyerProfile): string {
  if (profile.supplementalOabs.length === 0) {
    return '—';
  }
  return profile.supplementalOabs
    .map((oab) => formatPublicLawyerOabLabel(oab))
    .filter(Boolean)
    .join(', ');
}

function LawyerProfilePhoto({ photoKey }: { photoKey: string | null }) {
  const { data: read, isLoading: isReadUrlLoading } = useObjectReadUrl(photoKey);
  const uri = read?.readUrl?.trim();
  const isLoadingPhoto = Boolean(photoKey) && isReadUrlLoading && !uri;

  return (
    <View style={styles.profileImageWrap}>
      <Image
        testID="lawyer-profile-image"
        source={uri ? { uri } : NO_IMAGE_PLACEHOLDER}
        contentFit="cover"
        style={StyleSheet.absoluteFill}
      />
      {isLoadingPhoto ? (
        <View style={styles.profileImageLoading}>
          <ActivityIndicator color={BrandColors.primary.light} size="small" />
        </View>
      ) : null}
    </View>
  );
}

export type LawyerPublicProfileViewProps = {
  profile: PublicLawyerProfile;
  /** Reviews block (comments, total, average). Rendered after the public fields. */
  reviews?: ReactNode;
  footer?: ReactNode;
};

function formatAverageRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

export function LawyerPublicProfileView({
  profile,
  reviews,
  footer,
}: LawyerPublicProfileViewProps) {
  const iconColor = BrandColors.neutral.white;
  const honorificSuffix = profile.honorific ? ` (${profile.honorific})` : '';
  const education = formatPublicLawyerEducation(profile) || '—';
  const specialties =
    profile.specialties.map((item) => item.name || item.code).filter(Boolean)
      .join(', ') || '—';
  const billingMethods =
    profile.billingMethods.map((item) => item.name || item.code).filter(Boolean)
      .join(', ') || '—';
  const subtitle = formatIdentitySubtitle(profile);
  const showRatingSummary =
    profile.totalReviews > 0 ||
    (profile.averageRating != null && profile.averageRating > 0);
  const averageRating = profile.averageRating ?? 0;
  const averageLabel = formatAverageRating(averageRating);

  return (
    <View style={styles.root}>
      <LawyerProfilePhoto photoKey={profile.photoKey} />

      <View style={styles.identity}>
        <AvailabilityBadge available={profile.isAvailable} />
        <Heading1 color={BrandColors.neutral.white}>
          {profile.name}
          {honorificSuffix}
        </Heading1>
        {subtitle ? (
          <Body2 color={BrandColors.neutral.white}>{subtitle}</Body2>
        ) : null}
        {showRatingSummary ? (
          <View style={styles.ratingSummary}>
            <StarRating
              accessibilityLabel={`${averageLabel} ${averageRating === 1 ? 'estrela' : 'estrelas'} (${profile.totalReviews})`}
              rating={averageRating}
              size={16}
            />
            <Body2 color={BrandColors.neutral.light}>
              {averageLabel}
              {profile.totalReviews > 0 ? ` (${profile.totalReviews})` : ''}
            </Body2>
          </View>
        ) : null}
      </View>

      {profile.biography ? (
        <ProfileField
          icon={
            <SymbolView
              name={{ ios: 'person.text.rectangle', android: 'badge', web: 'badge' }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Biografia">
          <Body2 color={BrandColors.neutral.white}>{profile.biography}</Body2>
        </ProfileField>
      ) : null}

      {profile.addressLabel ? (
        <ProfileField
          icon={
            <SymbolView
              name={{ ios: 'mappin.circle', android: 'location_on', web: 'location_on' }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Endereço">
          <Body2 color={BrandColors.primary.light}>{profile.addressLabel}</Body2>
        </ProfileField>
      ) : null}

      <ProfileField
        icon={
          <SymbolView
            name={{
              ios: 'doc.text',
              android: 'description',
              web: 'description',
            }}
            size={18}
            tintColor={iconColor}
          />
        }
        label="OAB Suplementar">
        <Body2 color={BrandColors.primary.light}>
          {formatSupplementalOabs(profile)}
        </Body2>
      </ProfileField>

      <ProfileField
        icon={
          <SymbolView
            name={{
              ios: 'graduationcap',
              android: 'school',
              web: 'school',
            }}
            size={18}
            tintColor={iconColor}
          />
        }
        label="Escolaridade">
        <Body2 color={BrandColors.primary.light}>{education}</Body2>
      </ProfileField>

      <ProfileField
        icon={
          <SymbolView
            name={{
              ios: 'calendar.badge.clock',
              android: 'calendar_month',
              web: 'calendar_month',
            }}
            size={18}
            tintColor={iconColor}
          />
        }
        label="Tempo de formado">
        <Body2 color={BrandColors.primary.light}>
          {profile.yearsOfExperience} anos
        </Body2>
      </ProfileField>

      <ProfileField
        icon={
          <SymbolView
            name={{
              ios: 'briefcase',
              android: 'business_center',
              web: 'business_center',
            }}
            size={18}
            tintColor={iconColor}
          />
        }
        label="Especialidade">
        <Body2 color={BrandColors.primary.light}>{specialties}</Body2>
      </ProfileField>

      {profile.subspecialties.length > 0 ? (
        <ProfileField
          icon={
            <SymbolView
              name={{
                ios: 'briefcase',
                android: 'business_center',
                web: 'business_center',
              }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Subespecialidades">
          <View style={styles.tags}>
            {profile.subspecialties.map((item) => (
              <View key={item.code || item.name} style={styles.tag}>
                <Body2 color={BrandColors.neutral.white}>
                  {item.name || item.code}
                </Body2>
              </View>
            ))}
          </View>
        </ProfileField>
      ) : null}

      <ProfileField
        icon={
          <SymbolView
            name={{
              ios: 'banknote',
              android: 'payments',
              web: 'payments',
            }}
            size={18}
            tintColor={iconColor}
          />
        }
        label="Métodos de cobrança">
        <Body2 color={BrandColors.primary.light}>{billingMethods}</Body2>
      </ProfileField>

      {footer}
      {reviews}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.sm,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
  },
  profileImageWrap: {
    width: '100%',
    aspectRatio: 1.03,
    borderRadius: Radius.medium,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.dark,
  },
  profileImageLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  identity: {
    gap: Spacing.xxxs,
  },
  field: {
    gap: Spacing.xxs,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
  },
  tag: {
    minHeight: 28,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxs,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.dark,
  },
});
