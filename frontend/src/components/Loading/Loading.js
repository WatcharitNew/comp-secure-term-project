import React from "react";

const LoadingComponent = (props) => {
  return <div>Loading...</div>;
};

export const Loading = React.memo(LoadingComponent);
