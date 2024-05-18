import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setIsLoading(false);
      }
    };

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

    getUser();
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
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
