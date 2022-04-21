import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/loginPage/login";
import HomePage from "./components/homeDummy/homeDummy";
import CreateProfile from "./components/createProfile/createProfile";

import { RequireAuth } from "./requireAuth";
class AppRouter extends React.Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="create-profile" element={
                        <RequireAuth>
                            <CreateProfile />
                        </RequireAuth>
                    } />
                    <Route path="home" element={
                        <RequireAuth>
                            <HomePage />
                        </RequireAuth>
                    } />
                </Routes>
            </Router>
        );
    }
}

export default AppRouter;