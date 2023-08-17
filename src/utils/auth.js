class Auth {
    #baseUrl

    constructor(baseUrl) {
      this.#baseUrl = baseUrl;
    }
    
    #checkError(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    }

    userSignUp(email, password) {
      return fetch(`${this.#baseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => this.#checkError(res));
    }
  
    userSignIn(email, password) {
      return fetch(`${this.#baseUrl}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => this.#checkError(res));
    }
  
    checkToken(token) {
      return fetch(`${this.#baseUrl}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => this.#checkError(res));
    }
  }

  const auth = new Auth("https://auth.nomoreparties.co");
  
  export default auth;