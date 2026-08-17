import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Body1, Body2, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { useObjectReadUrl } from '@/domain/arquivo';

import { LawyerDetailAccordionShell } from './lawyer-detail-accordion-shell.component';
import type { LawyerClientProfile } from './mock-lawyer-solicitation-details';

const NO_IMAGE_PLACEHOLDER = require('@/assets/images/no-image-placeholder.png');

type ProfileFieldProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function ProfileField({ icon, label, value }: ProfileFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabel}>
        {icon}
        <Body1 color={BrandColors.neutral.white}>{label}</Body1>
      </View>
      <Body2 color={BrandColors.primary.light}>{value}</Body2>
    </View>
  );
}

type LawyerClientProfileAccordionProps = {
  client: LawyerClientProfile;
};

export function LawyerClientProfileAccordion({
  client,
}: LawyerClientProfileAccordionProps) {
  const iconColor = BrandColors.neutral.white;
  const photoKey = client.photoKey?.trim() || null;
  const { data: read } = useObjectReadUrl(photoKey);
  const readUrl = read?.readUrl?.trim();
  const imageSource = readUrl ? { uri: readUrl } : NO_IMAGE_PLACEHOLDER;

  return (
    <LawyerDetailAccordionShell title="Perfil do cliente">
      <View style={styles.content}>
        <Image
          testID="client-profile-image"
          source={imageSource}
          contentFit="cover"
          style={styles.image}
        />
        <Heading1 color={BrandColors.neutral.white}>{client.name}</Heading1>
        <View style={styles.location}>
          <SymbolView
            name={{ ios: 'mappin.circle', android: 'location_on', web: 'location_on' }}
            size={19}
            tintColor={iconColor}
          />
          <Body1 color={BrandColors.neutral.white}>{client.location}</Body1>
        </View>
        <View style={styles.divider} />
        <ProfileField
          icon={
            <SymbolView
              name={{
                ios: 'bubble.left',
                android: 'chat_bubble_outline',
                web: 'chat_bubble_outline',
              }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Pronomes de tratamento"
          value={client.pronouns}
        />
        <ProfileField
          icon={
            <SymbolView
              name={{ ios: 'person.crop.circle', android: 'person', web: 'person' }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Estado civil"
          value={client.maritalStatus}
        />
        <ProfileField
          icon={
            <SymbolView
              name={{ ios: 'bag', android: 'work_outline', web: 'work_outline' }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Profissão"
          value={client.profession}
        />
        <ProfileField
          icon={
            <SymbolView
              name={{ ios: 'dollarsign', android: 'attach_money', web: 'attach_money' }}
              size={18}
              tintColor={iconColor}
            />
          }
          label="Renda mensal"
          value={client.monthlyIncome}
        />
      </View>
    </LawyerDetailAccordionShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.xs,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.neutral.dark,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  divider: {
    height: 1,
    backgroundColor: BrandColors.neutral.medium,
  },
  field: {
    gap: Spacing.xxxs,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
});
