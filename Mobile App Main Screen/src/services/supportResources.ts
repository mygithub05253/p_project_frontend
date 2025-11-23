// Support resources data for mental health support

export interface SupportResource {
  id: string;
  name: string;
  description: string;
  phone?: string;
  website?: string;
  hours?: string;
  category: 'emergency' | 'counseling' | 'hotline' | 'community';
}

export const supportResources: SupportResource[] = [
  {
    id: '1',
    name: '자살예방 상담전화',
    description: '24시간 위기상담 및 자살예방 전문 상담',
    phone: '1393',
    website: 'https://www.kfsp.or.kr',
    hours: '24시간',
    category: 'emergency',
  },
  {
    id: '2',
    name: '정신건강 위기상담 전화',
    description: '정신건강 위기 상황에 대한 전문 상담',
    phone: '1577-0199',
    website: 'https://www.mentalhealth.go.kr',
    hours: '24시간',
    category: 'emergency',
  },
  {
    id: '3',
    name: '청소년 상담전화',
    description: '청소년의 고민과 위기 상황 상담',
    phone: '1388',
    website: 'https://www.cyber1388.kr',
    hours: '24시간',
    category: 'hotline',
  },
  {
    id: '4',
    name: '한국생명의전화',
    description: '자살예방 및 정서적 지원 상담',
    phone: '1588-9191',
    website: 'https://www.lifeline.or.kr',
    hours: '24시간',
    category: 'hotline',
  },
  {
    id: '5',
    name: '마음이음',
    description: '정신건강 관련 정보 제공 및 전문기관 연계',
    phone: '1577-0199',
    website: 'https://www.mentalhealth.go.kr',
    hours: '평일 9시~18시',
    category: 'counseling',
  },
  {
    id: '6',
    name: '한국심리상담센터',
    description: '전문 심리상담사와의 1:1 상담',
    phone: '1899-1231',
    website: 'https://www.kpcc.or.kr',
    hours: '평일 10시~19시',
    category: 'counseling',
  },
  {
    id: '7',
    name: '대한신경정신의학회',
    description: '정신과 전문의 찾기 및 정신건강 정보',
    website: 'https://www.knpa.or.kr',
    hours: '평일 9시~18시',
    category: 'community',
  },
  {
    id: '8',
    name: '국립정신건강센터',
    description: '정신건강 전문 진료 및 치료 서비스',
    phone: '02-2204-0001',
    website: 'https://www.ncmh.go.kr',
    hours: '평일 9시~18시',
    category: 'community',
  },
];

export const categoryLabels = {
  emergency: '긴급 상담',
  counseling: '전문 상담',
  hotline: '상담 전화',
  community: '의료 기관',
};

export const categoryColors = {
  emergency: 'bg-rose-100 text-rose-700 border-rose-300',
  counseling: 'bg-blue-100 text-blue-700 border-blue-300',
  hotline: 'bg-purple-100 text-purple-700 border-purple-300',
  community: 'bg-green-100 text-green-700 border-green-300',
};
