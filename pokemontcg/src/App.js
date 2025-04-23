import { useState } from "react";
import Game from "./Scenes/Game/Game";
import Start from "./Scenes/Start/Start";
import './App.css';

function App() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState(null);

  const [player1Pokemon, setPlayer1Pokemon] = useState(null);
  const [player2Pokemon, setPlayer2Pokemon] = useState(null);

  const toggleScreen = () => setIsGameActive((prev) => !prev);

  return (
    <div className="App">
      {isGameActive ? (
        <Game
          startingPlayer={startingPlayer}
          onToggleScreen={toggleScreen}
          player1Pokemon={player1Pokemon}
          player2Pokemon={player2Pokemon}
        />
      ) : (
        <Start
          onToggleScreen={toggleScreen}
          setStartingPlayer={setStartingPlayer}
          setPlayer1Pokemon={setPlayer1Pokemon}
          setPlayer2Pokemon={setPlayer2Pokemon}
        />
      )}
    </div>
  );
}

export default App;
