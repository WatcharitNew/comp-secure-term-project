import React, { useEffect, useState } from "react";
import "./style.scss";
import { useHistory } from "react-router";
import axios from "axios";
import edit_icon from "../../img/edit.png";
import delete_icon from "../../img/delete.png";

const ENDPOINT = process.env.REACT_APP_BACKEND;

const HomeComponent = () => {
  const [posts, setPosts] = useState([]);
  const isAdmin = sessionStorage.getItem("isAdmin");
  const userId = sessionStorage.getItem("_id");

  axios.defaults.headers.common["Authorization"] =
    "Bearer " + sessionStorage.getItem("access_token");
  useEffect(() => {
    let posts, comments;
    const fetchData = async () => {
      const posts_res = await axios.get(`${ENDPOINT}/posts`);
      if (posts_res.status === 200) {
        posts = posts_res.data;
      } else {
        console.log(
          `Error: ${ENDPOINT}/posts return status ${posts_res.status}`
        );
        return;
      }
      const comments_res = await axios.get(`${ENDPOINT}/comments`);
      if (comments_res.status === 200) {
        comments = comments_res.data;
      } else {
        console.log(
          `Error: ${ENDPOINT}/posts return status ${comments_res.status}`
        );
        return;
      }
    };
    fetchData().then(() => {
      let postIdToIdx = {};
      posts.forEach((post, idx) => {
        const { _id } = post;
        postIdToIdx[_id] = idx;
        posts[idx].comments = [];
      });
      comments.forEach((comment) => {
        const { postId } = comment;
        if (postIdToIdx[postId] !== undefined) {
          posts[postIdToIdx[postId]].comments.push(comment);
        }
      });
      setPosts(posts);
    });
  }, []);

  const handleAddComment = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      axios
        .post(`${ENDPOINT}/comments`, {
          userId,
          content: event.target.value,
          postId: event.target.getAttribute("post-id"),
        })
        .then(window.location.reload(false));
    }
  };

  const handleAddPost = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      axios
        .post(`${ENDPOINT}/posts`, { userId, content: event.target.value })
        .then(window.location.reload(false));
    }
  };

  const postsComponent = posts.map((post) => {
    const formattedDate = post.createdTime.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    const commentsComponent = post.comments.map((comment) => {
      const formattedDate = comment.createdTime.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      return (
        <CommentComponent
          key={comment._id}
          comment={comment}
          formattedDate={formattedDate}
          canModify={isAdmin === "true" || comment.userId === userId}
        />
      );
    });

    commentsComponent.push(
      <input
        key={`add-comment-${post._id}`}
        post-id={post._id}
        className="addComment"
        placeholder="Add Comment..."
        onKeyPress={handleAddComment}
      />
    );
    return (
      <PostComponent
        key={post._id}
        post={post}
        formattedDate={formattedDate}
        commentsComponent={commentsComponent}
        canModify={isAdmin === "true" || post.userId === userId}
      />
    );
  });

  const displayName = sessionStorage.getItem("displayName");

  const history = useHistory();
  const handleLogOut = () => {
    sessionStorage.removeItem("_id");
    sessionStorage.removeItem("displayName");
    sessionStorage.removeItem("access_token");
    history.push("/login");
    history.go(0);
  };

  return (
    <div className="background">
      <button className="logOut" onClick={handleLogOut}>
        Log Out
      </button>
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

const PostComponent = (props) => {
  const [isEditing, setEditing] = useState(false);
  const { post, formattedDate, commentsComponent, canModify } = props;
  const handleEditPost = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      axios
        .post(`${ENDPOINT}/posts/${event.target.getAttribute("post-id")}`, {
          content: event.target.value,
        })
        .then(window.location.reload(false));
    }
  };
  const handleDeletePost = (event) => {
    axios
      .delete(`${ENDPOINT}/posts/${event.target.getAttribute("post-id")}`)
      .then(window.location.reload(false));
  };
  return (
    <div className="post">
      <span className="postUserName">
        {post.userName}
        <span className="postTime">{formattedDate}</span>
      </span>
      {isEditing ? (
        <input
          post-id={post._id}
          className="addPost"
          placeholder="Edit Post..."
          defaultValue={post.content}
          onKeyPress={handleEditPost}
        />
      ) : (
        <span className="postText">{post.content}</span>
      )}
      <div className="comments">{commentsComponent}</div>
      {canModify && (
        <img
          src={edit_icon}
          alt="edit"
          className="editButton"
          onClick={() => setEditing(true)}
        />
      )}
      {canModify && (
        <img
          src={delete_icon}
          alt="delete"
          className="deleteButton"
          post-id={post._id}
          onClick={handleDeletePost}
        />
      )}
    </div>
  );
};

const CommentComponent = (props) => {
  const [isEditing, setEditing] = useState(false);
  const { comment, formattedDate, canModify } = props;
  const handleEditComment = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      axios
        .post(
          `${ENDPOINT}/comments/${event.target.getAttribute("comment-id")}`,
          {
            content: event.target.value,
          }
        )
        .then(window.location.reload(false));
    }
  };
  const handleDeleteComment = (event) => {
    axios
      .delete(`${ENDPOINT}/comments/${event.target.getAttribute("comment-id")}`)
      .then(window.location.reload(false));
  };
  return (
    <div className="comment" key={comment._id}>
      <span className="commentUserName">
        {comment.userName}
        <span className="commentDate">{formattedDate}</span>
      </span>
      {isEditing ? (
        <input
          comment-id={comment._id}
          className="addComment"
          placeholder="Edit Comment..."
          defaultValue={comment.content}
          onKeyPress={handleEditComment}
        />
      ) : (
        <span className="commentText">{comment.content}</span>
      )}
      {canModify && (
        <img
          alt="edit"
          src={edit_icon}
          className="editButton"
          onClick={() => setEditing(true)}
        />
      )}
      {canModify && (
        <img
          alt="delete"
          src={delete_icon}
          className="deleteButton"
          comment-id={comment._id}
          onClick={handleDeleteComment}
        />
      )}
    </div>
  );
};

export const Home = React.memo(HomeComponent);
