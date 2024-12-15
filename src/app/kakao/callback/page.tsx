import KakaoCallback from '@/components/kakao/KakaoCallback';
import { Suspense } from 'react';

export default function kakaoCallBackPage() {
  return (
    <Suspense>
      <KakaoCallback />
    </Suspense>
  );
}
