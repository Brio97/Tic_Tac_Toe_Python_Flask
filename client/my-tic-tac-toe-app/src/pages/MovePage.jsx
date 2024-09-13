import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GameBoard from '../components/GameBoard';

const MovePage = () => {
  const { game_id } = useParams(); // Get game ID from URL params
  const [gameData, setGameData] = useState(null); // Game state data
  const [error, setError] = useState(null); // To capture any errors
  const [message, setMessage] = useState(''); // User messages like turn info
  const [isPlayerTurn, setIsPlayerTurn] = useState(false); // Determine if it's the player's turn
  const [user_id, setUserId] = useState(null); // Store logged-in user ID

  // Fetch game data on component mount or when game_id changes
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`/game/${game_id}`); // Fetch game data correctly
        setGameData(response.data);
        setUserId(response.data.current_player); // Assuming `current_player` is the logged-in user
      } catch (error) {
        setError('Error fetching game data.');
      }
    };
    fetchGameData();
  }, [game_id]);

  // Check if it's the logged-in player's turn
  useEffect(() => {
    if (gameData) {
      setIsPlayerTurn(gameData.current_player === user_id);
    }
  }, [gameData, user_id]);

  // Handle player moves
  const handleMove = async (row, col) => {
    if (!isPlayerTurn) {
      setMessage('It is not your turn.');
      return;
    }
    try {
      const response = await axios.post(`/move/${game_id}`, { row, col }); // Use correct endpoint
      setGameData(response.data); // Update the board after the move
      setMessage(''); // Clear any messages
    } catch (error) {
      setError('Error making move.');
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Game ID: {game_id}</h1>
      {gameData ? (
        <>
          <GameBoard gameData={gameData} onMove={handleMove} />
          <p>{isPlayerTurn ? 'Your turn!' : 'Waiting for the opponent...'}</p>
          <p>{message}</p>
        </>
      ) : (
        <p>Loading game data...</p>
      )}
    </div>
  );
};

export default MovePage;
