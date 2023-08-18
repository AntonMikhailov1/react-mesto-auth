import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register(props) {
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
    props.onSignUp({ email, password });
  }

  return (
    <form
      className="auth__form"
      onSubmit={handleSubmit}
      noValidate=""
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
        autoComplete="off"
      />

      <input
        className="auth__field"
        name="password"
        type="password"
        value={password}
        placeholder="Пароль"
        required=""
        onChange={handlePasswordChange}
        autoComplete="off"
      />

      <button className="auth__submit-btn" type="submit">
        Зарегистрироваться
      </button>

      <Link to="/sign-in" className="auth__link">
        Уже зарегистрированы? Войти
      </Link>
    </form>
  );
}
export default Register;
