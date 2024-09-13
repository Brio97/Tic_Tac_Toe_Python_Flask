import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import the useUser hook
import './GameBoard.css';

const GameBoard = () => {
  const { gameId } = useParams();
  const { currentUser } = useUser();
  const [gameState, setGameState] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        if (gameId) {
          const response = await axios.get(`/game/${gameId}`);
          console.log('Game data fetched:', response.data);
          setGameState(response.data);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
        setError('Failed to load game data');
      }
    };

    fetchGameState();
  }, [gameId]);

  const handleCellClick = async (index) => {
    if (!isPlayerTurn || gameState.game_state[index] !== '') return;

    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    try {
      const position = index;
      const updatedGameState = [...gameState.game_state];
      updatedGameState[position] = currentUser.id; // Use current player's ID
      setGameState({ ...gameState, game_state: updatedGameState });
      setIsPlayerTurn(false);

      await axios.post(`/move/${gameId}`, {
        position: position,
        player: currentUser.id
      });

      const response = await axios.get(`/game/${gameId}`);
      setGameState(response.data);
      setIsPlayerTurn(true);
    } catch (error) {
      console.error('Error making move:', error);
      setError('Failed to make the move');
    }
  };

  if (!gameState) {
    return <div>Loading game...</div>;
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(${gameState.grid_size}, 50px)`,
    gridTemplateRows: `repeat(${gameState.grid_size}, 50px)`,
  };

  return (
    <div>
      <h3>Game ID: {gameId}</h3>
      <div className="game-board" style={gridStyle}>
        {gameState.game_state.map((cell, index) => (
          <div
            key={index}
            className={`grid-cell ${cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : ''}`}
            onClick={() => handleCellClick(index)}
          >
            {cell || ''}
          </div>
        ))}
      </div>
      {error && <p>{error}</p>}
      <p>{isPlayerTurn ? 'Your turn!' : 'Waiting for opponent...'}</p>
      {/* Debugging Info */}
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
    </div>
  );
};

export default GameBoard;


