const tableBingo = document.getElementById("bingoTable");
const tableCards = document.getElementById("bingoCardSection");
let i = 0;
//this is the array of all player cards
const arrayCards = [];

//This is the Object Player Card
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

//function to generate a random numbers between max and min
const generateNumber = (max, min) => {
  return Math.floor(Math.random() * max + min);
};

//Instead of extracting one number at the time, create the sequence of extracted numbers in advance which I'll then read at intervals. I'll store the random numbers extracted in an array.
const generateTableRandom = () => {
  let arrayNumbers = [];
  let number;

  //I need to randomize numbers from 1 to 76 and include them in a array without repeting the same number.

  //I say 'util the array reaches a length of 76 generate an unique number
  while (arrayNumbers.length < 76) {
    do {
      number = generateNumber(76, 1);
    } while (
      //I use while to make the number unique. I'm saying while the number generated is already in the array, keep generating a new number. The loop ends when the number generated is unique and therefore non included in the array yet.
      arrayNumbers.includes(number)
    );
    arrayNumbers.push(number);
  }

  return arrayNumbers;
};

// BINGO BOARD
//This generates the Bingo Board with numbers from 1 to 76
const generateBoard = () => {
  for (let i = 1; i <= 76; i++) {
    let div = document.createElement("div");
    //I give each number a class with the number so that I can easily include the class "selected" later on
    div.classList.add(i);
    div.innerHTML = `<h3>${i}</h3>`;
    tableBingo.appendChild(div);
  }
};

// PLAYER CARD(S)
//the generateCard function is called when I load the browser and then if I want to add extra cards,every time I create a new card with the + button.
const generateCard = () => {
  //I generate a new instance of Card Player
  let newCard = new Card();
  //I call the method of Card Player to generate 24 random numbers to be inserted in the card
  newCard.generateCardRandom();
  //I create the HTML of the card and I inserted in the page. Look at the function createCardTable
  createCardTable(newCard);
  arrayCards.push(newCard);
};

//This function receive as parameter the new card created and in prints the HTML in the page
const createCardTable = (newCard) => {
  let div = document.createElement("div");
  div.classList.add("bingoCards__card");
  let div2 = document.createElement("div");
  div2.classList.add("bingoCards__card-numbers");
  div.appendChild(div2);

  //for each random number which compose the player card, I print the number in the html of the card
  newCard.numbersInCard.forEach((number) => {
    let h3 = document.createElement("h3");
    h3.classList.add(number);
    h3.innerHTML = `${number}`;
    div2.appendChild(h3);
  });
  //I append the card to the HTML section where I keep all player cards
  tableCards.appendChild(div);
};

//This function is called when one of the card does Bingo and ends the game but clearing the timer.
const stopGame = () => {
  clearInterval(gameInterval);
};

window.onload = () => {
  //when the window loads, generate the table, player card and extract 76 numbers to be called in random order.
  generateBoard();
  generateCard();
  //this is a container of 76 numbers put in random order which will be programmatically called one at the time
  let mainTable = generateTableRandom();
  console.log(mainTable);

  //Every 5 seconds
  const gameInterval = setInterval(
    () => {
      ///I want to make sure that I don't run this interval more than 76 times which is the max amount of times I can extract an unique number. I use a variable i as incrementor so that I can check how many times I repet the interval. I add +1 to i every time I run this interval.
      //i is also the variable I'll use as index of my random generated 76 numbers to call them at each inteval. The number I call every time is indeed mainTable[i] where mainTable is the array with 76 unique numbers in random positions.

      if (i < mainTable.length) {
        //GIVE SELECTED CLASS TO SELECTED NUMBER
        //I add 'selected' class to the extracted numnber which is mainTable[i]. How do I do it? I gave to each number a class with that number (ex. <h3 class="1">1</h3>). So I check all items that have a class == to the number I'm calling.
        let h3s = document.getElementsByClassName(`${mainTable[i]}`);
        //for each h3 which has the class of the called number, I give a class selected
        for (let i = 0; i < h3s.length; i++) {
          h3s[i].classList.add("selected");
        }

        //DISPLAY SELECTED NUMBER
        //I generate a span which displays at each interval the numnber which has been called
        let span = document.createElement("span");
        span.classList.add("game__number-ball");
        span.innerText = mainTable[i];
        const numberExtracted = document.querySelector(".game__numbers");
        //I clean the parent node from the previous displayed number
        while (numberExtracted.firstChild) {
          numberExtracted.removeChild(numberExtracted.firstChild);
        }
        //I append the span to the now empty parent node
        numberExtracted.appendChild(span);

        //CHECK THE PLAYER CARD TO SEE IF ANY CARD DID BINGO
        //Since I might have more than one card, all cards are stored in an array. That's why I need to loop through the array to verify if any of the card has scored 24(which is the score to win BINGO)
        arrayCards.forEach((card) => {
          //if the card has the number selected, this card will score +1
          if (card.numbersInCard.includes(mainTable[i])) {
            card.score += 1;
            //I check then if the card reached the score of 24 and in that's the case, I stop the game
            if (card.score >= 24) {
              console.log(`card ${arrayCards.indexOf(card)} wins`);
              stopGame();
            }
          }
        });
        //this is the incrementor I use to make sure I don't run the interval more than 76 times as we have 76 numbers
        i += 1;
      }
      //that's just a safety way to make sure the game and if I run the interval more than 76 times. This should not happend, so it's just a way to double make sure about it.
      else {
        console.log("game over");
        stopGame();
      }
    },
    //5000 means 5 seconds.
    5000
  );
};
