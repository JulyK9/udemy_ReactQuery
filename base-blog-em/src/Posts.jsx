import { useState } from 'react';
import { useQuery } from 'react-query';

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

  // replace with useQuery
  // const data = []; // 임시 하드코딩 데이터
  // const { data, isLoading, error, isError } = useQuery('posts', fetchPosts, {
  const { data, isLoading, error, isError } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage), // 주의: 인자를 들어갈 때는 반드시 무명함수로 작성
    {
      staleTime: 2000,
    }
  );

  // if (!data) return <div></div>; // 얼리 리턴 형태로 처리
  if (isLoading) return <h3>Loading...</h3>; // 로딩상태 얼리 리턴으로 처리
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
