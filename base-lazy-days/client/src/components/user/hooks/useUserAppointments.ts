import dayjs from 'dayjs';
import { useQuery } from 'react-query';

import type { Appointment, User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from './useUser';

// for when we need a query function for useQuery
async function getUserAppointments(
  user: User | null,
): Promise<Appointment[] | null> {
  // user의 id가 없다면 서버에 연결을 시도하지 않도록 null로 반환 처리
  // 경쟁 상태에 있거나 고려하지 못한 요소가 있을 때를 대비해 보수적으로 프로그래밍 한 것
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  // TODO replace with React Query
  const { user } = useUser();

  const fallback: Appointment[] = [];
  const { data: userAppointments = fallback } = useQuery(
    'user-appointments',
    () => getUserAppointments(user),
    // user가 참일 때만(존재할 때만) enabled 되도록(쿼리 요청을 하도록) 옵션 설정
    // 느낌표 연산자를 통해 명시적으로 boolean 타입으로 변환
    { enabled: !!user },
  );

  return userAppointments;
}
