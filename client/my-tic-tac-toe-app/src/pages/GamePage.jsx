import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import { checkAuth } from '/utils/auth';
import { fetchAvailableUsers, fetchPreviousGames } from '../api/fetchUserData';

const GamePage = () => {
  const [game_id, setGameId] = useState(null);
  const [gridSize, setGridSize] = useState(3);
  const [playerChoice, setPlayerChoice] = useState('AI');
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [previousGames, setPreviousGames] = useState([]);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [error, setError] = useState('');
  const [user_id, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateAndFetchData = async () => {
      try {
        const authData = await checkAuth();
        if (!authData || !authData.user_id) {
          console.log('User not authenticated, redirecting to login');
          navigate('/login');
          return;
        }
        setUserId(authData.user_id);

        const users = await fetchAvailableUsers();
        setAvailableUsers(users);

        const games = await fetchPreviousGames();
        setPreviousGames(games);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error in authenticateAndFetchData:', error);
      }
    };

    authenticateAndFetchData();
  }, [navigate]);

  const handleCreateGame = async () => {
    setIsCreatingGame(true);
    try {
      const response = await fetch('/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grid_size: gridSize,
          player_x: user_id,
          player_o: playerChoice === 'AI' ? null : selectedOpponent
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Game created successfully:', data);
      setGameId(data.game_id);
      navigate(`/move/${data.game_id}`);
    } catch (error) {
      setError(error.message || 'Error creating game');
      console.error('Error in handleCreateGame:', error);
    } finally {
      setIsCreatingGame(false);
    }
  };

  return (
    <div>
      <h1>Tic-Tac-Toe</h1>
      {game_id ? (
        <GameBoard game_id={game_id} />
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
            Opponent:
            <div>
              <label>
                <input
                  type="radio"
                  value="AI"
                  checked={playerChoice === 'AI'}
                  onChange={(e) => setPlayerChoice(e.target.value)}
                />
                Play against AI
              </label>
              <label>
                <input
                  type="radio"
                  value="Other"
                  checked={playerChoice === 'Other'}
                  onChange={(e) => setPlayerChoice(e.target.value)}
                />
                Play against another player
              </label>
            </div>
          </label>
          {playerChoice === 'Other' && (
            <label>
              Select Opponent:
              <select
                value={selectedOpponent}
                onChange={(e) => setSelectedOpponent(e.target.value)}
              >
                <option value="">--Select Opponent--</option>
                {availableUsers.length > 0 ? (
                  availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                  ))
                ) : (
                  <option value="">No users available</option>
                )}
              </select>
            </label>
          )}
          <br />
          <button onClick={handleCreateGame} disabled={isCreatingGame}>
            {isCreatingGame ? 'Creating Game...' : 'Create Game'}
          </button>
          {previousGames.length > 0 && (
            <div>
              <h2>Continue Previous Games</h2>
              <ul>
                {previousGames.map(game => (
                  <li key={game.id}>
                    <button onClick={() => navigate(`/move/${game.id}`)}>
                      Continue Game {game.id} (vs {game.player_o || 'AI'})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default GamePage;



