import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body1, Body2, Display, Heading1, Link } from '@/atomic/typography';
import { ClientConnectionStatus } from '@/components/client-connection-status';
import {
  ClientLawyerReviews,
  type ClientLawyerReview,
} from '@/components/client-lawyer-reviews';
import { MOCK_COMPATIBLE_LAWYERS } from '@/components/client-solicitation-details';
import {
  BrandColors,
  MaxContentWidth,
  Radius,
  Spacing,
} from '@/constants/theme';

const MOCK_LAWYER_REVIEWS: ClientLawyerReview[] = [
  {
    id: 'review-1',
    reviewerName: 'Joana Ribeiro',
    rating: 4,
    comment: 'Profissional excepcional, muito feliz em ser atendida por ela',
  },
  {
    id: 'review-2',
    reviewerName: 'Carla Andrade',
    rating: 5,
    comment: 'Atendimento claro, cuidadoso e muito profissional.',
  },
  {
    id: 'review-3',
    reviewerName: 'Fernanda Lima',
    rating: 4,
    comment: 'Recebi todo o suporte necessário durante o meu caso.',
  },
  {
    id: 'review-4',
    reviewerName: 'Ana Souza',
    rating: 5,
    comment: 'Excelente profissional, recomendo pela atenção e agilidade.',
  },
  {
    id: 'review-5',
    reviewerName: 'Beatriz Alves',
    rating: 5,
    comment: 'Explicou cada etapa com transparência e muita segurança.',
  },
];

const MOCK_OWN_LAWYER_REVIEW: ClientLawyerReview = {
  id: 'review-own',
  reviewerName: 'Você',
  rating: 4,
  comment:
    'Excelente atendimento. Recebi orientações claras e todo o suporte necessário durante a conexão.',
  isOwn: true,
};

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

export default function ClientLawyerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lawyerId = Array.isArray(id) ? id[0] : id;
  const lawyer = MOCK_COMPATIBLE_LAWYERS.find((item) => item.id === lawyerId);
  const [connectionStatus, setConnectionStatus] = useState(
    lawyer?.connectionStatus ?? 'idle',
  );

  if (!lawyer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Display color={BrandColors.neutral.white}>
            Profissional não encontrado
          </Display>
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Link color={BrandColors.primary.light}>Voltar</Link>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const iconColor = BrandColors.neutral.white;

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            hitSlop={Spacing.xxs}
            onPress={() => router.back()}
            style={({ pressed }) => pressed && styles.pressed}>
            <SymbolView
              name={{
                ios: 'chevron.left',
                android: 'chevron_left',
                web: 'chevron_left',
              }}
              size={24}
              tintColor={BrandColors.neutral.white}
            />
          </Pressable>
          <Body1 color={BrandColors.neutral.white} style={styles.headerTitle}>
            Visualizar perfil
          </Body1>
          <View style={styles.headerSpacer} />
        </View>

        <Image
          testID="lawyer-profile-image"
          source={require('@/assets/images/professional-image-placeholder.png')}
          contentFit="cover"
          style={styles.profileImage}
        />

        <View style={styles.identity}>
          <Heading1 color={BrandColors.neutral.white}>
            {lawyer.name} ({lawyer.honorific})
          </Heading1>
          <Body2 color={BrandColors.neutral.white}>
            {lawyer.role} - {lawyer.registration}
          </Body2>
        </View>

        <ProfileField
          icon={
            <SymbolView
              name={{ ios: 'person.text.rectangle', android: 'badge', web: 'badge' }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Biografia">
          <Body2 color={BrandColors.neutral.white}>{lawyer.biography}</Body2>
        </ProfileField>

        <ProfileField
          icon={
            <SymbolView
              name={{ ios: 'mappin.circle', android: 'location_on', web: 'location_on' }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Endereço">
          <Body2 color={BrandColors.primary.light}>{lawyer.address}</Body2>
        </ProfileField>

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
            {lawyer.supplementalRegistration}
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
          <Body2 color={BrandColors.primary.light}>{lawyer.education}</Body2>
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
            {lawyer.yearsOfExperience} anos
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
          <Body2 color={BrandColors.primary.light}>
            {lawyer.specialties.join(', ')}
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
          label="Subespecialidades">
          <View style={styles.tags}>
            {lawyer.subspecialties.map((subspecialty) => (
              <View key={subspecialty} style={styles.tag}>
                <Body2 color={BrandColors.neutral.white}>{subspecialty}</Body2>
              </View>
            ))}
          </View>
        </ProfileField>

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
          <Body2 color={BrandColors.primary.light}>
            {lawyer.billingMethods.join(', ')}
          </Body2>
        </ProfileField>

        <ClientConnectionStatus
          email={lawyer.email}
          onCancel={() => setConnectionStatus('idle')}
          onRequest={() => setConnectionStatus('pending')}
          phone={lawyer.phone}
          status={connectionStatus}
        />

        <ClientLawyerReviews
          canReview={connectionStatus === 'accepted'}
          reviews={
            connectionStatus === 'accepted'
              ? [MOCK_OWN_LAWYER_REVIEW, ...MOCK_LAWYER_REVIEWS]
              : MOCK_LAWYER_REVIEWS
          }
          total={150}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xxs,
    paddingBottom: Spacing.lg,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
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
    padding: Spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
});
