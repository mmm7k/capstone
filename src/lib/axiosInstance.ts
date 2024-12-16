import { useAuthStore } from '@/store/userstore';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.chosun.life:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: accessToken이 있다면 헤더에 설정
api.interceptors.request.use(
  (config) => {
    const authHeader = api.defaults.headers.common['Authorization'];
    const accessToken =
      typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 리프레쉬 중복 방지
let isRefreshing = false;
let failedQueue: any[] = [];

// 실패한 요청 큐에 넣기
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });

  failedQueue = [];
};

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 발생 시 리프레쉬 토큰으로 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 리프레쉬 중이면 요청 큐에 추가
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('Refresh token not found.');
        }

        const { data } = await axios.post(
          'http://api.chosun.life:8000/api/token/refresh/',
          { refresh: refreshToken },
        );

        const newAccessToken = data.access;

        // 새 accessToken 헤더에 설정
        api.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest); // 요청 재시도
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('refreshToken');
        const { clearUsername } = useAuthStore.getState();
        clearUsername();
        alert('로그인이 필요합니다.');
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
