import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });
// 차크라 관련 참고: https://chakra-ui.com/docs/components/toast#standalone-toasts

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts (토스트가 점차 쌓이기 때문에 중복되지 않도록 처리)
  // 차크라 closing toast 참고: https://chakra-ui.com/docs/components/toast/usage#closing-toasts
  toast.closeAll();
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

// to satisfy typescript until this file has uncommented contents

// export const queryClient = new QueryClient();
// 오류 핸들러의 기본값을 사용하도록 옵션을 설정하여 중앙집중식 오류 핸들링하도록 세팅
// 이렇게 해주면 useTreatments 컴포넌트에서 기존에 했던 것처럼 useQuery마다 오류 핸들러를 추가할 필요가 없게됨
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      staleTime: 600000, // 10 minutes
      cacheTime: 900000, // 15 minutes
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: queryErrorHandler, // mutations도 오류 처리 기본값을 가지도록 처리
    },
  },
});
