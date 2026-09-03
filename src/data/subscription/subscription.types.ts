export type SubscriptionStatus =
  | 'TRIAL'
  | 'ATIVA'
  | 'EM_ATRASO'
  | 'EXPIRADA'
  | 'CANCELADA';

export type SubscriptionPlatform = 'IOS' | 'ANDROID' | 'FAKE';

export type SubscriptionWire = {
  status: SubscriptionStatus;
  acessoLiberado: boolean;
  emTrial: boolean;
  trialFimEm?: string | null;
  diasRestantesTrial?: number | null;
  periodoFimEm?: string | null;
  plataforma?: SubscriptionPlatform | null;
  ambiente?: string | null;
  productId?: string | null;
  autoRenovacao: boolean;
};

export type SubscriptionResult = {
  status: SubscriptionStatus;
  accessGranted: boolean;
  inTrial: boolean;
  trialEndsAt: string | null;
  trialDaysRemaining: number | null;
  periodEndsAt: string | null;
  platform: SubscriptionPlatform | null;
  productId: string;
  autoRenewing: boolean;
};

export type ValidateSubscriptionParams = {
  platform: SubscriptionPlatform;
  productId: string;
  purchaseToken: string;
};

export type IapProduct = {
  productId: string;
  title: string;
  description: string;
  localizedPrice: string;
  currency: string;
};

export type IapPurchaseResult = {
  productId: string;
  purchaseToken: string;
  platform: SubscriptionPlatform;
};
