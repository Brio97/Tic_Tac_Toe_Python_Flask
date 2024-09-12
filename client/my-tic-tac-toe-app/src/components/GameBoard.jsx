import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameBoard = ({ gameId }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    // Fetch the current game state from the backend
    const fetchGameState = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/game/${gameId}`);
        const gameState = response.data.game_state;
        setBoard(gameState);
        setXIsNext(response.data.player_x === 'X'); // Set X as next if player_x is X
        setIsGameOver(response.data.game_state.some(cell => cell !== null)); // Check if game is over
      } catch (error) {
        console.error('Error fetching game state:', error);
      }
    };
    
    if (gameId) fetchGameState();
  }, [gameId]);

  const handleClick = async (index) => {
    if (board[index] || isGameOver) return; // Ignore if cell is already filled or game is over

    try {
      const response = await axios.post('/move', { game_id: gameId, player: xIsNext ? 'X' : 'O', position: index });
      const gameData = response.data;
      
      if (gameData.winner || gameData.result === 'draw') {
        setIsGameOver(true);
      }

      setBoard(gameData.game_state);
      setXIsNext(gameData.winner ? !xIsNext : !xIsNext);
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  return (
    <div>
      <h2>Current Player: {xIsNext ? 'X' : 'O'}</h2>
      <div>
        {board.map((value, index) => (
          <button key={index} onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>
      {isGameOver && <p>Game Over</p>}
    </div>
  );
};

export default GameBoard;
