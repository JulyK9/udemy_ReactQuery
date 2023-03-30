import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';
import { useInfiniteQuery } from 'react-query';

const initialUrl = 'https://swapi.dev/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query

  const {
    data,
    fetchNextPage,
    hasNextPage,
    // 로딩, 에러 인디케이터
    isLoading,
    isError,
    error,
    isFetching,
  } = useInfiniteQuery(
    'sw-species',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      // lastPage의 next 속성을 불러와 hasNextPage 데이터가 있을 때마다 쿼리함수의 pageParams에 할당해줌
      // getNextPageParam: (lastPage) => lastPage.next,
      // lastPage.next가 null인 경우는 undefined를 할당 => 그러면 hasNextPage 값도 false가 됨
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  // 캐시된 데이터가 없어서 새 데이터를 가져올 때는 데이터는 undefined 이기때문에 에러가 발생하고 isLoading이나 isError에서 조기 반환이 실행됨

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error! {error.toString}</div>;

  // return <InfiniteScroll />;
  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) => {
          return pageData.results.map((species) => {
            return (
              <Species
                key={species.name}
                name={species.name}
                language={species.language}
                averageLifespan={species.average_lifespan}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
