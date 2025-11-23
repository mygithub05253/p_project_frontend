// Support Resources Service - Mock 데이터 직접 사용

export interface SupportResource {
  id: string;
  name: string;
  phone?: string;
  website?: string;
  category: 'emergency' | 'counseling' | 'hotline' | 'community';
}

export const supportResources: SupportResource[] = [
  {
    id: '1',
    name: '자살예방 상담전화',
    phone: '1393',
    website: 'https://www.kfsp.or.kr',
    category: 'emergency',
  },
  {
    id: '2',
    name: '정신건강 위기상담 전화',
    phone: '1577-0199',
    website: 'https://www.mentalhealth.go.kr',
    category: 'emergency',
  },
  {
    id: '3',
    name: '청소년 상담전화',
    phone: '1388',
    website: 'https://www.cyber1388.kr',
    category: 'hotline',
  },
  {
    id: '4',
    name: '한국생명의전화',
    phone: '1588-9191',
    website: 'https://www.lifeline.or.kr',
    category: 'hotline',
  },
  {
    id: '5',
    name: '마음이음',
    phone: '1577-0199',
    website: 'https://www.mentalhealth.go.kr',
    category: 'counseling',
  },
  {
    id: '6',
    name: '한국심리상담센터',
    phone: '1899-1231',
    website: 'https://www.kpcc.or.kr',
    category: 'counseling',
  },
  {
    id: '7',
    name: '대한신경정신의학회',
    website: 'https://www.knpa.or.kr',
    category: 'community',
  },
  {
    id: '8',
    name: '국립정신건강센터',
    phone: '02-2204-0001',
    website: 'https://www.ncmh.go.kr',
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

/**
 * 지원 리소스 목록 조회
 */
export async function fetchSupportResources(): Promise<SupportResource[]> {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await delay(200);
  return supportResources;
}
