import React from "react";

const NotFoundComponent = (props) => {
  return <div>Not Found</div>;
};

export const NotFound = React.memo(NotFoundComponent);
