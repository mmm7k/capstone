'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/userstore'; // Zustand 상태 관리
import api from '@/lib/axiosInstance'; // 기존 API 인스턴스

export default function KakaoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUsername } = useAuthStore(); // Zustand로 username 상태 저장

  useEffect(() => {
    const code = searchParams.get('code'); // URL에서 code 추출

    const fetchAccessToken = async () => {
      try {
        if (!code) return;

        // 백엔드에 code 전송하여 액세스 토큰 요청
        const response = await api.post(`/api/kakao/token/?code=${code}`);
        const { access, refresh, username } = response.data;

        // Axios 인스턴스의 헤더에 Access Token 설정
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

        // Refresh Token을 로컬 스토리지에 저장
        localStorage.setItem('refreshToken', refresh);

        // Zustand에 username 저장
        setUsername(username);

        // 로그인 성공 메시지
        // alert('로그인 성공!');

        // 메인 페이지로 리다이렉트
        // router.push('/');
        window.location.href = '/';
      } catch (error: any) {
        console.error(
          '카카오 로그인 실패:',
          error.response?.data || error.message,
        );
        alert('로그인 실패: 다시 시도해주세요.');
      }
    };

    fetchAccessToken();
  }, [searchParams, router, setUsername]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#151825] text-white">
      로그인 처리 중...
    </div>
  );
}
