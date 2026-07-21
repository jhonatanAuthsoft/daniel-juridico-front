export type ClientNotification = {
  id: string;
  date: string;
  title: string;
  body: string;
};

export const MOCK_CLIENT_NOTIFICATIONS: ClientNotification[] = [
  {
    id: 'notif-1',
    date: '26/08/2026',
    title: 'Dra. Mariana está disponível',
    body: 'Seu pedido foi aceito. Você já pode entrar em contato.',
  },
  {
    id: 'notif-2',
    date: '28/08/2026',
    title: 'Dra. Mariana recusou seu pedido',
    body: 'Seu pedido foi recusado. Entre em contato com outros advogados compatíveis',
  },
  {
    id: 'notif-3',
    date: '28/08/2026',
    title: 'Advogados compatíveis',
    body: 'Encontramos 2 advogados compatíveis com sua solicitação.',
  },
];
