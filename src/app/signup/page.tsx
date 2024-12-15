'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const signupSchema = yup.object({
  username: yup.string().required('사용자 이름을 입력해주세요.'),
  gender: yup
    .string()
    .required('성별을 선택해주세요.')
    .oneOf(['남', '여'], '유효한 성별을 선택해주세요.'),
  age: yup
    .number()
    .required('나이를 입력해주세요.')
    .positive('나이는 양수여야 합니다.')
    .integer('나이는 정수여야 합니다.'),
  email: yup
    .string()
    .email('유효한 이메일 형식을 입력해주세요.')
    .required('이메일을 입력해주세요.'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .min(4, '비밀번호는 최소 4자 이상이어야 합니다.'),
});

type SignupFormData = {
  username: string;
  gender: string;
  age: number;
  email: string;
  password: string;
};

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://api.chosun.life:8000/api/register/',
        data,
      );
      alert('회원가입 성공!');
      router.push('/login'); // 로그인 페이지로 이동
    } catch (error: any) {
      console.error('회원가입 실패:', error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          '회원가입에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#151825]">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          회원가입
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* 사용자 이름 */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              사용자 이름
            </label>
            <input
              {...register('username')}
              placeholder="사용자 이름을 입력하세요"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.username
                  ? 'border-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            <p className="text-xs text-red-500">{errors.username?.message}</p>
          </div>

          {/* 성별 */}
          <div>
            <label className="block mb-2 text-sm font-medium">성별</label>
            <select
              {...register('gender')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500"
            >
              <option value="">성별 선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
            <p className="text-xs text-red-500">{errors.gender?.message}</p>
          </div>

          {/* 나이 */}
          <div>
            <label className="block mb-2 text-sm font-medium">나이</label>
            <input
              type="number"
              {...register('age')}
              placeholder="나이를 입력하세요"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-red-500">{errors.age?.message}</p>
          </div>

          {/* 이메일 */}
          <div>
            <label className="block mb-2 text-sm font-medium">이메일</label>
            <input
              type="email"
              {...register('email')}
              placeholder="이메일을 입력하세요"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-red-500">{errors.email?.message}</p>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block mb-2 text-sm font-medium">비밀번호</label>
            <input
              type="password"
              {...register('password')}
              placeholder="비밀번호를 입력하세요"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-red-500">{errors.password?.message}</p>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}
