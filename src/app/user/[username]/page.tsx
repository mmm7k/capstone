'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axiosInstance';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// 날짜 포매팅 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// API에서 데이터를 가져오는 함수
const fetchTripData = async () => {
  const response = await api.get('/api/trip');
  return response.data;
};

interface Trip {
  id: number;
  content: string;
  created_by: number;
  created_at: string;
}

export default function TripPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tripData'],
    queryFn: fetchTripData,
  });

  if (isLoading)
    return <div className="text-center mt-8 text-white">Loading...</div>;
  if (isError)
    return (
      <div className="text-red-500 text-center mt-8">Error loading data.</div>
    );

  return (
    <div className="p-8 bg-[#151825] text-white min-h-screen pt-[10dvh]">
      <h1 className="text-xl font-base mb-6 ">여행 일정</h1>
      {data?.data.map((trip: Trip) => (
        <Accordion
          key={trip.id}
          className="mb-4 bg-[#151825] rounded-lg text-white"
          style={{ backgroundColor: '#151825', color: 'white' }} // 전체 배경 및 텍스트 색상 적용
        >
          {/* Accordion Summary */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="text-[#00C395]" />}
            aria-controls={`panel${trip.id}-content`}
            id={`panel${trip.id}-header`}
            style={{
              backgroundColor: '#151825', // Summary 배경
              color: 'white', // Summary 텍스트 색상
            }}
          >
            {/* 날짜 */}
            <Typography
              className=""
              style={{
                color: 'white',
                fontWeight: '500',
                fontSize: '0.9rem',
                marginRight: '1rem',
              }}
            >
              {formatDate(trip.created_at)}
            </Typography>

            {/* 간략 제목 */}
            <Typography
              style={{
                color: 'white',
                fontWeight: '500',
                flex: 1,
                fontSize: '1rem',
              }}
            >
              {trip.content.length > 50
                ? `${trip.content.substring(0, 50)}...`
                : trip.content}
            </Typography>
          </AccordionSummary>

          {/* Accordion Details */}
          <AccordionDetails
            style={{
              backgroundColor: '#1F2232', // 내부 상세 배경 색상
              color: 'white', // 상세 텍스트 색상
            }}
          >
            <Typography className="whitespace-pre-wrap">
              {trip.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
