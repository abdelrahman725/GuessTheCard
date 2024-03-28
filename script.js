import { CardsHints, SuitsLang } from "./data.js";

if (localStorage.getItem("score") === null) {
  localStorage.setItem("score", JSON.stringify([]));
}

const testGameCompleteAndReset = () => {
  const array = [];
  for (let index = 0; index < AllCards.length - 1; index++) {
    array.push(AllCards[index]);
  }
  localStorage.setItem("score", JSON.stringify(array));
};

const AllCards = Object.keys(CardsHints);
const N_TotalCards = 54;

let HintHeader = null;
let AnswerHeader = null;
let SelectedCard = null;
let ScoreSpan = null;
let Hint = null;
let Lang = "en";

const changeLanguage = (btn_element) => {
  return;
  if (Lang === "en") {
    Lang = "ar";
    btn_element.innerText = "English";
  } else {
    Lang = "en";
    btn_element.innerText = "Arabic";
  }

  // show the same card hint with current lang
  displayHint();

  const Suits = document.querySelector(".suits-names").children;
  Array.from(Suits).forEach((suit) => {
    suit.children[1].textContent = SuitsLang[suit.className][Lang];
  });
};

const resetGame = () => {
  localStorage.setItem("score", JSON.stringify([]));
  ScoreSpan.innerText = 0;
  document.getElementById("change-card-btn").style.display = "inline-block";
  document.getElementById("reset-game-btn").style.display = "none";
  pickHint();
};

const allCardsGussed = () => {
  document.getElementById("reset-game-btn").style.display = "inline-block";
  document.getElementById("change-card-btn").style.display = "none";
  AnswerHeader.className = "right-answer";
  AnswerHeader.innerText = `Congratulations you have guessed all ${N_TotalCards} cards !`;
  Hint = null;
};

const displayHint = () => {
  HintHeader.innerHTML = "<strong>Hint:</strong> " + Hint[Lang];
};

// pick random hint for another/same un-guessed card
const pickHint = () => {
  if (SelectedCard) {
    SelectedCard.className = "";
  }
  AnswerHeader.innerText = "";
  SelectedCard = null; // UnSelect previous card
  Hint = null;
  HintHeader.innerHTML = "----";

  const GuessedCards = JSON.parse(localStorage.getItem("score"));
  const NotGuessedCards = AllCards.filter(
    (card) => !GuessedCards.includes(card)
  );

  const RandomIndex = Math.floor(Math.random() * NotGuessedCards.length);
  Hint = CardsHints[NotGuessedCards[RandomIndex]];
  setTimeout(displayHint, 250);
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
    if (GuessedCards.length === N_TotalCards) {
      allCardsGussed();
    } else {
      AnswerHeader.innerText = "Correct Card !";
    }
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
  const N_GuessedCards = JSON.parse(localStorage.getItem("score")).length;
  const NextCardBtn = document.getElementById("change-card-btn");
  const ResetGameBtn = document.getElementById("reset-game-btn");

  AnswerHeader = document.getElementById("answer");
  HintHeader = document.getElementById("hint");

  if (N_GuessedCards === N_TotalCards) {
    allCardsGussed();
  } else {
    pickHint();
    NextCardBtn.style.display = "inline-block";
  }

  cardSelectionListen();
  NextCardBtn.addEventListener("click", pickHint);
  ResetGameBtn.addEventListener("click", resetGame);

  ScoreSpan = document.getElementById("score");
  // set initial score which is the number of previous correctly guessed cards stored in localstorage
  ScoreSpan.innerText = N_GuessedCards;

  // change language to arabic or vice versa
  document
    .getElementById("change-lang-btn")
    .addEventListener("click", (e) => changeLanguage(e.target));
};

document.addEventListener("DOMContentLoaded", Game);
