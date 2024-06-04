import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <AuthPage />} />
        <Route path='/auth' element={!user ? <AuthPage /> : <HomePage />} />
        <Route
          path='/update'
          element={user ? <UpdateProfilePage /> : <AuthPage />}
        />

        <Route
          path='/:username'
          element={
            <>
              <UserPage />
              {user && <CreatePost />}
            </>
          }
        />
        <Route path='/:username/post/:postId' element={<PostPage />} />
      </Routes>
    </Container>
  );
}

export default App;
