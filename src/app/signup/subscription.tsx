import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Display, Heading1 } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

export default function SignupSubscriptionScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.content}>
          <View style={styles.main}>
            <Display color={BrandColors.neutral.white} style={styles.centeredText}>
              Um plano completo para atender suas necessidades
            </Display>

            <Separator size="sm" />

            <Body1 color={BrandColors.neutral.white} style={styles.centeredText}>
              Assine o Plano Basic do nosso app de conexão entre advogados e clientes e amplie
              suas oportunidades de atuação de forma prática e organizada.
            </Body1>

            <Separator size="lg" />

            <View style={styles.planCard}>
              <View style={styles.planAccent} />
              <View style={styles.planBody}>
                <View style={styles.planHeader}>
                  <Heading1 color={BrandColors.primary.light}>Plano Basic</Heading1>
                  <Body1 color={BrandColors.neutral.white}>R$ 35,00</Body1>
                </View>
                <Body1 color={BrandColors.neutral.white}>1º mês gratuito</Body1>
                <Separator size="sm" />
                <Body2 color={BrandColors.neutral.white}>Assinatura mensal automática</Body2>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              variant="cta"
              onPress={() => router.push('/signup/subscription-confirmed')}>
              Continuar
            </Button>

            <Separator size="sm" />

            <View style={styles.logoutWrap}>
              <Button variant="link" onPress={() => router.replace('/login')}>
                Sair da conta
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  main: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
  planCard: {
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.dark,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  planAccent: {
    height: 3,
    backgroundColor: BrandColors.primary.light,
  },
  planBody: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxxs,
  },
  footer: {
    width: '100%',
  },
  logoutWrap: {
    alignItems: 'center',
  },
});
