import { useQuery } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // TODO: get data from server via useQuery
  // 데이터에 대한 폴백값을 생성하여 확보
  const fallback = []; // 서버에서 데이터를 받지 않고 캐시가 비어있는 경우 아무 것도 표시하지 않도록 공백 배열로 설정
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments);
  return data;
}
