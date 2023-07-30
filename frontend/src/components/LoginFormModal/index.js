import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  // This checks the length of the username and password inputs if they are
  // greater than or equal to the required length
  const MIN_USERNAME_LENGTH = 4;
  const MIN_PASSWORD_LENGTH = 6;

  const validCredential = credential.length >= MIN_USERNAME_LENGTH;
  const validPassword = password.length >= MIN_PASSWORD_LENGTH;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else {
          setErrors(["The provided credentials are invalid"]);
        }
      });
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(
      sessionActions.login({
        credential: "Demo-lition",
        password: "password",
      })
    ).then(closeModal);
  };

  return (
    <div className="login-modal">
      <h1 id="login-text">Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label id="username-email">
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
            style={{
              width: "90%",
            }}
          />
        </label>
        <label id="password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            style={{
              width: "90%",
            }}
          />
        </label>
        <div id="div-login-submit">
          <button
            type="submit"
            id="login-submit"
            style={{
              width: "92%",
              backgroundColor: "white",
              border: "2px solid grey",
              color: "grey",
              boxShadow: "5px 9px 17px 4px grey",
            }}
            disabled={!validCredential || !validPassword}
          >
            Log In
          </button>
        </div>
        <div className="demo-login">
          <a href="#" onClick={handleDemoLogin}>
            Demo User
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
