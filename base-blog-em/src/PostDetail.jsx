import { useQuery, useMutation } from 'react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // console.log('post: ', post); // props로 넘겨지는 데이터 확인
  // replace with useQuery
  // const data = [];

  // 문제점: 다른 포스트를 눌러도 같은 댓글만 나옴
  // 이유: 동일한 쿼리키(comments)를 사용하고 있어서 리페칭이 일어나지 않음
  // 접근방법:
  // => 리페칭할 트리거가 필요(리마운트, 윈도우 리포커싱, useQueary에서 반환되어 수동으로 리페칭)
  // => 지정된 간격으로 리페칭 자동실행, 변이를 생성한 뒤 쿼리를 무효화시킬 때
  // 쿼리는 게시물 아이디를 포함하기 때문에 쿼리별로 캐시를 남길 수 있음
  // 각 게시물에 대한 쿼리에 라벨을 설정해줌 => 쿼리키에 문자열 대신 배열을 전달!
  // 배열의 첫 번째 요소로 문자열 "comments"를 가지고, 두 번째 요소로 post.id를 가짐
  // 쿼리 키를 쿼리에 대한 의존성 배열로 취급하기 때문에 쿼리 키가 변경되면
  // 즉 post.id가 업데이트되면 React Query가 새 쿼리를 생성해서
  // 개별적인 staleTime과 cacheTime을 가지게 되고 의존성 배열이 다르다면 완전히 다른 것으로 간주하게 됨

  // const { data, isLoading, isError, error } = useQuery('comments', () =>
  //   fetchComments(post.id)
  // );

  const { data, isLoading, isError, error } = useQuery(
    ['comments', post.id],
    () => fetchComments(post.id)
  );

  const deleteMutation = useMutation((postId) => deletePost(postId));
  // useMutation 함수는 객체를 반환함

  const updateMutation = useMutation((postId) => updatePost(postId));

  if (isLoading) return <h2>Loading...</h2>;
  if (isError)
    return (
      <>
        <h2>Something went wrong...</h2>
        {/* <p>{error.toString()}</p> */}
        <p>{error.toString().split(': ')[1]}</p>
      </>
    );

  // console.log('data: ', data);

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      {/* <button>Delete</button> <button>Update title</button> */}
      {/* deleteMutation은 객체를 반환하는데 속성함수인 mutate를 실행 */}
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && (
        <p style={{ color: 'red' }}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: 'blue' }}>Deleting the post</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post has (not) been deleted</p>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isError && (
        <p style={{ color: 'red' }}>Error updating the post</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: 'blue' }}>Updating the post</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post has (not) been updated</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
