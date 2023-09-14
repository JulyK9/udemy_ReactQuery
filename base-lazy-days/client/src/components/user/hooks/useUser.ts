import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

async function getUser(user: User | null): Promise<User | null> {
  // 로그인한 사용자가 없으면 서버 요청을 하지 않고 null 반환
  if (!user) return null;
  // 로그인한 사용자가 있으면 유저 id를 가지고 서버에 요청하여 유저 데이터를 가져와서 업데이트함
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
    },
  );
  return data.user;
}

// 책임과 역할
// 로컬스토리지와 쿼리 캐시에서 사용자의 상태를 유지하는 것

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();
  // TODO: call useQuery to update user data from server
  // const user = null;

  const { data: user } = useQuery(queryKeys.user, () => getUser(user), {
    // 초기 데이터를 캐시에 추가하고 싶을 때 initialData 옵션 사용
    initialData: getStoredUser,
    // onSuccess 콜백을 통해 user(received) 데이터를 로컬스토리지에 처리
    // 쿼리 함수에서 데이터가 업데이트 되거나 () => getUser(user)
    // setQueryData에서 데이터가 업데이트 될 때마다 호출됨 updateUser
    // onSuccess 콜백은 setQueryData 다음이나 쿼리 함수가 성공한 다음 호출됨
    onSuccess: (received: User | null) => {
      if (!received) {
        clearStoredUser();
      } else {
        setStoredUser(received);
      }
    },
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    queryClient.setQueryData(queryKeys.user, null);
    // queryClient.removeQueries('user-appointments');
    // 하나 이상의 쿼리 키에 removeQueries를 실행하려면 removeQueries를 여러 번 동일하게 실행하면 됨
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
    // 사용자를 이미 무효화했으므로 id에는 접근할 수 없음
    // 하지만 removeQueries 도 쿼리키 접두사를 사용하기 때문에
    // 쿼리키에 두가지가 첫 항목으로 포함되어 있으면 사용자 id는 지정할 필요가 없음
  }

  return { user, updateUser, clearUser };
}
