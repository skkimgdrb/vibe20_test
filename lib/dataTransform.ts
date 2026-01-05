/**
 * 만족도 텍스트를 숫자로 변환
 */
export function satisfactionToNumber(satisfaction: string): number {
  const mapping: Record<string, number> = {
    '매우 만족': 4,
    '만족': 3,
    '보통': 2,
    '불만족': 1,
  };
  return mapping[satisfaction] || 0;
}

/**
 * 방문 목적 문자열을 배열로 파싱
 */
export function parseVisitPurposes(purposes: string): string[] {
  if (!purposes || purposes.trim() === '') return [];
  return purposes.split(',').map(p => p.trim()).filter(p => p.length > 0);
}

/**
 * 설문조사 데이터 행을 파싱하여 구조화된 객체로 변환
 */
export interface SurveyRow {
  timestamp: string;
  gender: string;
  age: string;
  visitFrequency: string;
  visitPurposes: string[];
  satisfaction: {
    staffFriendliness: number;
    productVariety: number;
    cleanliness: number;
    facilities: number;
    parking: number;
  };
  mostSatisfied: string;
  needsImprovement: string;
  rating: number;
}

export function parseSurveyRow(row: string[], headers: string[]): SurveyRow | null {
  if (row.length < headers.length) return null;

  try {
    return {
      timestamp: row[0] || '',
      gender: row[1] || '',
      age: row[2] || '',
      visitFrequency: row[3] || '',
      visitPurposes: parseVisitPurposes(row[4] || ''),
      satisfaction: {
        staffFriendliness: satisfactionToNumber(row[5] || ''),
        productVariety: satisfactionToNumber(row[6] || ''),
        cleanliness: satisfactionToNumber(row[7] || ''),
        facilities: satisfactionToNumber(row[8] || ''),
        parking: satisfactionToNumber(row[9] || ''),
      },
      mostSatisfied: row[10] || '',
      needsImprovement: row[11] || '',
      rating: parseInt(row[12] || '0', 10),
    };
  } catch (error) {
    console.error('Error parsing survey row:', error);
    return null;
  }
}

/**
 * 만족도 항목 이름 매핑
 */
export const satisfactionLabels = {
  staffFriendliness: '직원 친절도',
  productVariety: '상품 구색 및 다양성',
  cleanliness: '매장 청결 및 분위기',
  facilities: '편의 시설',
  parking: '주차 시설 및 접근성',
};

