import { google } from 'googleapis';
import path from 'path';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1n92IlawRcq6n5bh2vWQU0eGrRFkFhHMmvFQysn_36GU';
const SHEET_GID = process.env.GOOGLE_SHEETS_SHEET_GID || '951142470';
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials/dashboard-study-483108-9eb3107ad688.json';

/**
 * Google Sheets API 클라이언트 초기화
 */
async function getAuthClient() {
  // Vercel 환경에서는 환경 변수에서 서비스 계정 키를 읽음
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey) {
    // 환경 변수에서 JSON 문자열로 저장된 경우
    const credentials = typeof serviceAccountKey === 'string' 
      ? JSON.parse(serviceAccountKey) 
      : serviceAccountKey;
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    return await auth.getClient();
  } else {
    // 로컬 개발 환경에서는 파일에서 읽음
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve(process.cwd(), CREDENTIALS_PATH),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return await auth.getClient();
  }
}

/**
 * 스프레드시트 데이터 읽기
 */
export async function getSpreadsheetData() {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // 시트 이름을 찾기 위해 스프레드시트 메타데이터 가져오기
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    // gid로 시트 찾기 (gid는 sheetId와 동일)
    let sheetName = 'Sheet1'; // 기본값
    const targetSheetId = parseInt(SHEET_GID, 10);
    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.sheetId === targetSheetId
    );
    if (sheet?.properties?.title) {
      sheetName = sheet.properties.title;
    } else if (spreadsheet.data.sheets?.[0]?.properties?.title) {
      // gid를 찾지 못하면 첫 번째 시트 사용
      sheetName = spreadsheet.data.sheets[0].properties.title;
    }

    // 시트 데이터 읽기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`, // 충분한 범위 읽기
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in spreadsheet');
    }

    return rows;
  } catch (error) {
    console.error('Error reading spreadsheet:', error);
    throw error;
  }
}

