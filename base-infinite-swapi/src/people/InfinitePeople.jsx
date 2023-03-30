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
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useInfiniteQuery(
    'sw-people', // 쿼리 키
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), // 쿼리 함수는 객체를 매개변수로 받음
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      // 이 함수가 undefined를 반환하는지 여부에 따라 hasNextPage가 결정됨
      // lastPage.next가 null 이면(이전 페이지가 없으면) undefined를 반환하도록 함(단축논리 평가)
    }
  );
  // 페이지를 계속 로드할 때 data에 데이터의 페이지가 포함됨

  // isFetching으로 얼리 리턴을 주게 되면 새로운 페이지가 열릴 때마다 조기 반환을 해서 스크롤이 다시 위로 올라가버림
  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error!! {error.toString()}</div>;

  // return <InfiniteScroll />;
  return (
    <>
      {/* 페칭 중에도 로딩 메시지 보여주기 */}
      {isFetching && <div className="loading">Loading...</div>}
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
    </>
  );
}
