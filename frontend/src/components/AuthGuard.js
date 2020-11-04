import React, { useState } from "react";
import Redirect from "./Redirect";

function AuthGaurd({ children }) {
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));

  if (!userId) {
    return <Redirect to="/login" />;
  }

  return <div>{children}</div>;
}
export default AuthGaurd;
