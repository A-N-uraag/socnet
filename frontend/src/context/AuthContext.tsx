import React from "react";
import firebase from "firebase/auth";

const AuthContext = React.createContext<firebase.User | null>(null);

export {AuthContext};