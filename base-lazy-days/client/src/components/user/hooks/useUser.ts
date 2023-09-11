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

  const { data: user } = useQuery(queryKeys.user, () => getUser(user));

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    queryClient.setQueriesData(queryKeys.user, null);
  }

  return { user, updateUser, clearUser };
}
