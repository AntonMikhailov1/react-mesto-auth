import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
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
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import CurrentUserContext from "../contexts/CurrentUserContext.jsx";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, seIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({});

  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getProfileInfo(), api.getInitialCards()])
      .then(([userData, cardData]) => {
        setCurrentUser(userData);
        setCards(cardData);
      })
      .catch((err) => console.error(err));
  }, []);

  // Registration
  function handleUserSignUp(email, password) {
    api
      .signUpUser(email, password)
      .then((data) => {
        if (data) {
          setIsSignUpSuccess(true);
          navigate("/sing-in");
        }
      })
      .catch((err) => {
        setIsSignUpSuccess(false);
        console.log(err);
      })
      .finally(() => setIsInfoTooltipOpen(true));
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
          navigate("/");
        }
      })
      .catch((err) => {
        setIsSignUpSuccess(false);
        setIsInfoTooltipOpen(true);
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
            setLoggedIn(true);
            setUserEmail(data.data.email);
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  function handleUserSingOut() {
    localStorage.removeItem("jwt");
    setUserEmail("");
    setLoggedIn(false);
    navigate("/sign-in");
  }

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

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    seIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
  }

  function handleUpdateUser(userData) {
    api
      .setProfileInfo(userData)
      .then((currentUserState) => {
        setCurrentUser(currentUserState);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleUpdateAvatar(userData) {
    api
      .setAvatar(userData)
      .then((currentUserState) => {
        setCurrentUser(currentUserState);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleAddPlace(cardData) {
    api
      .addCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        <Header onSignOut={handleUserSingOut} userEmail={userEmail} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
                loggedIn={loggedIn}
              />
            }
          />

          <Route
            path="/sign-up"
            element={<Register onSignUp={handleUserSignUp} />}
          />

          <Route
            path="/sign-in"
            element={<Login onSignIn={handleUserSigIn} />}
          />
        </Routes>

        <Main />

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />

        <ImagePopup
          selectedCard={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccess={isSignUpSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
