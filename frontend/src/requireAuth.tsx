import React, {useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

const override = `
  display: block;
  margin: 25% auto;
  border-color: red;
`;

function AuthWrapper(props:any) {
    const {Component} = props;
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/");
        if (error) console.log(error);
    }, [user, loading, navigate, error]);

    if(user) {
        return Component;
    }

    return (
        <ClimbingBoxLoader color="#332FD0" css={override} size={25}/>
    )

}

export default AuthWrapper;