import { useState } from "react";
import CoinFlip from "../../Components/CoinFlip/CoinFlip";
import AddPokemon from "../../Components/AddPokemon/AddPokemon";
import "./Start.scss";

const Start = ({
  onToggleScreen,
  setStartingPlayer,
  setPlayer1Pokemon,
  setPlayer2Pokemon
}) => {
  const [phase, setPhase] = useState("idle"); // idle → p1 → p2 → flipping → done
  const [flipResult, setFlipResult] = useState(null);

  const handleStartClick = () => {
    setPhase("p1");
  };

  const handleSubmitPokemon = (pokemon) => {
    if (phase === "p1") {
      setPlayer1Pokemon(pokemon);
      setPhase("p2");
    } else if (phase === "p2") {
      setPlayer2Pokemon(pokemon);
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
          playerName="Player 1"
          onSubmit={handleSubmitPokemon}
          onEndGame={handleEndGame}
		  isPreGame={true}
        />
      )}

      {phase === "p2" && (
        <AddPokemon
          playerName="Player 2"
          onSubmit={handleSubmitPokemon}
          onEndGame={handleEndGame}
		  isPreGame={true}
        />
      )}

      {phase === "flipping" && !flipResult && <CoinFlip onResult={handleResult} />}

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
