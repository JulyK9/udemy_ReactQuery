import { Icon, Stack, Text } from '@chakra-ui/react';
import { usePrefetchTreatments } from 'components/treatments/hooks/useTreatments';
import { ReactElement } from 'react';
import { GiFlowerPot } from 'react-icons/gi';

import { BackgroundImage } from '../common/BackgroundImage';

export function Home(): ReactElement {
  // 가져온 훅을 컴포넌트의 최상단에서 실행
  // 이 컴포넌트의 렌더 부분을 보면 동적인 데이터가 거의 없음 => 리렌더링이 일어날 일이 별로 없기 때문에 캐시의 변동을 덜 고려해도 됨
  // 만일 염려가 된다면 stalTime과 cacheTime을 관리해줄 몇 가지 옵션을 추가하면 모든 트리거마다 리페칭되지 않도록 해줄 수 있음
  usePrefetchTreatments();

  return (
    <Stack textAlign="center" justify="center" height="84vh">
      <BackgroundImage />
      <Text textAlign="center" fontFamily="Forum, sans-serif" fontSize="6em">
        <Icon m={4} verticalAlign="top" as={GiFlowerPot} />
        Lazy Days Spa
      </Text>
      <Text>Hours: limited</Text>
      <Text>Address: nearby</Text>
    </Stack>
  );
}
