import React, { useCallback, useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router";
import "./style.scss";

const ENDPOINT = process.env.REACT_APP_BACKEND

const AuthComponent = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showErr, setShowErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const history = useHistory();

  const onClick = useCallback(async () => {
    if(!isLogin) {
      if(password.length < 8) {
        setShowErr(true);
        setErrorMsg('Password must >= 8 characters');
      }
      else if(confirmPassword !== password) {
        setShowErr(true);
        setErrorMsg('Confirm password is incorrect');
      } else {
      const body = {
        userName,
        password,
        displayName,
      };
      await axios.post(`${ENDPOINT}/users`, body).then((res) => {
        if(res.status === 201) {
          const {hasUserName, hasDisplayName} = res.data;
          if(hasDisplayName) {
            setShowErr(true);
            setErrorMsg('This display name has alreay been taken');
          }
          else if(hasUserName) {
            setShowErr(true);
            setErrorMsg('This username has alreay been taken');
          } 
          else {
          const {_id, displayName} = res.data;
          console.log('register success!');
          sessionStorage.setItem("_id", _id);
          sessionStorage.setItem("displayName", displayName);
          history.push('/home');
          history.go(0);}
        }
      });}
    } else {
      const body = {
        username: userName,
        password,
      };
      await axios.post(`${ENDPOINT}/auth/login`, body).then((res) => {
        if(res.status===201) {
          const {_id, displayName, access_token} = res.data;
          if(_id === null) {
            setShowErr(true);
            setErrorMsg('Username or password is incorrect');
          } else {
            sessionStorage.setItem("access_token", access_token);
            sessionStorage.setItem("_id", _id);
            sessionStorage.setItem("displayName", displayName);
            history.push('/home');
            history.go(0);
          }
        }
      })
    }
  },[isLogin,userName,password,confirmPassword,displayName,history])

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
  const errorArea = <div className='error-msg'>{errorMsg}</div>;
  
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
        <div className="main-label">Password (length must &gt;= 8)</div>
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
          {showErr && errorArea}
          <div className="main-btn-area">
            <p
              className="main-change-auth"
              onClick={() => {setIsLogin(!isLogin);
              setShowErr(false);}}
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
