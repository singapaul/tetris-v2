document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  // this makes an array from all the divs in the grid.
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startButton = document.querySelector("#start-button");
  const leftButton = document.querySelector("#leftButton");
  const rightButton = document.querySelector("#rightButton");
  const upButton = document.querySelector("#upButton");
  const downButton = document.querySelector("#downButton");
  const dropButton = document.querySelector("#dropButton");
  const miscButton = document.querySelector("#miscButton");

  let timerID;
  const width = 10;
  let nextRandom = 0;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];

  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominos = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  // starting point
  let currentPosistion = 4;
  // start at first rotation of any tetromino chosen//develop this later with random
  let currentRotation = 0;
  // random shape
  let random = Math.floor(Math.random() * theTetrominos.length);
  let current = theTetrominos[random][currentRotation];
  console.log(current);

  // draw the shape as it currently is
  const draw = () => {
    current.forEach((index) => {
      squares[currentPosistion + index].classList.add("tetromino");
      squares[currentPosistion + index].style.backgroundColor = colors[random];
    });
  };

  // undraw the tetromino
  const undraw = () => {
    current.forEach((index) => {
      squares[currentPosistion + index].classList.remove("tetromino");
      squares[currentPosistion + index].style.backgroundColor = "";
    });
  };

  // make pieces move down the grid
  // set interval allows us to invoke a function at a set interval in miliseconds
  // we assign it to a timer ID so that we can stop the set inerval in the future
  // we define the moveDown function below
  const moveDown = () => {
    undraw();
    currentPosistion += width;
    draw();
    freeze();
  };

  // assignign functions to keyCodes

  const control = (e) => {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    } else if (e.keyCode === 32) {
      dropDown();
    } else {
      console.log("inactive key");
    }
  };
  document.addEventListener("keyup", control);

  // Button controls

  upButton.addEventListener("click", rotate);
  downButton.addEventListener("click", moveDown);

  // Writing the freeze function
  // the some() operator applies logic to some of the operators in outr array
  // This statement says that if the current piece considering its current posistion is adjacenet to another piece that has the class taken then that piece itself will get the class taken applied to it. Then we start a new piece falling
  const freeze = () => {
    if (
      current.some((index) =>
        squares[currentPosistion + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosistion + index].classList.add("taken")
      );
      // start a new tetromino falling
      // can refactor this later
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominos.length);
      current = theTetrominos[random][currentRotation];
      currentPosistion = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  };

  // move left funtion
  // some looks at all of the elements in a given array, if one is true, they are all true
  const moveLeft = () => {
    undraw();
    // returns boolean - checks if one of the pieces of the tetromino square is in the first column of the grid
    const isAtLeftEdge = current.some(
      (index) => (currentPosistion + index) % width === 0
    );
    //if its not at the left edge then it can move one width left
    if (!isAtLeftEdge) {
      currentPosistion -= 1;
    }
    // also want to stop piece moving if there is already another piece there
    if (
      current.some((index) =>
        squares[currentPosistion + index].classList.contains("taken")
      )
    ) {
      currentPosistion += 1;
    }
    // Then finally we draw the tetromino
    draw();
  };

  // writing out the move right function
  const moveRight = () => {
    undraw();
    // returns boolean - checks if one of the pieces of the tetromino square is in the first column of the grid
    const isAtRightEdge = current.some(
      (index) => (currentPosistion + index) % width === width - 1
    );
    //if its not at the left edge then it can move one width left
    if (!isAtRightEdge) {
      currentPosistion += 1;
    }
    // also want to stop piece moving if there is already another piece there
    if (
      current.some((index) =>
        squares[currentPosistion + index].classList.contains("taken")
      )
    ) {
      currentPosistion -= 1;
    }
    // Then finally we draw the tetromino
    draw();
  };

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominos[random][currentRotation];
    draw();
  }

  // display the next tetromino coming up
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  // The tetraminos
  const upNextTetraminoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  // display the new shape

  const displayShape = () => {
    // remove trace of old tetramino
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });

    upNextTetraminoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  };

  // add functionality to the start button
  startButton.addEventListener("click", () => {
    if (timerID) {
      clearInterval(timerID);
      timerID = null;
    } else {
      draw();
      timerID = setInterval(moveDown, 300);
      nextRandom = Math.floor(Math.random() * theTetrominos.length);
      displayShape();
      leftButton.addEventListener("click", moveLeft);
      rightButton.addEventListener("click", moveRight);
    }
  });

  const addScore = () => {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  };

  const gameOver = () => {
    if (
      current.some((index) =>
        squares[currentPosistion + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "game over";
      clearInterval(timerID);
    }
  };
});
