import CardsHints from "./hints.js";

localStorage.getItem("score") === null &&
  localStorage.setItem("score", JSON.stringify([]));

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
};

const pickRandomCardHint = () => {
  // UnSelect previous card
  if (SelectedCard) {
    SelectedCard.className = "";
  }
  AnswerHeader.innerText = "";
  SelectedCard = null;

  const AllCards = Object.keys(CardsHints);
  const GuessedCards = JSON.parse(localStorage.getItem("score"));
  const NotGuessedCards = AllCards.filter(
    (card) => !GuessedCards.includes(card)
  );

  const RandomIndex = Math.floor(Math.random() * NotGuessedCards.length);
  Hint = CardsHints[NotGuessedCards[RandomIndex]][Lang];
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
    const GuessedCards = JSON.parse(localStorage.getItem("score"));

    // check if the same card was previously guessed correctly, in this case, we shouldn't increment the score
    // otherwise (new correct card) we should update the score
    if (!GuessedCards.includes(card.id)) {
      GuessedCards.push(card.id);
      localStorage.setItem("score", JSON.stringify(GuessedCards));
      document.getElementById("score").innerText = GuessedCards.length;
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

  // set initial score which is the number of previous correctly guessed cards stored in localstorage
  const ScoreSpan = document.getElementById("score");
  ScoreSpan.innerText = JSON.parse(localStorage.getItem("score")).length;

  const LangBtn = document.getElementById("change-lang-btn");
  const ChangeCardBtn = document.getElementById("change-card-btn");

  LangBtn.addEventListener("click", (e) => changeLanguage(e.target));
  ChangeCardBtn.addEventListener("click", pickRandomCardHint);
};

document.addEventListener("DOMContentLoaded", Game);
