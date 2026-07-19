import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Body1, Body2, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { LawyerDetailAccordionShell } from './lawyer-detail-accordion-shell.component';
import type { LawyerClientProfile } from './mock-lawyer-solicitation-details';

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

  return (
    <LawyerDetailAccordionShell title="Perfil do cliente">
      <View style={styles.content}>
        <Image
          testID="client-profile-image"
          source={require('@/assets/images/professional-image-placeholder.png')}
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
              name={{ ios: 'person.2', android: 'people', web: 'people' }}
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
              name={{ ios: 'briefcase', android: 'business_center', web: 'business_center' }}
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
