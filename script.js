import CardsHints from "./hints.js";

const CARDS_KEYS = Object.keys(CardsHints);

localStorage.getItem("score") === null && localStorage.setItem("score", JSON.stringify([]));

document.getElementById("score").innerText = "Cards guessed :  " + JSON.parse(localStorage.getItem("score")).length;

let HintHeader = null;
let AnswerHeader = null;
let SelectedCard = null;
let Hint = "";
let Lang = "en";

const changeLanguage = (btn_element) => {
  if (Lang === "en") {
    Lang = "ar";
    btn_element.innerText = "English";
  } else {
    Lang = "en";
    btn_element.innerText = "Arabic";
  }
  console.log(Lang);
};

const pickRandomCardHint = () => {
  // UnSelect previous card
  if (SelectedCard) {
    SelectedCard.className = "";
  }
  AnswerHeader.innerText = "";
  SelectedCard = null;

  const RandomKey = Math.floor(Math.random() * CARDS_KEYS.length);
  Hint = CardsHints[CARDS_KEYS[RandomKey]][Lang];
  // display hint to user
  Hint = CardsHints["2_clubs"].en; // for testing only and to be deleted
  HintHeader.innerText = "Hint: " + Hint;
};

const cardSelected = (card) => {
  window.scrollTo({ top: 0, behavior: "smooth" });

  // do nothing if user clicks again on the card
  if (SelectedCard && SelectedCard === card) {
    return;
  }

  if (CardsHints[card.id][Lang] === Hint) {
    const PreviousGuessedCards = JSON.parse(localStorage.getItem("score"));

    // check if the same card was previously correctly guessed, in this case, we shouldn't increment the score
    // otherwise (new correct card) we should update the score in the local storage
    if (!PreviousGuessedCards.includes(card.id)) {
      PreviousGuessedCards.push(card.id);
      localStorage.setItem("score", JSON.stringify(PreviousGuessedCards));
      document.getElementById("score").innerText =
        "Cards guessed : " + PreviousGuessedCards.length;
    }
    card.className = "right-card";
    AnswerHeader.className = "right-answer";
    AnswerHeader.innerText = "Correct Card !";
  } else {
    card.className = "wrong-card";
    AnswerHeader.className = "wrong-answer";
    AnswerHeader.innerText = "Wrong Card !";
  }
  // remove selection style from the previous selected card if any
  if (SelectedCard) {
    SelectedCard.className = "";
  }
  SelectedCard = card;
};

// listen for cards selection
const cardSelectionListen = () => {
  const Cards = document.getElementsByTagName("img");
  Array.from(Cards).forEach((card) => {
    card.addEventListener("click", (e) => cardSelected(e.target));
    card.setAttribute("draggable", false);
  });
};

const Game = () => {
  HintHeader = document.getElementById("hint");
  AnswerHeader = document.getElementById("answer");

  pickRandomCardHint();
  cardSelectionListen();

  const LangBtn = document.getElementById("change-lang-btn");
  const ChangeCardBtn = document.getElementById("change-card-btn");

  LangBtn.addEventListener("click", (e) => changeLanguage(e.target));
  ChangeCardBtn.addEventListener("click", pickRandomCardHint);
};

document.addEventListener("DOMContentLoaded", Game);
