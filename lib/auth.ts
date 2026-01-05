import { auth } from '@/auth';

/**
 * 서버 컴포넌트에서 현재 세션을 가져옵니다
 */
export async function getSession() {
  return await auth();
}

/**
 * 현재 사용자가 로그인되어 있는지 확인합니다
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

