import { useState, useCallback, useMemo } from "react";

const ROWS = 6;
const COLUMNS = 7;
const CONNECT_COUNT = 4;

type Player = "red" | "yellow" | null;
type GameStatus = "playing" | "won" | "draw";

const createEmptyBoard = (): Player[][] =>
  Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));

export default function Home() {
  const [board, setBoard] = useState<Player[][]>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("red");
  const [winner, setWinner] = useState<Player>(null);

  const gameStatus = useMemo((): GameStatus => {
    if (winner) return "won";
    if (board.every((row) => row.every((cell) => cell !== null))) return "draw";
    return "playing";
  }, [board, winner]);

  const checkWinner = useCallback((board: Player[][]): Player | null => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal \
      [1, -1], // diagonal /
    ];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const cell = board[row][col];
        if (!cell) continue;

        for (const [deltaRow, deltaCol] of directions) {
          let count = 1;

          // Check in positive direction
          let r = row + deltaRow;
          let c = col + deltaCol;
          while (
            r >= 0 &&
            r < ROWS &&
            c >= 0 &&
            c < COLUMNS &&
            board[r][c] === cell
          ) {
            count++;
            r += deltaRow;
            c += deltaCol;
          }

          if (count >= CONNECT_COUNT) return cell;
        }
      }
    }
    return null;
  }, []);

  const handleClick = useCallback(
    (col: number) => {
      if (gameStatus !== "playing") return;

      for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
          const newBoard = board.map((row) => [...row]);
          newBoard[row][col] = currentPlayer;
          setBoard(newBoard);

          const gameWinner = checkWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
          } else {
            setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");
          }
          break;
        }
      }
    },
    [board, currentPlayer, gameStatus, checkWinner]
  );

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("red");
    setWinner(null);
  }, []);

  const getStatusMessage = (): string => {
    const capitalizeString = (str: string): string =>
      str.charAt(0).toUpperCase() + str.slice(1);

    const statusMessages = {
      won: `🎉 ${capitalizeString(winner!)} Wins!`,
      draw: "🤝 It's a Draw!",
      playing: `${capitalizeString(currentPlayer ?? "red")}'s Turn`,
    } as const;

    return statusMessages[gameStatus] ?? statusMessages.playing;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="flex flex-col items-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 text-center">
          Connect 4
        </h1>

        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-700 mb-2"></div>
          {gameStatus === "playing" && (
            <div className="flex items-center justify-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  currentPlayer === "red" ? "bg-red-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-sm text-gray-600">Current Player</span>
            </div>
          )}
        </div>

        <div className="bg-blue-600 p-4 rounded-xl shadow-lg mb-6">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 mb-2 last:mb-0">
              {row.map((cell, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => handleClick(colIndex)}
                  disabled={gameStatus !== "playing"}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                    cell === "red"
                      ? "bg-red-500 border-red-600 shadow-md"
                      : cell === "yellow"
                      ? "bg-yellow-400 border-yellow-500 shadow-md"
                      : "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer"
                  } ${
                    gameStatus !== "playing"
                      ? "cursor-not-allowed opacity-75"
                      : ""
                  }`}
                  aria-label={`Drop piece in column ${colIndex + 1}`}
                />
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {gameStatus === "playing" ? "Reset Game" : "Play Again"}
        </button>
      </div>
    </div>
  );
}
