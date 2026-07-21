export type LawyerNotification = {
  id: string;
  date: string;
  title: string;
  body: string;
};

export const MOCK_LAWYER_NOTIFICATIONS: LawyerNotification[] = [
  {
    id: 'notif-1',
    date: '26/08/2026',
    title: 'Demanda urgente',
    body: 'Maria precisa falar com um advogado com URGÊNCIA. Entre agora e aceite a solicitação de conexão para atender.',
  },
  {
    id: 'notif-2',
    date: '28/08/2026',
    title: 'Nova solicitação de conexão',
    body: 'Joana solicita uma consulta jurídica com prioridade BAIXA. Aceite a conexão.',
  },
  {
    id: 'notif-3',
    date: '28/08/2026',
    title: 'Demanda urgente',
    body: 'Pedro precisa de orientação legal URGENTE. Conecte-se imediatamente para ajudar.',
  },
];
