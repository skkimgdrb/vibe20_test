'use client';

import { SurveyRow } from '@/lib/dataTransform';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartsProps {
  data: SurveyRow[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

/**
 * 통계 요약 카드
 */
export function SummaryCards({ data }: ChartsProps) {
  const total = data.length;
  const avgRating = data.reduce((sum, row) => sum + row.rating, 0) / total;
  
  const allSatisfactionScores = data.flatMap(row => [
    row.satisfaction.staffFriendliness,
    row.satisfaction.productVariety,
    row.satisfaction.cleanliness,
    row.satisfaction.facilities,
    row.satisfaction.parking,
  ]);
  const avgSatisfaction = allSatisfactionScores.reduce((sum, score) => sum + score, 0) / allSatisfactionScores.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">총 응답 수</h3>
        <p className="text-3xl font-bold text-gray-900">{total}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">평균 별점</h3>
        <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">전체 만족도 평균</h3>
        <p className="text-3xl font-bold text-gray-900">{avgSatisfaction.toFixed(2)}</p>
      </div>
    </div>
  );
}

/**
 * 성별 분포 (파이 차트)
 */
export function GenderChart({ data }: ChartsProps) {
  const genderCount = data.reduce((acc, row) => {
    acc[row.gender] = (acc[row.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(genderCount).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">성별 분포</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * 연령대 분포 (막대 차트)
 */
export function AgeChart({ data }: ChartsProps) {
  const ageCount = data.reduce((acc, row) => {
    acc[row.age] = (acc[row.age] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(ageCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const order = ['20대', '30대', '40대', '50대', '60대 이상'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">연령대 분포</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * 방문 빈도 분포 (막대 차트)
 */
export function VisitFrequencyChart({ data }: ChartsProps) {
  const frequencyCount = data.reduce((acc, row) => {
    acc[row.visitFrequency] = (acc[row.visitFrequency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(frequencyCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const order = ['주 1회 이상', '월 1~2회', '월 1회 미만'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">방문 빈도 분포</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82CA9D" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * 만족도 항목별 평균 (막대 차트)
 */
export function SatisfactionChart({ data }: ChartsProps) {
  const satisfactionLabels = {
    staffFriendliness: '직원 친절도',
    productVariety: '상품 구색 및 다양성',
    cleanliness: '매장 청결 및 분위기',
    facilities: '편의 시설',
    parking: '주차 시설 및 접근성',
  };

  const calculateAverage = (key: keyof SurveyRow['satisfaction']) => {
    const sum = data.reduce((acc, row) => acc + row.satisfaction[key], 0);
    return sum / data.length;
  };

  const chartData = Object.entries(satisfactionLabels).map(([key, label]) => ({
    name: label,
    value: calculateAverage(key as keyof SurveyRow['satisfaction']),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">만족도 항목별 평균</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 4]} />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * 별점 분포 (막대 차트)
 */
export function RatingChart({ data }: ChartsProps) {
  const ratingCount = data.reduce((acc, row) => {
    acc[row.rating] = (acc[row.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const chartData = [1, 2, 3, 4, 5].map(rating => ({
    name: `${rating}점`,
    value: ratingCount[rating] || 0,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">별점 분포</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#FFBB28" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * 방문 목적 분석 (막대 차트)
 */
export function VisitPurposeChart({ data }: ChartsProps) {
  const purposeCount: Record<string, number> = {};
  
  data.forEach(row => {
    row.visitPurposes.forEach(purpose => {
      purposeCount[purpose] = (purposeCount[purpose] || 0) + 1;
    });
  });

  const chartData = Object.entries(purposeCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">방문 목적 분석</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

