import React, {useEffect, useState} from "react";
import "./style.scss";
import { useHistory } from "react-router";
import axios from 'axios';

const ENDPOINT = process.env.REACT_APP_BACKEND;

const HomeComponent = () => {
  const [posts, setPosts] = useState([]);
  const isAdmin = sessionStorage.getItem("isAdmin");

  axios.defaults.headers.common["Authorization"] = "Bearer " + sessionStorage.getItem("access_token");
  useEffect(() => {
    axios.get(`${ENDPOINT}/posts`).then((res) => {
      console.log(res.status);
      if(res.status===200) {
        setPosts(res.data);
      }
    })
  });

  const handleAddComment = (event) => {
    if(event.key === 'Enter'){
      console.log(event.target.value);
    }
  }

  const handleAddPost = (event) => {
    if(event.key === 'Enter'){
      console.log(event.target.value);
    }
  }


  const postsComponent = posts.map((post) => {
    const formattedDate = post.createdTime.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    /*
    const commentsComponent = post.comments.map((comment) => {
      const formattedDate = comment.createdTime.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
      return (
        <div className="comment">
          <span className="commentUserName">
            {comment.userName} 
            <span className="commentDate">{formattedDate}</span>
          </span>
          <span className="commentText">{comment.content}</span>
        </div>
      );
    })
    */
    const commentsComponent = [];

    commentsComponent.push((
      <input 
        className="addComment"
        placeholder="Add Comment..."
        onKeyPress={handleAddComment}
      />
    ))
    return (
      <div className="post">
        <span className="postUserName">
          {post.userName}
          <span className="postTime">{formattedDate}</span>
        </span>
        <span className="postText">{post.content}</span>
        <div className="comments">{commentsComponent}</div>
      </div>
    );
  })

  const displayName = sessionStorage.getItem("displayName");

  const history = useHistory();
  const handleLogOut = () => {
    sessionStorage.removeItem("_id");
    sessionStorage.removeItem("displayName");
    sessionStorage.removeItem("access_token");
    history.push('/login');
    history.go(0);
  }

  return (
  <div className="background">
    <button className="logOut" onClick={handleLogOut}>Log Out</button>
    <div className="mainBox">
      <div className="posts">
        <div className="newPost">
          <span className="displayName">{displayName} : </span>
          <input 
            className="addPost"
            placeholder="Add Post..."
            onKeyPress={handleAddPost}
          />
        </div>
        {postsComponent}
      </div>
    </div>
  </div>
  );
};

export const Home = React.memo(HomeComponent);
