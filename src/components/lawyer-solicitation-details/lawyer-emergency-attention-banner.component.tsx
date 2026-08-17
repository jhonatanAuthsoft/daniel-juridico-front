import {
  EmergencyAttentionBanner,
  LAWYER_EMERGENCY_ATTENTION_MESSAGE,
} from '@/components/emergency-attention-banner';

type LawyerEmergencyAttentionBannerProps = {
  visible: boolean;
};

/**
 * Shown when the linked solicitation urgency is emergency (`EMERGENCIA`).
 */
export function LawyerEmergencyAttentionBanner({
  visible,
}: LawyerEmergencyAttentionBannerProps) {
  return (
    <EmergencyAttentionBanner
      message={LAWYER_EMERGENCY_ATTENTION_MESSAGE}
      visible={visible}
    />
  );
}
