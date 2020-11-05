import React, { useCallback, useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router";
import "./style.scss";

const ENDPOINT = 'http://localhost:10000/users'

const AuthComponent = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const history = useHistory();

  const onClick = useCallback(async () => {
    if(!isLogin) {
      const body = {
        userName,
        password,
        displayName,
      };
      await axios.post(ENDPOINT, body).then((res) => {
        if(res.status === 201) {
          const {_id} = res.data;
          console.log('register success!');
          sessionStorage.setItem("_id", _id);
          history.push('/home');
          history.go(0);
        }
      });
    } else {
      const body = {
        userName,
        password,
      };
      await axios.get(ENDPOINT, body).then((res) => {
        if(res.status === 200) {
          const {_id} = res.data;
          console.log('login success!');
          sessionStorage.setItem("_id", _id);
          history.push('/home');
          history.go(0);
        }
      })
    }
  },[isLogin,userName,password,displayName,history])

  let authMode = "Login";
  let modeChange = "Not register yet?";
  let authInput = (
    <>
      <div className="main-label">Username</div>
      <input
        className="main-input"
        required
        maxLength="20"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        value={userName}
        placeholder="input your username"
      />
      <div className="main-label">Password</div>
      <input
        type="password"
        className="main-input"
        required
        maxLength="30"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        value={password}
        placeholder="input your password"
      />
    </>
  );
  if (!isLogin) {
    authMode = "Register";
    modeChange = "Already have an account?";
    authInput = (
      <>
        <div className="main-label">Display name</div>
        <input
          className="main-input"
          required
          maxLength="30"
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
          value={displayName}
          placeholder="input your display name"
        />
        <div className="main-label">Username</div>
        <input
          className="main-input"
          required
          maxLength="20"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          value={userName}
          placeholder="input your username"
        />
        <div className="main-label">Password</div>
        <input
          type="password"
          className="main-input"
          required
          maxLength="30"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          placeholder="input your password"
        />
        <div className="main-label">Confirm Password</div>
        <input
          type="password"
          className="main-input"
          required
          maxLength="30"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          value={confirmPassword}
          placeholder="confirm your password"
        />
      </>
    );
  }
  return (
    <div className="bg">
      <div className="main-box">
        <div className="main-area">
          <div className="main-header">SECURE BLOG</div>
          <div className="main-auth-label">{authMode}</div>
          {authInput}
          <div className="main-btn-area">
            <p
              className="main-change-auth"
              onClick={() => setIsLogin(!isLogin)}
            >
              {modeChange}
            </p>
            <button className="main-btn" onClick={onClick}>{authMode}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Auth = React.memo(AuthComponent);
