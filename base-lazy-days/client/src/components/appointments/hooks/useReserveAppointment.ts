import { UseMutateFunction, useMutation } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// // TODO: update type for React Query mutate function
// type AppointmentMutationFunction = (appointment: Appointment) => void;

// 변이함수에서 반환된 데이터: void / 오류 유형: unknown
// mutation 함수로 전달될 변수의 타입 : Appointment
export function useReserveAppointment(): UseMutateFunction<
  void,
  unknown,
  Appointment,
  unknown
> {
  const { user } = useUser();
  const toast = useCustomToast();

  // TODO: replace with mutate function
  const { mutate } = useMutation((appointment: Appointment) =>
    setAppointmentUser(appointment, user?.id),
  );

  return mutate;
}
