import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";

const UserPage = () => {
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const { user, isLoading } = useGetUserProfile();

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setPosts(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [showToast, username]);

  if (!user && isLoading) {
    return (
      <Flex justifyContent='center'>
        <Spinner size='xl' />;
      </Flex>
    );
  }
  if (!user && !isLoading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />

      {fetchingPosts && (
        <Flex justifyContent='center' my={12}>
          <Spinner size='xl' />;
        </Flex>
      )}

      {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>}

      {posts.map((post) => (
        <Post key={post._id} post={post} setPosts={setPosts} />
      ))}
    </>
  );
};

export default UserPage;
