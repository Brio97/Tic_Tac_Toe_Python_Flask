import React, { useState } from 'react';
import axios from 'axios';
import GameBoard from '../components/GameBoard';

const GamePage = () => {
  const [gameId, setGameId] = useState(null);
  const [gridSize, setGridSize] = useState(3); // Default grid size
  const [playerX, setPlayerX] = useState(''); // Set this based on user selection
  const [playerO, setPlayerO] = useState(''); // Set this based on user selection
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const handleCreateGame = async () => {
    setIsCreatingGame(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/game', { grid_size: gridSize, player_x: playerX, player_o: playerO });
      setGameId(response.data.game_id);
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setIsCreatingGame(false);
    }
  };

  return (
    <div>
      <h1>Tic-Tac-Toe</h1>
      {gameId ? (
        <GameBoard gameId={gameId} />
      ) : (
        <div>
          <h2>Create a New Game</h2>
          <label>
            Grid Size:
            <input
              type="number"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              min="3"
            />
          </label>
          <br />
          <label>
            Player X:
            <input
              type="text"
              value={playerX}
              onChange={(e) => setPlayerX(e.target.value)}
            />
          </label>
          <br />
          <label>
            Player O (optional):
            <input
              type="text"
              value={playerO}
              onChange={(e) => setPlayerO(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleCreateGame} disabled={isCreatingGame}>
            {isCreatingGame ? 'Creating Game...' : 'Create Game'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
