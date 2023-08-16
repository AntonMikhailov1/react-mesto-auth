import { useEffect, useState, useHistory } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "../index.css";
import api from "../utils/api";
import auth from "../utils/auth";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import AddPlacePopup from "./AddPlacePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext.jsx";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, seIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  // const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({});

  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTolltipSuccess, setIsInfoTolltipSuccess] = useState(false);
  const history = useHistory();
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getProfileInfo(), api.getInitialCards()])
      .then(([userData, cardData]) => {
        setCurrentUser(userData);
        setCards(cardData);
      })
      .catch((err) => console.error(err));
  }, []);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    seIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleCardDelete(card) {
    // setIsConfirmationPopupOpen(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.error(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.error(err));
  }

  function closeAllPopup() {
    setIsEditProfilePopupOpen(false);
    seIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    // setIsConfirmationPopupOpen(false);
  }

  function handleUpdateUser(userData) {
    api
      .setProfileInfo(userData)
      .then((currentUserState) => {
        setCurrentUser(currentUserState);
        closeAllPopup();
      })
      .catch((err) => console.error(err));
  }

  function handleUpdateAvatar(userData) {
    api
      .setAvatar(userData)
      .then((currentUserState) => {
        setCurrentUser(currentUserState);
        closeAllPopup();
      })
      .catch((err) => console.error(err));
  }

  function handleAddPlace(cardData) {
    api
      .addCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopup();
      })
      .catch((err) => console.error(err));
  }

  // Registration
  function handleUserSignUp(email, password) {
    api
      .signUpUser(email, password)
      .then((data) => {
        if (data) {
          setIsInfoTolltipSuccess(true);
          history.push("/sing-in");
        }
      })
      .catch((err) => {
        setIsInfoTolltipSuccess(false);
        console.log(err);
      })
      .finally(() => setIsSuccessPopupOpen(true));
  }

  // Authentication
  function handleUserSigIn(email, password) {
    api
      .signInUser(email, password)
      .then((data) => {
        if (data.token) {
          setUserEmail(email);
          setLoggedIn(true);
          localStorage.setItem("jwt", data.token);
          history.push("/");
        }
      })
      .catch((err) => {
        setIsInfoTolltipSuccess(false);
        setIsSuccessPopupOpen(true);
        console.log(err);
      });
  }

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((data) => {
          if (data) {
            setIsLoggedIn(true);
            setUserEmail(data.data.email);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [history]);

  function handleUserSingOut() {
    localStorage.removeItem("jwt");
    setUserEmail("");
    setIsLoggedIn(false);
    history.push("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        <Header onSignOut={handleSingOut} userEmail={userEmail} />

        <Switch>
          <ProtectedRoute
            path="/"
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            loggedIn={loggedIn}
          />

          <Route path="/sign-up">
            <Register onRegister={handleRegisterUser} />
          </Route>

          <Route path="/sign-in">
            <Login onLogin={handleAuthUser} />
          </Route>

          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>

        </Switch>
        <Main />

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopup}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopup}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopup}
          onAddPlace={handleAddPlace}
        />

        {/* <PopupWithForm
          name="confirmation"
          title="Вы уверены?"
          isOpen = {isConfirmationPopupOpen}
          onClose={closeAllPopup}
          children={
            <button className="popup__submit-btn" type="submit">
              Да
            </button>
          }
        /> */}

        <ImagePopup
          selectedCard={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopup}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
