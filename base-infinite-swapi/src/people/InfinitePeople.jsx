import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from 'react-query';
import { Person } from './Person';

const initialUrl = 'https://swapi.dev/api/people/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    'sw-people', // 쿼리 키
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), // 쿼리 함수는 객체를 매개변수로 받음
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      // 이 함수가 undefined를 반환하는지 여부에 따라 hasNextPage가 결정됨
      // lastPage.next가 null 이면(이전 페이지가 없으면) undefined를 반환하도록 함(단축논리 평가)
    }
  );
  // 페이지를 계속 로드할 때 data에 데이터의 페이지가 포함됨

  // return <InfiniteScroll />;
  return (
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
      {data.pages.map((pageData) => {
        return pageData.results.map((person) => {
          return (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          );
        });
      })}
    </InfiniteScroll>
  );
}
