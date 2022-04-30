import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/loginPage/login";
import HomePage from "./components/homepage/homePage";
import CreateProfile from "./components/createProfile/createProfile";
import AuthWrapper from "./requireAuth";
import UserProfilePage from "./components/userPage/userPage";
import ProfilePage from "./components/profilePage/profilePage";
import NotFound from "./NotFound";
import ChatComponent from "./components/chatComponent/chatComponent";
import ExploreComponent from "./components/exploreComponent/exploreComponent";

class AppRouter extends React.Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="create-profile" element={
                        <AuthWrapper Component={<CreateProfile/>}/>
                    } />
                    <Route path="home" element={
                        <AuthWrapper Component={<HomePage/>}/>
                    } />
                    <Route path="myprofile" element={
                        <AuthWrapper Component={<ProfilePage/>}/>
                    } />
                    <Route path="chat" element={
                        <AuthWrapper Component={<ChatComponent/>}/>
                    } />
                    <Route path="explore" element={
                        <AuthWrapper Component={<ExploreComponent/>}/>
                    } />
                    <Route path="user/:userId" element={<UserProfilePage />} />
                    <Route path="*" element={<NotFound/>} />
                </Routes>
            </Router>
        );
    }
}

export default AppRouter;