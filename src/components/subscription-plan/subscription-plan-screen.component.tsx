import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { GlassBackground } from '@/atomic/glass';
import { Body1, Body2, Link } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { useMe } from '@/domain/auth';
import { getIapProvider } from '@/domain/subscription';
import { openSubscriptionManagement } from '@/utils/open-subscription-management';

import {
  DEFAULT_SUBSCRIPTION_PRODUCT_ID,
  FALLBACK_LOCALIZED_PRICE,
  formatPlanMonthlyPrice,
  planDisplayName,
  subscriptionRenewalValue,
  subscriptionStoreActionLabel,
  subscriptionValidityValue,
} from './subscription-plan.mapper';

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

export function SubscriptionPlanScreen() {
  const { data: me, isPending } = useMe();
  const subscription = me?.subscription ?? null;
  const productId = subscription?.productId ?? DEFAULT_SUBSCRIPTION_PRODUCT_ID;
  const [planName, setPlanName] = useState(planDisplayName(productId));
  const [monthlyPrice, setMonthlyPrice] = useState(
    formatPlanMonthlyPrice(FALLBACK_LOCALIZED_PRICE),
  );
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);

  useEffect(() => {
    let active = true;
    setPlanName(planDisplayName(productId));
    void (async () => {
      try {
        const products = await getIapProvider().fetchProducts([productId]);
        if (!active) {
          return;
        }
        const product = products.find((item) => item.productId === productId) ?? products[0];
        setPlanName(planDisplayName(productId, product?.title));
        if (product?.localizedPrice) {
          setMonthlyPrice(formatPlanMonthlyPrice(product.localizedPrice));
        }
      } catch {
        // Keep fallback name and price when the store is unavailable.
      } finally {
        if (active) {
          setIsLoadingPrice(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [productId]);

  const storeActionLabel = subscriptionStoreActionLabel(subscription?.autoRenewing ?? false);

  return (
    <AccountStackScreen
      title="Assinatura"
      footer={
        <Pressable
          accessibilityLabel={storeActionLabel}
          accessibilityRole="link"
          onPress={() => {
            void openSubscriptionManagement();
          }}
          style={({ pressed }) => [styles.storeLink, pressed && styles.pressed]}>
          <Link color={BrandColors.primary.light}>{storeActionLabel}</Link>
          <SymbolView
            name={{
              ios: 'arrow.up.right',
              android: 'open_in_new',
              web: 'open_in_new',
            }}
            size={16}
            tintColor={BrandColors.primary.light}
          />
        </Pressable>
      }>
      {isPending && !subscription ? (
        <ActivityIndicator color={BrandColors.primary.light} style={styles.loading} />
      ) : (
        <>
          <View style={styles.planCard}>
            <GlassBackground blurPx={25} />
            <View style={styles.planCardContent}>
              <Body1 color={BrandColors.neutral.white} numberOfLines={1} style={styles.planName}>
                {planName}
              </Body1>
              {isLoadingPrice ? (
                <ActivityIndicator color={BrandColors.neutral.white} />
              ) : (
                <Body1 color={BrandColors.neutral.white}>{monthlyPrice}</Body1>
              )}
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Body2 color={BrandColors.neutral.light}>Data de validade</Body2>
              <Body1 color={BrandColors.neutral.white}>
                {subscriptionValidityValue(subscription?.periodEndsAt)}
              </Body1>
            </View>
            <View style={styles.detailRow}>
              <Body2 color={BrandColors.neutral.light}>Próxima renovação</Body2>
              <Body1 color={BrandColors.neutral.white}>
                {subscriptionRenewalValue({
                  periodEndsAt: subscription?.periodEndsAt,
                  autoRenewing: subscription?.autoRenewing ?? false,
                })}
              </Body1>
            </View>
          </View>
        </>
      )}
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: Spacing.lg,
  },
  planCard: {
    alignSelf: 'stretch',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  planCardContent: {
    zIndex: 1,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  planName: {
    flex: 1,
  },
  details: {
    gap: Spacing.sm,
  },
  detailRow: {
    gap: Spacing.xxxs,
  },
  storeLink: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxxs,
  },
  pressed: {
    opacity: 0.75,
  },
});
