import { NextResponse } from 'next/server';
import { getSpreadsheetData } from '@/lib/googleSheets';
import { parseSurveyRow, SurveyRow } from '@/lib/dataTransform';

export async function GET() {
  try {
    const rows = await getSpreadsheetData();
    
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'No data found' },
        { status: 404 }
      );
    }

    // 첫 번째 행은 헤더
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // 데이터 파싱
    const surveyData: SurveyRow[] = [];
    for (const row of dataRows) {
      const parsed = parseSurveyRow(row, headers);
      if (parsed) {
        surveyData.push(parsed);
      }
    }

    return NextResponse.json({
      success: true,
      data: surveyData,
      total: surveyData.length,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Google Sheets API 활성화 오류 체크
    if (error?.code === 403 && error?.errors?.[0]?.reason === 'accessNotConfigured') {
      const projectId = error?.errors?.[0]?.message?.match(/project (\d+)/)?.[1] || 'unknown';
      return NextResponse.json(
        { 
          error: 'Google Sheets API가 활성화되지 않았습니다',
          message: `Google Sheets API를 활성화해야 합니다. 다음 링크를 방문하여 API를 활성화하세요: https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectId}`,
          type: 'API_NOT_ENABLED',
          projectId
        },
        { status: 403 }
      );
    }
    
    // 권한 오류 체크
    if (error?.code === 403) {
      return NextResponse.json(
        { 
          error: '스프레드시트 접근 권한이 없습니다',
          message: '서비스 계정 이메일(dashboard-bot@dashboard-study-483108.iam.gserviceaccount.com)에 스프레드시트 읽기 권한을 부여해야 합니다.',
          type: 'PERMISSION_DENIED'
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { 
        error: '스프레드시트 데이터를 가져오는데 실패했습니다',
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
        type: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}

