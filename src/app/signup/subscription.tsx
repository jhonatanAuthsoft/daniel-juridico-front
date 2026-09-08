import { useQueryClient } from '@tanstack/react-query';
import { Redirect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Linking, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Display, Heading1 } from '@/atomic/typography';
import {
  angleToPoints,
  BrandColors,
  BrandGradients,
  MaxContentWidth,
  Radius,
  Spacing,
  toGradientLocations,
} from '@/constants/theme';
import { authKeys, useAuth, useMe } from '@/domain/auth';
import {
  getIapProvider,
  purchaseSubscriptionUseCase,
  restoreSubscriptionUseCase,
  subscriptionKeys,
} from '@/domain/subscription';

const TERMS_URL = 'https://laweact.com/termos';
const PRIVACY_URL = 'https://laweact.com/privacidade';

const PLAN_CARD_GRADIENT = BrandGradients.gradient;
const PLAN_CARD_GRADIENT_POINTS = angleToPoints(PLAN_CARD_GRADIENT.angleDeg);
const PLAN_CARD_GRADIENT_LOCATIONS = toGradientLocations(
  PLAN_CARD_GRADIENT.locationsPercent,
);

export default function SignupSubscriptionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, signOut } = useAuth();
  const { data: me, isPending } = useMe();
  const subscription = me?.subscription;

  const productId = subscription?.productId ?? 'laweact_basic_mensal';
  const [localizedPrice, setLocalizedPrice] = useState('R$ 35,00');
  const [hasFreeTrial, setHasFreeTrial] = useState(true);
  const [offerToken, setOfferToken] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const provider = getIapProvider();
        const products = await provider.fetchProducts([productId]);
        if (!active) {
          return;
        }
        const product = products.find((item) => item.productId === productId) ?? products[0];
        if (product?.localizedPrice) {
          setLocalizedPrice(product.localizedPrice);
        }
        if (product) {
          setHasFreeTrial(product.hasFreeTrial);
          setOfferToken(product.offerToken);
        }
      } catch {
        // Keep fallback price when store is unavailable (e.g. fake provider in tests).
      } finally {
        if (active) {
          setIsLoadingProducts(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [productId]);

  const invalidateSubscription = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    await queryClient.invalidateQueries({ queryKey: subscriptionKeys.me() });
  }, [queryClient]);

  const handleSubscribe = async () => {
    setErrorMessage(null);
    setIsPurchasing(true);
    try {
      await purchaseSubscriptionUseCase({
        productId,
        accountId: user?.id,
        offerToken,
      });
      await invalidateSubscription();
      router.replace('/signup/subscription-confirmed');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível concluir a assinatura.';
      setErrorMessage(message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setErrorMessage(null);
    setIsRestoring(true);
    try {
      const restored = await restoreSubscriptionUseCase();
      if (!restored) {
        setErrorMessage('Nenhuma assinatura anterior foi encontrada.');
        return;
      }
      await invalidateSubscription();
      router.replace('/signup/subscription-confirmed');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível restaurar a assinatura.';
      setErrorMessage(message);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSignOut = () => {
    void signOut();
    router.replace('/login');
  };

  if (isPending) {
    return (
      <View style={styles.root}>
        <ActivityIndicator color={BrandColors.primary.light} style={styles.loading} />
      </View>
    );
  }

  if (subscription?.accessGranted) {
    return <Redirect href="/lawyer" />;
  }

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

            <View style={styles.planCardAccent}>
              <LinearGradient
                colors={[...PLAN_CARD_GRADIENT.colors]}
                end={PLAN_CARD_GRADIENT_POINTS.end}
                locations={PLAN_CARD_GRADIENT_LOCATIONS}
                start={PLAN_CARD_GRADIENT_POINTS.start}
                style={styles.planCardBorder}>
                <View style={styles.planCard}>
                  <GlassBackground blurPx={25} gradient={PLAN_CARD_GRADIENT} />
                  <View style={styles.planBody}>
                    <View style={styles.planHeader}>
                      <Heading1 color={BrandColors.primary.light}>Plano Basic</Heading1>
                      {isLoadingProducts ? (
                        <ActivityIndicator color={BrandColors.neutral.white} />
                      ) : (
                        <Body1 color={BrandColors.neutral.white}>{localizedPrice}</Body1>
                      )}
                    </View>
                    {hasFreeTrial ? (
                      <Body1 color={BrandColors.neutral.white}>1º mês gratuito</Body1>
                    ) : null}
                    <Body2 color={BrandColors.neutral.white}>Assinatura mensal automática</Body2>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {errorMessage ? (
              <>
                <Separator size="sm" />
                <Body2 color={BrandColors.primary.light} style={styles.centeredText}>
                  {errorMessage}
                </Body2>
              </>
            ) : null}
          </View>

          <View style={styles.footer}>
            <Button
              variant="cta"
              disabled={isPurchasing || isRestoring}
              onPress={() => void handleSubscribe()}>
              {isPurchasing ? 'Processando...' : 'Assinar'}
            </Button>

            <Separator size="xs" />

            <View style={styles.centeredAction}>
              <Button
                variant="link"
                disabled={isPurchasing || isRestoring}
                onPress={() => void handleRestore()}>
                {isRestoring ? 'Restaurando...' : 'Restaurar compras'}
              </Button>
            </View>

            <Separator size="xs" />

            <View style={styles.legalLinks}>
              <Button variant="link" onPress={() => void Linking.openURL(TERMS_URL)}>
                Termos de uso
              </Button>
              <Body2 color={BrandColors.neutral.light}>•</Body2>
              <Button variant="link" onPress={() => void Linking.openURL(PRIVACY_URL)}>
                Política de privacidade
              </Button>
            </View>

            <Separator size="sm" />

            <View style={styles.centeredAction}>
              <Button variant="link" onPress={handleSignOut}>
                Sair da conta
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const glassShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: {
    elevation: 0,
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

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
  planCardAccent: {
    borderRadius: Radius.large,
    backgroundColor: BrandColors.primary.light,
    paddingTop: Spacing.xxs,
    overflow: 'hidden',
  },
  planCardBorder: {
    borderRadius: Radius.large,
    padding: 1,
  },
  planCard: {
    borderRadius: Radius.large - 1,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  planBody: {
    zIndex: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.xxxs,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    width: '100%',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxxs,
  },
  centeredAction: {
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
