import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Body1, Body2, Display, Heading1, Link } from '@/atomic/typography';
import { useBanner } from '@/atomic/feedback-banner';
import { ClientConnectionStatus } from '@/components/client-connection-status';
import { ClientFlowScreen } from '@/components/client-flow-screen';
import { ClientLawyerReviews } from '@/components/client-lawyer-reviews';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import {
  formatPublicLawyerEducation,
  formatPublicLawyerModalities,
  formatPublicLawyerOabLabel,
  formatPublicLawyerRegistration,
  mapLawyerReviewsToClientReviews,
  type PublicLawyerProfile,
} from '@/data/lawyer';
import { useObjectReadUrl } from '@/domain/arquivo';
import {
  useCancelConnection,
  useCreateConnection,
  useLawyerConnectionStatus,
} from '@/domain/connection';
import {
  useCreateLawyerReview,
  useDeleteLawyerReview,
  useLawyerReviews,
  usePublicLawyerProfile,
} from '@/domain/lawyer';

const PLACEHOLDER_IMAGE = require('@/assets/images/professional-image-placeholder.png');

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
  const { data: read } = useObjectReadUrl(photoKey);
  const uri = read?.readUrl?.trim();

  return (
    <Image
      testID="lawyer-profile-image"
      source={uri ? { uri } : PLACEHOLDER_IMAGE}
      contentFit="cover"
      style={styles.profileImage}
    />
  );
}

export default function ClientLawyerProfileScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { id, solicitacaoId: solicitacaoIdParam } = useLocalSearchParams<{
    id: string;
    solicitacaoId?: string;
  }>();
  const lawyerId = Array.isArray(id) ? id[0] : id;
  const solicitacaoId = Array.isArray(solicitacaoIdParam)
    ? solicitacaoIdParam[0]
    : solicitacaoIdParam;

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = usePublicLawyerProfile(lawyerId);

  const { data: reviewsData } = useLawyerReviews(lawyerId);
  const deleteReview = useDeleteLawyerReview();
  const createReview = useCreateLawyerReview();

  const { data: connection } = useLawyerConnectionStatus(
    lawyerId,
    solicitacaoId,
  );
  const createConnection = useCreateConnection();
  const cancelConnection = useCancelConnection();

  if (isLoading) {
    return (
      <ClientFlowScreen title="Visualizar perfil" onBack={() => router.back()}>
        <View style={styles.notFound}>
          <ActivityIndicator color={BrandColors.primary.light} size="large" />
        </View>
      </ClientFlowScreen>
    );
  }

  if (isError || !profile) {
    return (
      <ClientFlowScreen title="Visualizar perfil" onBack={() => router.back()}>
        <View style={styles.notFound}>
          <Display color={BrandColors.neutral.white}>
            Profissional não encontrado
          </Display>
          {error ? (
            <Body2 color={BrandColors.neutral.light} style={styles.errorMessage}>
              {getErrorMessage(error, 'Não foi possível carregar o perfil.')}
            </Body2>
          ) : null}
          <Pressable
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
            onPress={() => {
              void refetch();
            }}>
            <Link color={BrandColors.primary.light}>Tentar novamente</Link>
          </Pressable>
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Link color={BrandColors.primary.light}>Voltar</Link>
          </Pressable>
        </View>
      </ClientFlowScreen>
    );
  }

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

  return (
    <ClientFlowScreen
      title="Visualizar perfil"
      onBack={() => router.back()}
      contentContainerStyle={styles.content}>
      <LawyerProfilePhoto photoKey={profile.photoKey} />

      <View style={styles.identity}>
        <Heading1 color={BrandColors.neutral.white}>
          {profile.name}
          {honorificSuffix}
        </Heading1>
        {subtitle ? (
          <Body2 color={BrandColors.neutral.white}>{subtitle}</Body2>
        ) : null}
        {profile.averageRating != null ? (
          <Body2 color={BrandColors.neutral.light}>
            ★ {profile.averageRating.toFixed(1).replace('.', ',')}
            {profile.totalReviews > 0 ? ` (${profile.totalReviews})` : ''}
          </Body2>
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

      {solicitacaoId ? (
        <ClientConnectionStatus
          email={connection?.email ?? ''}
          isCancelling={cancelConnection.isPending}
          isRequesting={createConnection.isPending}
          onCancel={() => {
            if (!connection?.id) {
              return;
            }
            void (async () => {
              try {
                await cancelConnection.mutateAsync(connection.id);
              } catch (cancelError) {
                banner(
                  getErrorMessage(
                    cancelError,
                    'Não foi possível cancelar a conexão.',
                  ),
                  'error',
                );
              }
            })();
          }}
          onRequest={() => {
            if (!lawyerId || !solicitacaoId) {
              return;
            }
            void (async () => {
              try {
                await createConnection.mutateAsync({
                  solicitacaoId,
                  advogadoId: lawyerId,
                });
              } catch (requestError) {
                banner(
                  getErrorMessage(
                    requestError,
                    'Não foi possível solicitar a conexão.',
                  ),
                  'error',
                );
              }
            })();
          }}
          phone={connection?.telefone ?? ''}
          status={connection?.uiStatus ?? 'idle'}
        />
      ) : null}

      <ClientLawyerReviews
        canReview={reviewsData?.canReview ?? false}
        isDeletingOwn={deleteReview.isPending}
        isSubmittingReview={createReview.isPending}
        onDeleteOwnReview={async (reviewId) => {
          try {
            await deleteReview.mutateAsync({
              lawyerUserId: profile.id,
              reviewId,
            });
          } catch (error) {
            banner(
              getErrorMessage(error, 'Não foi possível excluir a avaliação.'),
              'error',
            );
            throw error;
          }
        }}
        onSubmitReview={async ({ rating, comment }) => {
          try {
            await createReview.mutateAsync({
              lawyerUserId: profile.id,
              rating,
              comment,
            });
          } catch (error) {
            banner(
              getErrorMessage(error, 'Não foi possível enviar a avaliação.'),
              'error',
            );
          }
        }}
        reviews={
          reviewsData
            ? mapLawyerReviewsToClientReviews(reviewsData.items)
            : []
        }
        total={reviewsData?.total ?? profile.totalReviews}
      />
    </ClientFlowScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.lg,
  },
  profileImage: {
    width: '100%',
    aspectRatio: 1.03,
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.neutral.dark,
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  errorMessage: {
    textAlign: 'center',
  },
});
