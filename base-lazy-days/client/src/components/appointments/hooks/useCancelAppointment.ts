import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
export function useCancelAppointment(): UseMutateFunction<
  void, // 변이함수 removeAppointmentUser는 void를 반환
  unknown, // 오류 유형은 알 수 없기 때문
  Appointment, // mutate 함수의 인수가 Appointment
  unknown // onMutate 함수를 실행하지 않으므로 onMutate의 컨텍스트가 없으므로 unknown
> {
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function
  const { mutate } = useMutation(removeAppointmentUser, {
    onSuccess: () => {
      // queryKeys.Appointments로 시작하는 모든 쿼리를 무효함
      queryClient.invalidateQueries([queryKeys.appointments]);
      toast({
        title: 'You have canceled the appointment',
        status: 'warning',
      });
    },
  });

  return mutate;
}
