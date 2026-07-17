import AppTabs from '@/components/app-tabs';
import { CLIENT_TAB_VISUALS } from '@/components/app-tab-bar';

export default function ClientTabsLayout() {
  return <AppTabs visuals={CLIENT_TAB_VISUALS} showHistorico={false} />;
}
