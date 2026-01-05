'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { SurveyRow } from '@/lib/dataTransform';
import {
  SummaryCards,
  GenderChart,
  AgeChart,
  VisitFrequencyChart,
  SatisfactionChart,
  RatingChart,
  VisitPurposeChart,
} from '@/components/Charts';

export default function Dashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/sheets');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        // 에러 타입에 따라 다른 메시지 표시
        if (result.type === 'API_NOT_ENABLED') {
          setError(
            `${result.error}\n\n${result.message}\n\n또는 Google Cloud Console에서 프로젝트 "dashboard-study-483108"의 Google Sheets API를 활성화하세요.`
          );
        } else if (result.type === 'PERMISSION_DENIED') {
          setError(
            `${result.error}\n\n${result.message}\n\n스프레드시트를 열고 "공유" 버튼을 클릭한 후 서비스 계정 이메일을 추가하세요.`
          );
        } else {
          setError(result.message || result.error || '데이터를 가져오는데 실패했습니다.');
        }
      }
    } catch (err) {
      setError('데이터를 가져오는데 실패했습니다. 네트워크 연결을 확인하세요.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">오류 발생</h2>
            <div className="text-left text-gray-700 whitespace-pre-line mb-4">
              {error}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800 font-semibold mb-2">해결 방법:</p>
              <ol className="text-sm text-yellow-700 text-left list-decimal list-inside space-y-1">
                <li>Google Cloud Console에서 Google Sheets API 활성화</li>
                <li>스프레드시트에 서비스 계정 이메일 공유 권한 부여</li>
                <li>서비스 계정 키 파일이 올바른 위치에 있는지 확인</li>
              </ol>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">백화점 고객 설문조사 대시보드</h1>
            {session?.user && (
              <div className="mt-2 flex items-center gap-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-600">
                    {session.user.name || session.user.email}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              새로고침
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        <SummaryCards data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GenderChart data={data} />
          <AgeChart data={data} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <VisitFrequencyChart data={data} />
          <RatingChart data={data} />
        </div>

        <div className="mb-6">
          <SatisfactionChart data={data} />
        </div>

        <div className="mb-6">
          <VisitPurposeChart data={data} />
        </div>
      </div>
    </div>
  );
}

