import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';

/**
 * Android + Fabric: native screen containers race addViewAt on login
 * navigation ("child already has a parent"). Disable native screens there
 * and fall back to plain RN views until the RN/screens bug is fixed.
 */
if (Platform.OS === 'android') {
  enableScreens(false);
}

import 'expo-router/entry';
