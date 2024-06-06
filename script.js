const gameBoard = function GameBoard() {
  const rows = 3;
  const columns = 3;

  /* create a 2d array which will represent the state
     of the game.
     eg: [[1,2,3], [4,5,6], [7,8,9]] is equivalent to */
  /*
    1 2 3
    4 5 6
    7 8 9
  */
  function createNewBoard() {
    board = [];
    for (let i = 0; i < rows; i++) {
      board.push([]);
      for (let j = 0; j < columns; j++) {
        board[i][j] = "-";
      }
    }
  }
  createNewBoard();

  const getBoard = () => board;

  const placeMarker = (row, column, token) => {
    // condition to prevent user from selecting
    // an already-selected slot
    if (board[row][column] === "-") {
      board[row][column] = token;
    }
  };

  // PURELY FOR TESTING PURPOSES IN CONSOLE
  const printBoard = () => {
    console.log(
      board[0][0] +
        " " +
        board[0][1] +
        " " +
        board[0][2] +
        "\n" +
        board[1][0] +
        " " +
        board[1][1] +
        " " +
        board[1][2] +
        "\n" +
        board[2][0] +
        " " +
        board[2][1] +
        " " +
        board[2][2]
    );
  };

  return { board, getBoard, placeMarker, printBoard, createNewBoard };
};

const gameController = function () {
  const playerTokens = {
    player1: "X",
    player2: "O",
  };

  let currentPlayer = "player1";
  const board = gameBoard();

  const restartGame = () => {
    currentPlayer = "player1";
    board.createNewBoard();
  };

  const playRound = (row, column) => {
    if (checkForVictory !== undefined) {
      const markerToPlace = playerTokens[currentPlayer];
      board.placeMarker(row, column, markerToPlace);
      board.printBoard();
      console.log(checkForVictory());
      switchPlayerTurn();
    }
  };

  function switchPlayerTurn() {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
  }

  const allEqual = (arr) => arr.every((v) => v === arr[0]);

  // check for winning conditions
  // returns nothing (undefined) if no one has won yet
  function checkForVictory() {
    const currentBoard = board.getBoard();

    // check if any row has three consecutive symbols
    for (let i of currentBoard) {
      if (allEqual(i)) {
        if (i[0] === "X") return "Player 1 Wins";
        else if (i[0] === "O") return "Player 2 Wins";
      }
    }

    // check if any of the columns have 3 consecutive symbols
    for (let i = 0; i < 3; i++) {
      if (
        currentBoard[0][i] === currentBoard[1][i] &&
        currentBoard[1][i] === currentBoard[2][i]
      ) {
        if (currentBoard[0][i] === "X") return "Player 1 Wins";
        if (currentBoard[0][i] === "O") return "Player 2 Wins";
      }
    }

    // Check for matching diagonals
    if (
      currentBoard[0][0] === currentBoard[1][1] &&
      currentBoard[1][1] === currentBoard[2][2]
    ) {
      if (currentBoard[0][0] === "X") return "Player 1 Wins";
      if (currentBoard[0][0] === "O") return "Player 2 Wins";
    }

    if (
      currentBoard[0][2] === currentBoard[1][1] &&
      currentBoard[1][1] === currentBoard[2][0]
    ) {
      if (currentBoard[0][2] === "X") return "Player 1 Wins";
      if (currentBoard[0][2] === "O") return "Player 2 Wins";
    }
  }

  const getBoard = board.getBoard;

  return { playRound, checkForVictory: checkForVictory, getBoard, restartGame };
};

const displayController = (function () {
  const game = gameController();
  const gameSlots = document.querySelectorAll(".game-slot");

  // Add the correct symbol to the correct position in the array
  // based on which square is clicked and whose turn it is
  gameSlots.forEach((gameSlot) => {
    gameSlot.addEventListener("click", () => {
      const row = gameSlot.getAttribute("data-row");
      const column = gameSlot.getAttribute("data-column");
      game.playRound(row, column);
      displayGameBoard();
      endGame();
    });
  });

  function displayGameBoard() {
    clearBoardDisplay();

    for (let i = 0; i < game.getBoard().length; i++) {
      for (let j = 0; j < game.getBoard()[i].length; j++) {
        if (game.getBoard()[i][j] !== "-") {
          gameSlots.forEach((gameSlot) => {
            if (
              +gameSlot.getAttribute("data-row") === i &&
              +gameSlot.getAttribute("data-column") === j
            ) {
              gameSlot.textContent = game.getBoard()[i][j];
            }
          });
        }
      }
    }
  }

  function clearBoardDisplay() {
    gameSlots.forEach((gameSlot) => {
      gameSlot.textContent = "";
    });
  }

  function endGame() {
    if (game.checkForVictory() !== undefined) {
      const winner = game.checkForVictory();
      document.querySelector("dialog").showModal();
      document.querySelector(".victory-message").textContent = winner;
    }
  }

  document.querySelector(".restart-button").addEventListener("click", () => {
    game.restartGame();
    document.querySelector("dialog").close();
    clearBoardDisplay();
  });
})();
