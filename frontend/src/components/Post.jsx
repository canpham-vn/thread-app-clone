import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const Post = ({ post, postedBy }) => {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);

  const showToast = useShowToast();

  const navigate = useNavigate();

  const navigateToUserPage = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  useEffect(() => {
    console.log("get user ");
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };

    getUser();
  }, [postedBy, showToast]);

  if (user === null) {
    return null;
  }

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size='md'
            name={user.name}
            src={user.profilePic}
            onClick={navigateToUserPage}
          />
          <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size='xs'
                name={post.replies[0].name}
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left='15px'
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size='xs'
                name={post.replies[1].name}
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right='-5px'
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size='xs'
                name={post.replies[2].name}
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left='4px'
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection='column' gap={2}>
          <Flex justifyContent='space-between' w='full'>
            <Flex w='full' alignItems='center'>
              <Text
                fontSize='sm'
                fontWeight='bold'
                onClick={navigateToUserPage}
              >
                {user.name}
              </Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems='center'>
              <Text fontSize='sm' color='gray.light'>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Flex fontSize='sm'>{post.text}</Flex>
          {post.img && (
            <Box
              borderRadius={6}
              overflow='hidden'
              border='1px solid'
              borderColor='gray.light'
            >
              <Image src={post.img} w='full' />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setLiked} />
          </Flex>

          <Flex gap={2} alignItems='center'>
            <Text color='gray.light' fontSize='sm'>
              {post.replies.length} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius='full' bg='gray.light'></Box>
            <Text color='gray.light' fontSize='sm'>
              {post.likes.length} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
