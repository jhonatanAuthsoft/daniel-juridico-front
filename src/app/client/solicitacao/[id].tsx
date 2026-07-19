import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body1, Display, Link } from '@/atomic/typography';
import {
  CancelClientSolicitationModal,
  ClientCompatibleLawyersList,
  ClientSolicitationDataAccordion,
  ClientSolicitationDescriptionAccordion,
  MOCK_CLIENT_SOLICITATION_DETAILS,
} from '@/components/client-solicitation-details';
import {
  BrandColors,
  MaxContentWidth,
  Spacing,
} from '@/constants/theme';

export default function ClientSolicitationDetailsScreen() {
  const router = useRouter();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const solicitationId = Array.isArray(id) ? id[0] : id;
  const solicitation = MOCK_CLIENT_SOLICITATION_DETAILS.find(
    (item) => item.id === solicitationId,
  );

  if (!solicitation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Display color={BrandColors.neutral.white}>
            Solicitação não encontrada
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
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
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={24}
              tintColor={BrandColors.neutral.white}
            />
          </Pressable>
          <Body1 color={BrandColors.neutral.white} style={styles.headerTitle}>
            Visualizar Solicitação
          </Body1>
          <View style={styles.headerSpacer} />
        </View>

        <ClientSolicitationDataAccordion solicitation={solicitation} />
        <ClientSolicitationDescriptionAccordion
          description={solicitation.description}
        />
        <ClientCompatibleLawyersList
          lawyers={solicitation.compatibleLawyers}
          onLawyerPress={(lawyerId) =>
            router.push(`/client/advogado/${lawyerId}`)
          }
        />

        <Pressable
          accessibilityLabel="Cancelar solicitação"
          accessibilityRole="button"
          onPress={() => setCancelModalVisible(true)}
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{ ios: 'trash', android: 'delete', web: 'delete' }}
            size={18}
            tintColor={BrandColors.feedback.error.medium}
          />
          <Link color={BrandColors.feedback.error.medium}>
            Cancelar solicitação
          </Link>
        </Pressable>
      </ScrollView>
      <CancelClientSolicitationModal
        onClose={() => setCancelModalVisible(false)}
        onConfirm={() => {
          setCancelModalVisible(false);
          router.back();
        }}
        visible={cancelModalVisible}
      />
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
    paddingTop: Spacing.sm,
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
  cancelButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
    marginTop: Spacing.sm,
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
