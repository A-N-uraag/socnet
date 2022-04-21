import {useContext} from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export function RequireAuth({ children }: { children: JSX.Element }) {
  let user = useContext(AuthContext);
  console.log("Hello");
  let location = useLocation();
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return children;
  }
}