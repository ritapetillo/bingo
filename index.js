const tableBingo = document.getElementById("bingoTable");
const tableCards = document.getElementById("bingoCardSection");
let i = 0;

const arrayCards = [];

const generateNumber = (max, min) => {
  return Math.floor(Math.random() * max + min);
};

const generateTableRandom = () => {
  let arrayNumbers = [];
  while (arrayNumbers.length < 76) {
    let number = generateNumber(75, 1);
    if (arrayNumbers.includes(number)) {
      let number = generateNumber(76, 1);
      arrayNumbers.push(number);
    } else {
      arrayNumbers.push(number);
    }
  }
  return arrayNumbers;
};

function Card() {
  this.score = 0;
  this.numbersInCard = [];

  this.generateCardRandom = () => {
    let number;
    for (let i = 0; i < 24; i++) {
      do {
        number = generateNumber(76, 1);
      } while (this.numbersInCard.includes(number));
      this.numbersInCard.push(number);
    }
  };
}

const generateBoard = () => {
  for (let i = 1; i <= 76; i++) {
    let div = document.createElement("div");
    div.classList.add(i);
    div.innerHTML = `<h3>${i}</h3>`;
    tableBingo.appendChild(div);
  }
};

const generateCard = () => {
  let newCard = new Card();
  newCard.generateCardRandom();
  console.log(newCard.numbersInCard);
  createCardTable(newCard);
  arrayCards.push(newCard);
};

const createCardTable = (numbers) => {
  let div = document.createElement("div");

  div.classList.add("bingoCards__card");
  let div2 = document.createElement("div");
  div2.classList.add("bingoCards__card-numbers");
  div.appendChild(div2);
  numbers.numbersInCard.forEach((number) => {
    let h3 = document.createElement("h3");
    h3.classList.add(number);
    h3.innerHTML = `${number}`;
    div2.appendChild(h3);
  });
  tableCards.appendChild(div);
};

const stopGame = () => {
  clearInterval(gameInterval);
};

window.onload = () => {
  generateBoard();
  generateCard();

  let mainTable = generateTableRandom();
  console.log(mainTable);

  const gameInterval = setInterval(() => {
    if (i < mainTable.length) {
      let h3s = document.getElementsByClassName(`${mainTable[i]}`);
      console.log(h3s);
      for (let i = 0; i < h3s.length; i++) {
        h3s[i].classList.add("selected");
      }

      let span = document.createElement("span");
      span.classList.add("game__number-ball");
      span.innerText = mainTable[i];

      const numberExtracted = document.querySelector(".game__numbers");
      while (numberExtracted.firstChild) {
        numberExtracted.removeChild(numberExtracted.firstChild);
      }
      numberExtracted.appendChild(span);

      arrayCards.forEach((card) => {
        if (card.numbersInCard.includes(mainTable[i])) {
          console.log(`card ${arrayCards.indexOf(card)} has the number`);
          card.score += 1;
          console.log(card.score);
          if (card.score >= 24) {
            console.log(`card ${arrayCards.indexOf(card)} wins`);
            stopGame();
          }
        }
      });

      i += 1;
    } else {
      console.log("game over");
      stopGame();
    }
  }, 5000);
};
