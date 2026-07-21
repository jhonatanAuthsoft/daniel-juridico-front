import {
  LawyerHistoryScreen,
  type LawyerHistoryItem,
} from '@/components/lawyer-history';

type LawyerHistoricoScreenProps = {
  items?: LawyerHistoryItem[];
};

export default function LawyerHistoricoScreen({
  items,
}: LawyerHistoricoScreenProps) {
  return <LawyerHistoryScreen items={items} />;
}
