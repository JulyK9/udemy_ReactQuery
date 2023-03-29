import { useEffect, useState } from 'react';
// import { useQuery } from 'react-query';
import { useQuery, useQueryClient } from 'react-query';

import { PostDetail } from './PostDetail';

// api가 100개의 게시물을 반환하기 때문에 10으로 설정(아래 limit 10)
const maxPostPage = 10;

// async function fetchPosts() {
async function fetchPosts(pageNum) {
  const response = await fetch(
    // 'https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0'
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
    // 'https://jsonplaceholder1111.typicode.com/posts?_limit=10&_page=0' // 오류 유도용
  );
  return response.json();
}

export function Posts() {
  // const [currentPage, setCurrentPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // prefetchQuery를 통해 nextPage 정보를 사전 페칭하여 페이지 이동시 사용자 경험을 향상시킬 수 있음
  const queryClient = useQueryClient();

  // currentPage가 바뀔 때마다 로직이 재실행 됨
  // currentPage 변경으로 nextPage도 바뀌게 되고 그에 따라 prefetchQuery로 가져오는 nextPage 쿼리키도 바뀜
  useEffect(() => {
    // 범위 외의 데이터를 가져오지 않도록 조건 추가
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(['posts', nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  // const data = []; // 임시 하드코딩 데이터
  // const { data, isLoading, error, isError } = useQuery('posts', fetchPosts, {
  // const { data, isLoading, error, isError } = useQuery(
  const { data, isLoading, error, isError, isFetching } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage), // 주의: 인자를 들어갈 때는 반드시 무명함수로 작성
    {
      staleTime: 2000,
      keepPreviousData: true, // 쿼리키가 바뀔때도 지난 데이터 유지(이전 페이지로 돌아갈 경우 해당 데이터가 캐시에 있도록)
    }
  );

  // if (!data) return <div></div>; // 얼리 리턴 형태로 처리
  if (isLoading) return <h3>Loading...</h3>; // 로딩상태 얼리 리턴으로 처리
  // if (isFetching) return <h3>Fetching in progress...</h3>; // 캐시된 데이터의 존재여부와 상관없이 프리페치 전 매번 동작
  if (isError)
    // 에러상태 얼리 리턴으로 처리
    return (
      <>
        <h3>Oops, somthing went wrong!</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        {/* <button disabled onClick={() => {}}> */}
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prevValue) => prevValue - 1);
          }}
        >
          Previous page
        </button>
        {/* <span>Page {currentPage + 1}</span> */}
        <span>Page {currentPage}</span>
        {/* <button disabled onClick={() => {}}> */}
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prevValue) => prevValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
