import React from "react";

const Like = ({ liked, onLikeToggle }) => {
  return (
    <i
      onClick={onLikeToggle}
      style={{ cursor: "pointer" }}
      className={`fa fa-heart${liked ? "" : "-o"}`}
      aria-hidden="true"
    ></i>
  );
};

export default Like;
