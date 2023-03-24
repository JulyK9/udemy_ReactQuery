import { useState } from 'react';
import { useQuery } from 'react-query';

import { PostDetail } from './PostDetail';
const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0'
    // 'https://jsonplaceholder1111.typicode.com/posts?_limit=10&_page=0' // 오류 유도용
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  // const data = []; // 임시 하드코딩 데이터
  const { data, isLoading, error, isError } = useQuery('posts', fetchPosts);

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
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
