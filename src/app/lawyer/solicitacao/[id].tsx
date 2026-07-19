import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { Body1, Display, Link } from '@/atomic/typography';
import {
  LawyerClientContactsCard,
  LawyerClientProfileAccordion,
  LawyerSolicitationDataAccordion,
  LawyerSolicitationDescriptionAccordion,
  MOCK_LAWYER_SOLICITATION_DETAILS,
} from '@/components/lawyer-solicitation-details';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function LawyerSolicitationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const solicitationId = Array.isArray(id) ? id[0] : id;
  const solicitation = MOCK_LAWYER_SOLICITATION_DETAILS.find(
    (item) => item.id === solicitationId,
  );
  const [accepted, setAccepted] = useState(false);

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
            Visualizar solicitação
          </Body1>
          <View style={styles.headerSpacer} />
        </View>

        <LawyerClientProfileAccordion client={solicitation.client} />

        {accepted ? (
          <LawyerClientContactsCard client={solicitation.client} />
        ) : (
          <LawyerSolicitationDataAccordion solicitation={solicitation} />
        )}

        <LawyerSolicitationDescriptionAccordion
          description={solicitation.description}
        />

        {!accepted ? (
          <View style={styles.actions}>
            <Button
              accessibilityLabel="Aceitar solicitação"
              onPress={() => setAccepted(true)}
              variant="primary">
              Aceitar solicitação
            </Button>
            <Pressable
              accessibilityLabel="Recusar"
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.refuseButton,
                pressed && styles.pressed,
              ]}>
              <Link color={BrandColors.primary.light}>Recusar</Link>
            </Pressable>
          </View>
        ) : null}
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
  actions: {
    gap: Spacing.xs,
    marginTop: Spacing.xxs,
  },
  refuseButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
