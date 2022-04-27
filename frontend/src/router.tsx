import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/loginPage/login";
import HomePage from "./components/homepage/homePage";
import CreateProfile from "./components/createProfile/createProfile";
import AuthWrapper from "./requireAuth";

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
                        <AuthWrapper Component={<HomePage uid={2}/>}/>
                    } />
                </Routes>
            </Router>
        );
    }
}

export default AppRouter;