// @ts-nocheck
import dayjs from 'dayjs';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from '../../user/hooks/useUser';
import { AppointmentDateMap } from '../types';
import { getAvailableAppointments } from '../utils';
import { getMonthYearDetails, getNewMonthYear, MonthYear } from './monthYear';

// fetch function for useQuery call
async function getAppointments(
  year: string,
  month: string,
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// types for hook return object
interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
export function useAppointments(): UseAppointments {
  /** ****************** START 1: monthYear state *********************** */
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  // state to track current monthYear chosen by user
  // state value is returned in hook return object
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // setter to update monthYear obj in state when user changes month in view,
  // returned in hook return object
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  // We will need imported function getAvailableAppointments here
  // We need the user to pass to getAvailableAppointments so we can show
  //   appointments that the logged-in user has reserved (in white)
  const { user } = useUser();

  // data는 useQuery가 셀렉트 함수를 실행할 때 얻는 appointments 데이터임
  // 익명 함수로 최적화를 수행하지 않고 있음. 따라서 훅에 있을 때마다 변경될 것임.
  // 이를 안정적인 함수로 만들기 위해서 useCallback을 실행해줌
  // 종속성 배열에는 user를 넣어줌 => 사용자가 바뀔때마다 함수를 변경해야 함
  const selectFn = useCallback(
    (data) => getAvailableAppointments(data, user),
    [user],
  );

  // 최적화는 데이터의 변경 여부와 함수의 변경 여부를 확인하고 변경사항이 없으면 해당함수를 다시 실행하지 않음

  /** ****************** END 2: filter appointments  ******************** */
  /** ****************** START 3: useQuery  ***************************** */
  // useQuery call for appointments for the current monthYear

  // prefetch next month when montYear changes
  const queryClient = useQueryClient();

  useEffect(() => {
    // assume increment of one month
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery(
      [queryKeys.appointments, nextMonthYear.year, nextMonthYear.month],
      () => getAppointments(nextMonthYear.year, nextMonthYear.month),
    );
  }, [queryClient, monthYear]);

  // TODO: update with useQuery!
  // Notes:
  //    1. appointments is an AppointmentDateMap (object with days of month
  //       as properties, and arrays of appointments for that day as values)
  //
  //    2. The getAppointments query function needs monthYear.year and
  //       monthYear.month

  // const appointments = {};

  const fallback = {}; // 빈 객체로 해당 월에 예약이 없다는 의미

  const { data: appointments = fallback } = useQuery(
    // queryKeys.appointments,
    [queryKeys.appointments, monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month),
    {
      // select 옵션은 데이터가 반환되기 전에 쿼리 결과에서 특정 데이터를 변환하거나 선택하는 데 사용됨.(따라서 필터링하는데 사용할 수 있음)
      // select 옵션은 콜백 함수 형태
      // 쿼리키가 변경될 때까지 이전의 모든 데이터를 유지시켜주는 옵션, 다음 쿼리키에 대한 데이터를 로드하는 동안 플레이스홀더로 사용하는 것
      // 하지만 이렇게 하면 다음 달로 이동시 데이터가 겹치는 현상 발생(백그라운드가 변경되기 때문) => 따라서 여기서는 적합한 옵션이 아님
      // keepPreviousData: true,

      // showAll이 참일 경우 함수를 실행하지 않고 모든 데이터를 반복 => 함수에 undefined 값을 줌
      select: showAll ? undefined : selectFn,
    },
  );

  /** ****************** END 3: useQuery  ******************************* */

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
