import { useState } from "react";
import CoinFlip from "../../Components/CoinFlip/CoinFlip";
import AddPokemon from "../../Components/AddPokemon/AddPokemon";
import "./Start.scss";

const Start = ({ onToggleScreen, setStartingPlayer, setPlayer1Pokemon, setPlayer2Pokemon }) => {
  const [phase, setPhase] = useState("idle"); // idle → p1 → p2 → flipping → done
  const [flipResult, setFlipResult] = useState(null);

  const handleStartClick = () => {
    setPhase("p1");
  };

  const handleSubmitPokemon = (health) => {
    const newPokemon = { maxHealth: health, currentHealth: health };

    if (phase === "p1") {
      setPlayer1Pokemon(newPokemon);
      setPhase("p2");
    } else if (phase === "p2") {
      setPlayer2Pokemon(newPokemon);
      setPhase("flipping");
    }
  };

  const handleEndGame = () => {
    alert("Game ended. Returning to start.");
    onToggleScreen();
  };

  const handleResult = (result) => {
    const winner = result === "heads" ? "Player 1" : "Player 2";
    setFlipResult(winner);
    setStartingPlayer(winner);

    setTimeout(() => {
      onToggleScreen();
    }, 1500);
  };

  return (
    <div className="start">
      {phase === "idle" && <button onClick={handleStartClick}>Start Game</button>}

      {phase === "p1" && (
        <AddPokemon
          onSubmit={handleSubmitPokemon}
          onEndGame={handleEndGame}
        />
      )}

      {phase === "p2" && (
        <AddPokemon
          onSubmit={handleSubmitPokemon}
          onEndGame={handleEndGame}
        />
      )}

      {phase === "flipping" && !flipResult && (
        <CoinFlip onResult={handleResult} />
      )}

      {flipResult && (
        <div className="coin-flip-result">
          {flipResult === "Player 1" ? (
            <span className="arrow arrow-up">↑</span>
          ) : (
            <span className="arrow arrow-down">↓</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Start;
