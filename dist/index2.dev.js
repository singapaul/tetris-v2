"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector(".grid"); // this makes an array from all the divs in the grid.

  var squares = Array.from(document.querySelectorAll(".grid div"));
  var scoreDisplay = document.querySelector("#score");
  var startButton = document.querySelector("#start-button");
  var leftButton = document.querySelector("#leftButton");
  var rightButton = document.querySelector("#rightButton");
  var upButton = document.querySelector("#upButton");
  var downButton = document.querySelector("#downButton");
  var dropButton = document.querySelector("#dropButton");
  var miscButton = document.querySelector("#miscButton");
  var timerID;
  var width = 10;
  var nextRandom = 0;
  var score = 0;
  var colors = ["orange", "red", "purple", "green", "blue"]; //The Tetrominoes

  var lTetromino = [[1, width + 1, width * 2 + 1, 2], [width, width + 1, width + 2, width * 2 + 2], [1, width + 1, width * 2 + 1, width * 2], [width, width * 2, width * 2 + 1, width * 2 + 2]];
  var zTetromino = [[0, width, width + 1, width * 2 + 1], [width + 1, width + 2, width * 2, width * 2 + 1], [0, width, width + 1, width * 2 + 1], [width + 1, width + 2, width * 2, width * 2 + 1]];
  var tTetromino = [[1, width, width + 1, width + 2], [1, width + 1, width + 2, width * 2 + 1], [width, width + 1, width + 2, width * 2 + 1], [1, width, width + 1, width * 2 + 1]];
  var oTetromino = [[0, 1, width, width + 1], [0, 1, width, width + 1], [0, 1, width, width + 1], [0, 1, width, width + 1]];
  var iTetromino = [[1, width + 1, width * 2 + 1, width * 3 + 1], [width, width + 1, width + 2, width + 3], [1, width + 1, width * 2 + 1, width * 3 + 1], [width, width + 1, width + 2, width + 3]];
  var theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]; // starting point

  var currentPosistion = 4; // start at first rotation of any tetromino chosen//develop this later with random

  var currentRotation = 0; // random shape

  var random = Math.floor(Math.random() * theTetrominos.length);
  var current = theTetrominos[random][currentRotation];
  console.log(current); // draw the shape as it currently is

  var draw = function draw() {
    current.forEach(function (index) {
      squares[currentPosistion + index].classList.add("tetromino");
      squares[currentPosistion + index].style.backgroundColor = colors[random];
    });
  }; // undraw the tetromino


  var undraw = function undraw() {
    current.forEach(function (index) {
      squares[currentPosistion + index].classList.remove("tetromino");
      squares[currentPosistion + index].style.backgroundColor = "";
    });
  }; // make pieces move down the grid
  // set interval allows us to invoke a function at a set interval in miliseconds
  // we assign it to a timer ID so that we can stop the set inerval in the future
  // we define the moveDown function below


  var moveDown = function moveDown() {
    undraw();
    currentPosistion += width;
    draw();
    freeze();
  }; // assignign functions to keyCodes


  var control = function control(e) {
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

  document.addEventListener("keyup", control); // Button controls

  upButton.addEventListener("click", rotate);
  downButton.addEventListener("click", moveDown); // Writing the freeze function
  // the some() operator applies logic to some of the operators in outr array
  // This statement says that if the current piece considering its current posistion is adjacenet to another piece that has the class taken then that piece itself will get the class taken applied to it. Then we start a new piece falling

  var freeze = function freeze() {
    if (current.some(function (index) {
      return squares[currentPosistion + index + width].classList.contains("taken");
    })) {
      current.forEach(function (index) {
        return squares[currentPosistion + index].classList.add("taken");
      }); // start a new tetromino falling
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
  }; // move left funtion
  // some looks at all of the elements in a given array, if one is true, they are all true


  var moveLeft = function moveLeft() {
    undraw(); // returns boolean - checks if one of the pieces of the tetromino square is in the first column of the grid

    var isAtLeftEdge = current.some(function (index) {
      return (currentPosistion + index) % width === 0;
    }); //if its not at the left edge then it can move one width left

    if (!isAtLeftEdge) {
      currentPosistion -= 1;
    } // also want to stop piece moving if there is already another piece there


    if (current.some(function (index) {
      return squares[currentPosistion + index].classList.contains("taken");
    })) {
      currentPosistion += 1;
    } // Then finally we draw the tetromino


    draw();
  }; // writing out the move right function


  var moveRight = function moveRight() {
    undraw(); // returns boolean - checks if one of the pieces of the tetromino square is in the first column of the grid

    var isAtRightEdge = current.some(function (index) {
      return (currentPosistion + index) % width === width - 1;
    }); //if its not at the left edge then it can move one width left

    if (!isAtRightEdge) {
      currentPosistion += 1;
    } // also want to stop piece moving if there is already another piece there


    if (current.some(function (index) {
      return squares[currentPosistion + index].classList.contains("taken");
    })) {
      currentPosistion -= 1;
    } // Then finally we draw the tetromino


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
  } // display the next tetromino coming up


  var displaySquares = document.querySelectorAll(".mini-grid div");
  var displayWidth = 4;
  var displayIndex = 0; // The tetraminos

  var upNextTetraminoes = [[1, displayWidth + 1, displayWidth * 2 + 1, 2], [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], [1, displayWidth, displayWidth + 1, displayWidth + 2], [0, 1, displayWidth, displayWidth + 1], [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]]; // display the new shape

  var displayShape = function displayShape() {
    // remove trace of old tetramino
    displaySquares.forEach(function (square) {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetraminoes[nextRandom].forEach(function (index) {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }; // add functionality to the start button


  startButton.addEventListener("click", function () {
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

  var addScore = function addScore() {
    for (var i = 0; i < 199; i += width) {
      var row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

      if (row.every(function (index) {
        return squares[index].classList.contains("taken");
      })) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(function (index) {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        var squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(function (cell) {
          return grid.appendChild(cell);
        });
      }
    }
  };

  var gameOver = function gameOver() {
    if (current.some(function (index) {
      return squares[currentPosistion + index].classList.contains("taken");
    })) {
      scoreDisplay.innerHTML = "game over";
      clearInterval(timerID);
    }
  };
});