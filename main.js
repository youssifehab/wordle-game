//Game Name
const gameName = "Wordle";

document.title = gameName;

document.querySelector("h1").innerText = gameName;
document.querySelector("footer").innerText = `${gameName} Created By Joe`;

//Game Options
let numberOfTries = 5;
let numberOfLetters = 5;
let currentTry = 1;
let numberOfHints = 2;

//Manage Words
let wordToGuess = "";
let words = ["Beach", "Alert", "About", "Curve", "Daily", "Chart", "Brief"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

//Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", handleHintButton);

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");

  //Create Try Div
  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) {
      tryDiv.classList.add("disable-inputs");
    }

    //Create Inputs
    for (let j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();

  //Disable All Inputs Except First
  const inputsInDisableDiv = document.querySelectorAll(".disable-inputs input");
  inputsInDisableDiv.forEach((input) => {
    input.disabled = true;
  });

  //Navigation For Inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    //Convert Input To UpperCase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    });

    input.addEventListener("keydown", function (event) {
      const currentInput = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentInput + 1;
        if (nextInput < inputs.length) {
          inputs[nextInput].focus();
        }
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentInput - 1;
        if (prevInput >= 0) {
          inputs[prevInput].focus();
        }
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);
function handleGuesses() {
  let successGuess = true;

  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];
    if (letter === actualLetter) {
      inputField.classList.add("in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("wrong");
      successGuess = false;
    }
  }
  //check if user winn or lose
  if (successGuess) {
    messageArea.innerHTML = `You win the word is <span>${wordToGuess}</span>`;

    //Add Disable Class To All Inputs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => {
      tryDiv.classList.add("disable-inputs");
    });
    //Disable Check Button
    guessButton.disabled = true;
    hintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disable-inputs");

    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => {
      input.disabled = true;
    });
    if (currentTry < numberOfTries) {
      currentTry += 1;

      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disable-inputs");
      const nextTryInputs = document.querySelectorAll(
        `.try-${currentTry} input`
      );
      nextTryInputs.forEach((input) => {
        input.disabled = false;
      });
      document.querySelector(`#guess-${currentTry}-letter-1`).focus();
    } else {
      guessButton.disabled = true;
      hintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}

//Handle hint button
function handleHintButton() {
  if (numberOfHints > 0) {
    numberOfHints -= 1;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    hintButton.disabled = true;
  }

  const enableInputs = document.querySelectorAll("input:not([disabled])");

  const emptyEnabledInputs = Array.from(enableInputs).filter(
    (input) => input.value === ""
  );
  if (emptyEnabledInputs.length > 0) {
    let randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    let randomInput = emptyEnabledInputs[randomIndex];
    let indexToFill = Array.from(enableInputs).indexOf(randomInput);

    randomInput.value = wordToGuess[indexToFill].toUpperCase();
  }
}

document.addEventListener("keydown", handleBackSpace);

function handleBackSpace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];

      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

window.onload = function () {
  generateInput();
};
