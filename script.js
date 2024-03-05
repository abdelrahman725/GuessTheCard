import CardsHints from "./hints.js";

localStorage.getItem("score") === null &&
  localStorage.setItem("score", JSON.stringify([]));

let HintHeader = null;
let AnswerHeader = null;
let SelectedCard = null;
let Hint = null;
let Lang = "en";

const changeLanguage = (btn_element) => {
  if (Lang === "en") {
    Lang = "ar";
    btn_element.innerText = "English";
  } else {
    Lang = "en";
    btn_element.innerText = "Arabic";
  }
  // show the same card hint with the new lang
  displayHint();
};

const displayHint = () => {
  Hint = CardsHints["5_clubs"]; // for testing only and to be deleted
  HintHeader.innerText = "Hint: " + Hint[Lang];
};

const pickRandomCardHint = () => {
  const AllCards = Object.keys(CardsHints);
  const GuessedCards = JSON.parse(localStorage.getItem("score"));
  const NotGuessedCards = AllCards.filter(
    (card) => !GuessedCards.includes(card)
  );

  const RandomIndex = Math.floor(Math.random() * NotGuessedCards.length);
  Hint = CardsHints[NotGuessedCards[RandomIndex]];
  displayHint();
};

const changeHint = () => {
  // UnSelect previous card
  if (SelectedCard) {
    SelectedCard.className = "";
  }
  AnswerHeader.innerText = "";
  SelectedCard = null;
  Hint = null;
  HintHeader.innerText = "Hint: " + "...";
  setTimeout(pickRandomCardHint, 500);
};

const cardSelected = (card) => {
  if (Hint === null) return;

  // do nothing if user clicks again on the same card
  if (SelectedCard && SelectedCard === card) {
    return;
  }

  if (CardsHints[card.id][Lang] === Hint[Lang]) {
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
  ChangeCardBtn.addEventListener("click", changeHint);
};

document.addEventListener("DOMContentLoaded", Game);
