import { useState } from "react";
import Game from "./Scenes/Game/Game";
import Start from "./Scenes/Start/Start";
import "./App.css";

function App() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState(null);

  const [player1Pokemon, setPlayer1Pokemon] = useState(null);
  const [player2Pokemon, setPlayer2Pokemon] = useState(null);

  const [currentTurn, setCurrentTurn] = useState(null);

  const toggleScreen = (initialTurn = startingPlayer) => {
    if (!isGameActive) {
      setCurrentTurn(initialTurn); 
    }
    setIsGameActive((prev) => !prev);
  };

  const getAppClass = () => {
    switch (currentTurn) {
      case "Player 1":
        return "player-one";
      case "Player 2":
        return "player-two";
      default:
        return "player-one";
    }
  };

  return (
    <div className={`App ${getAppClass()}`}>
      {isGameActive ? (
        <Game
          startingPlayer={startingPlayer}
          onToggleScreen={toggleScreen}
          player1Pokemon={player1Pokemon}
          player2Pokemon={player2Pokemon}
          currentTurn={currentTurn}
          setCurrentTurn={setCurrentTurn}
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
