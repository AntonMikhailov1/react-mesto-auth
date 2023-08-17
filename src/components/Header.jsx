import React from "react";
import { Route, Link } from "react-router-dom"
import logo from '../images/logo.svg'

export default function Header(props) {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="Лого Mesto"
      />

      <Route path="/sign-in">
        <Link to="sign-up" className="header__link">
          Регистрация
        </Link>
      </Route>

      <Route path="/sign-up">
        <Link to="sign-in" className="header__link">
          Войти
        </Link>
      </Route>

      <Route exact path="/">
        <div className="header__email-container">
          <p className="header__email-text">{props.userEmail}</p>
          <Link to="sign-in" className="header__sign-out" onClick={props.onSignOut}>
            Выйти
          </Link>
        </div>
      </Route>

    </header>
  );
}
