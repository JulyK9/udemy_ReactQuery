import { useQuery, useQueryClient } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
// import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // TODO: get data from server via useQuery
  // const toast = useCustomToast(); // 더이상 사용하지 않아서 제거

  // 데이터에 대한 폴백값을 생성하여 확보
  const fallback = []; // 서버에서 데이터를 받지 않고 캐시가 비어있는 경우 아무 것도 표시하지 않도록 공백 배열로 설정
  // const { data = fallback } = useQuery(queryKeys.treatments, getTreatments, {
  //   // 쿼리함수가 에러를 발생시키면 onError 콜백이 실행됨
  //   onError: (error) => {
  //     const title =
  //       error instanceof Error // 에러가 원하는 에러인지 확인하는 것
  //         ? error.message
  //         : 'error connecting to the server';
  //     toast({ title, status: 'error' });
  //   },
  // });

  // queryClient의 디폴트 옵션에서 queries 옵션으로 onError속성에 에러 핸들러를 추가해줬기 때문에 아래와 같이 변경하여 유일한 옵션이 되도록 변경
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments);
  return data;
}

// Home 컴포넌트에서 Treatments 데이터를 프리페칭(prefetchQuery)하기 위한 훅 작성
export function usePrefetchTreatments(): void {
  const queryClient = useQueryClient();

  // 여기서 쿼리키는 어느 useQuery가 이 데이터를 찾아야하는지 알려주기 때문에 매우 중요함
  // 캐시에 있는 데이터가 이 useQueary 호출과 일치한다고 알려주는 것
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments);
}
