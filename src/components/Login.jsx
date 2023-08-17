import React, { useState } from "react";
import { Redirect } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onSignIn(email, password);
  }

  if (props.loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <form className="auth__form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth__title">Вход</h2>
      <input
        className="auth__field"
        type="email"
        name="email"
        value={email}
        placeholder="Email"
        required=""
        onChange={handleEmailChange}
      />

      <input
        className="auth__field"
        name="password"
        type="password"
        value={password}
        placeholder="Пароль"
        required=""
        onChange={handlePasswordChange}
      />

      <button className="auth__submit-btn" type="submit">
        Войти
      </button>
    </form>
  );
}
export default Login;
