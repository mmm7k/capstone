'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/userstore';
import api from '@/lib/axiosInstance';
import { Link } from 'lucide-react';

const loginSchema = yup.object({
  username: yup
    .string()
    .required('아이디를 입력해주세요.')
    .min(4, '아이디는 최소 4자 이상이어야 합니다.')
    .max(20, '아이디는 최대 20자까지 가능합니다.'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { setUsername } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/api/login/', data);

      // 서버에서 받은 accessToken과 refreshToken
      const { access, refresh, username } = response.data;

      // accessToken을 axios 헤더에 설정 (로컬스토리지에 저장 X)
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // refreshToken은 localStorage에 저장
      localStorage.setItem('refreshToken', refresh);

      // Zustand 상태에 username 저장
      setUsername(username);

      //   alert('로그인 성공!');

      window.location.href = '/'; // 홈 경로로 이동
    } catch (error: any) {
      console.error('로그인 실패:', error.response?.data || error.message);
      alert('로그인 실패: 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#151825]">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          로그인
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 아이디 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              아이디
            </label>
            <input
              type="text"
              {...register('username')}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.username
                  ? 'border-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="아이디를 입력하세요"
            />
            <p className="text-xs text-red-500">{errors.username?.message}</p>
          </div>
          {/* 비밀번호 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              비밀번호
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.password
                  ? 'border-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="비밀번호를 입력하세요"
            />
            <p className="text-xs text-red-500">{errors.password?.message}</p>
          </div>
          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>

          {/* 회원가입 버튼 */}
          <Link href="/signup">
            <button className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 ">
              회원가입
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
