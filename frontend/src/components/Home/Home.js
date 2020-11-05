import React from "react";
import "./style.scss";

const HomeComponent = (props) => {
  const mockData = {
    posts: [
      {
        userName: 'Inuyama Shibata',
        text: 'I\'m shiba inu',
        createdTime: new Date(),
        comments: [
          {
            userName: 'Neramit 456',
            createdTime: new Date(),
            text: 'So secure',
          },
          {
            userName: 'Tiger 789',
            createdTime: new Date(),
            text: 'Wow',
          },
        ],
      },
      {
        userName: 'Sumet 123',
        text: 'Test',
        createdTime: new Date(),
        comments: [],
      },
      {
        userName: 'Sumet 123',
        text: 'Test',
        createdTime: new Date(),
        comments: [],
      },
      {
        userName: 'Sumet 123',
        text: 'Test',
        createdTime: new Date(),
        comments: [],
      },
    ]
  }

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


  const {posts} = mockData;
  const postsComponent = posts.map((post) => {
    const formattedDate = post.createdTime.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
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
          <span className="commentText">{comment.text}</span>
        </div>
      );
    })

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
        <span className="postText">{post.text}</span>
        <div className="comments">{commentsComponent}</div>
      </div>
    );
  })

  return (
  <div className="background">
    <div className="mainBox">
      <div className="posts">
        <input 
          className="addPost"
          placeholder="Add Post..."
          onKeyPress={handleAddPost}
        />
        {postsComponent}
      </div>
    </div>
  </div>
  );
};

export const Home = React.memo(HomeComponent);
