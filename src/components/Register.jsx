import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onSignUp(email, password);
  }

  if (props.loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <form
      className="auth__form"
      onSubmit={handleSubmit}
      noValidate
      name="register"
    >
      <h2 className="auth__title">Регистрация</h2>

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

      <div className="auth__sign-in">
        <Link to="/sign-in" className="auth__link">
          Уже зарегистрированы? Войти
        </Link>
      </div>
    </form>
  );
}
export default Register;
