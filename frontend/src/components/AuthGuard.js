import React from "react";
import Redirect from "./Redirect";

function AuthGaurd({ children }) {
  const _id = sessionStorage.getItem("_id");

  if (!_id) {
    return <Redirect to="/login" />;
  }

  return <div>{children}</div>;
}
export default AuthGaurd;
