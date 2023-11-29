function Gameboard() {
    const rows = 6;
    const columns = 7;
    const board = [];

    // Initialize board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const dropToken = (column, player) => {
        const availableCells = board.filter((row) => row[column].getValue() === 0).map((row) => row[column]);

        if (!availableCells.length) return;

        const lowestRow = availableCells.length - 1;
        board[lowestRow][column].addToken(player);
    };

    const printBoard = () => {
        const boardWithTokens = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(boardWithTokens);
    }

    return { getBoard, dropToken, printBoard };

}

function Cell() {
    let value = 0;

    const getValue = () => value;

    const addToken = (player) => {
        value = player;
    };

    return { getValue, addToken };
}

function GameController(
    playerOneName = "Player 1",
    playerTwoName = "Player 2",
) {
    const board = Gameboard();
    let winner = null;

    const players = [
        {
            name: playerOneName,
            token: 1,
        },
        {
            name: playerTwoName,
            token: 2,
        }
    ];

    let activePlayer = players[0];

    const getWinner = () => winner;

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const printNewRound = () => {
        board.printBoard();
        console.log(`It's ${activePlayer.name}'s turn!`);
    }

    const checkForWinner = () => {
        const boardIsFull = board.getBoard().every((row) => row.every((cell) => cell.getValue() !== 0));
        if (boardIsFull) {
            return "tie";
        }

        // Check for horizontal win
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = board.getBoard()[row][col];
                if (cell.getValue() !== 0) {
                    if (cell.getValue() === board.getBoard()[row][col + 1].getValue() &&
                        cell.getValue() === board.getBoard()[row][col + 2].getValue() &&
                        cell.getValue() === board.getBoard()[row][col + 3].getValue()) {
                        return cell.getValue();
                    }
                }
            }
        }

        // Check for vertical win
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = board.getBoard()[row][col];
                if (cell.getValue() !== 0) {
                    if (cell.getValue() === board.getBoard()[row + 1][col].getValue() &&
                        cell.getValue() === board.getBoard()[row + 2][col].getValue() &&
                        cell.getValue() === board.getBoard()[row + 3][col].getValue()) {
                        return cell.getValue();
                    }
                }
            }
        }

        // Check for diagonal win (top left to bottom right)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = board.getBoard()[row][col];
                if (cell.getValue() !== 0) {
                    if (cell.getValue() === board.getBoard()[row + 1][col + 1].getValue() &&
                        cell.getValue() === board.getBoard()[row + 2][col + 2].getValue() &&
                        cell.getValue() === board.getBoard()[row + 3][col + 3].getValue()) {
                        return cell.getValue();
                    }
                }
            }
        }

        // Check for diagonal win (bottom left to top right)
        for (let row = 3; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = board.getBoard()[row][col];
                if (cell.getValue() !== 0) {
                    if (cell.getValue() === board.getBoard()[row - 1][col + 1].getValue() &&
                        cell.getValue() === board.getBoard()[row - 2][col + 2].getValue() &&
                        cell.getValue() === board.getBoard()[row - 3][col + 3].getValue()) {
                        return cell.getValue();
                    }
                }
            }
        }

        return null;

    }

    const playRound = (column) => {
        board.dropToken(column, activePlayer.token);
        winner = checkForWinner();
        if (winner) {
            console.log(`Congratulations ${activePlayer.name}! You won!`);
            return;
        }
        switchActivePlayer();
    };


}