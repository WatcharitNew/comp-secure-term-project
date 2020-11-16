import React from "react";
import Redirect from "./Redirect";

function AuthGaurd({ children }) {
  const displayName = sessionStorage.getItem("displayName");

  if (!displayName) {
    return <Redirect to="/login" />;
  }

  return <div>{children}</div>;
}
export default AuthGaurd;
