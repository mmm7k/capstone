'use client';

import { Manrope } from 'next/font/google';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { useAuthStore } from '@/store/userstore';

const roboto = Manrope({
  weight: '400',
  subsets: ['latin'],
});

export default function LayoutHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Zustand의 상태를 메모이제이션으로 감싸 렌더링 최적화
  const username = useMemo(() => useAuthStore.getState().username, []);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-screen h-16 z-20 text-white transition-shadow duration-300 ${
        scroll ? 'shadow-custom' : ''
      } ${pathname === '/' ? 'bg-transparent' : 'bg-[#151825]'}`}
    >
      <div className="flex justify-between items-center h-full px-10">
        <Link href="/">
          <div className={`font-bold cursor-pointer ${roboto.className}`}>
            <span className="text-[#00C395] text-2xl">Go</span>
            <span className="text-2xl">Trip</span>
          </div>
        </Link>
        <nav className="hidden sm:flex space-x-5">
          <Link href="/">
            <div
              className={`cursor-pointer ${
                pathname === '/'
                  ? 'text-white border-b-[3px] border-[#00C395] pb-1'
                  : 'text-[#c8c8c8]'
              }`}
            >
              Home
            </div>
          </Link>
          <Link href="/countries/france">
            <div
              className={`cursor-pointer ${
                pathname.startsWith('/countries')
                  ? 'text-white border-b-[3px] border-[#00C395] pb-1'
                  : 'text-[#c8c8c8]'
              }`}
            >
              Countries
            </div>
          </Link>
          <Link href="/planner">
            <div
              className={`cursor-pointer ${
                pathname === '/planner'
                  ? 'text-white border-b-[3px] border-[#00C395] pb-1'
                  : 'text-[#c8c8c8]'
              }`}
            >
              Planner
            </div>
          </Link>

          {/* 유저네임 표시 */}
          {username ? (
            <Link href={`/user/${username}`}>
              <div className="text-[#c8c8c8] cursor-pointer">{username}</div>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <div
                  className={`cursor-pointer ${
                    pathname === '/login'
                      ? 'text-white border-b-[3px] border-[#00C395] pb-1'
                      : 'text-[#c8c8c8]'
                  }`}
                >
                  Login
                </div>
              </Link>
              <Image
                src="/kakaoLogin.png"
                alt="kakao login"
                width={50}
                height={50}
                onClick={() => {
                  router.push('http://api.chosun.life:8000/api/kakao/login/');
                }}
                style={{ cursor: 'pointer' }}
              />
            </>
          )}
        </nav>
        <button
          className="sm:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <FiX className="text-3xl" />
          ) : (
            <FiMenu className="text-3xl" />
          )}
        </button>
      </div>
    </header>
  );
}
