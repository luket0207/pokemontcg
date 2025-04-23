import { useState } from "react";
import CoinFlip from "../../Components/CoinFlip/CoinFlip";
import PokemonDisplay from "../../Components/PokemonDisplay/PokemonDisplay";
import Actions from "../../Components/Actions/Actions";
import "./Game.scss";
import Button from "../../Components/Button/Button";

const Game = ({
  startingPlayer,
  onToggleScreen,
  player1Pokemon: initialPlayer1,
  player2Pokemon: initialPlayer2,
}) => {
  const [currentTurn, setCurrentTurn] = useState(startingPlayer);
  const [isCoinFlipping, setIsCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState(null);

  const [player1Pokemon, setPlayer1Pokemon] = useState(initialPlayer1);
  const [player2Pokemon, setPlayer2Pokemon] = useState(initialPlayer2);

  const [pendingHealthInput, setPendingHealthInput] = useState(true);
  const [tempHealth, setTempHealth] = useState("");

  const [showEndTurnConfirm, setShowEndTurnConfirm] = useState(false);

  const handleBack = () => {
    onToggleScreen();
  };

  const handleFlipCoin = () => {
    setIsCoinFlipping(true);
    setCoinResult(null);
  };

  const handleCoinFlipResult = (result) => {
    setCoinResult(result);
    setTimeout(() => {
      setIsCoinFlipping(false);
    }, 1500);
  };

  const handleHealthSubmit = () => {
    const health = parseInt(tempHealth, 10);
    if (isNaN(health) || health <= 0) return;

    const newPokemon = { maxHealth: health, currentHealth: health };

    if (currentTurn === "Player 1") {
      setPlayer1Pokemon(newPokemon);
    } else {
      setPlayer2Pokemon(newPokemon);
    }

    setPendingHealthInput(false);
    setTempHealth("");
  };

  const getCurrentPokemon = () =>
    currentTurn === "Player 1" ? player1Pokemon : player2Pokemon;

  const getOpponentPokemon = () =>
    currentTurn === "Player 1" ? player2Pokemon : player1Pokemon;

  const setCurrentPokemon = (updated) => {
    currentTurn === "Player 1"
      ? setPlayer1Pokemon(updated)
      : setPlayer2Pokemon(updated);
  };

  const setOpponentPokemon = (updated) => {
    currentTurn === "Player 1"
      ? setPlayer2Pokemon(updated)
      : setPlayer1Pokemon(updated);
  };

  const playerNeedsPokemon = getCurrentPokemon() === null;

  const handleHeal = () => {
    const poke = getCurrentPokemon();
    if (!poke) return;

    const healed = {
      ...poke,
      currentHealth: Math.min(poke.currentHealth + 10, poke.maxHealth),
    };
    setCurrentPokemon(healed);
  };

  const handleNewMaxHealth = () => {
    const poke = getCurrentPokemon();
    if (!poke) return;

    const bonus = 10;
    const updated = {
      ...poke,
      maxHealth: poke.maxHealth + bonus,
      currentHealth: poke.currentHealth + bonus,
    };
    setCurrentPokemon(updated);
  };

  const handleEffect = (effect) => {
    const opponent = getOpponentPokemon();
    if (!opponent) return;

    const updated = { ...opponent, [effect]: true };
    setOpponentPokemon(updated);
  };

  const handleAttack = () => {
    const opponent = getOpponentPokemon();
    if (!opponent) return;

    const damage = 10;
    const updated = {
      ...opponent,
      currentHealth: Math.max(opponent.currentHealth - damage, 0),
    };
    setOpponentPokemon(updated);
  };

  const handleEndTurn = () => {
    setCurrentTurn((prev) => (prev === "Player 1" ? "Player 2" : "Player 1"));
    setPendingHealthInput(false);
  };

  return (
    <div className="game">
      {/* <p>
        It's <strong>{currentTurn}</strong>'s turn!
      </p> */}

      <div className="buttons">
        <Button onClick={handleBack}>Back to Start</Button>
        <Button onClick={handleFlipCoin}>Flip Coin</Button>
      </div>

      {isCoinFlipping && (
        <div className="coin-flip-overlay">
          <CoinFlip onResult={handleCoinFlipResult} />
          {coinResult && (
            <p className="coin-result">{coinResult.toUpperCase()}!</p>
          )}
        </div>
      )}

      {playerNeedsPokemon && pendingHealthInput && (
        <div className="pokemon-entry">
          <p>{currentTurn}, enter a max health for your Pokémon:</p>
          <input
            type="number"
            value={tempHealth}
            onChange={(e) => setTempHealth(e.target.value)}
            placeholder="Enter max health"
          />
          <button onClick={handleHealthSubmit}>Add Pokémon</button>
        </div>
      )}

      <PokemonDisplay
        player1Pokemon={player1Pokemon}
        player2Pokemon={player2Pokemon}
        currentTurn={currentTurn}
      />

      {!playerNeedsPokemon && (
        <Actions
          onHeal={handleHeal}
          onNewMaxHealth={handleNewMaxHealth}
          onPoison={() => handleEffect("poisoned")}
          onBurn={() => handleEffect("burned")}
          onConfuse={() => handleEffect("confused")}
          onParalyze={() => handleEffect("paralyzed")}
          onSleep={() => handleEffect("asleep")}
          onAttack={handleAttack}
          onEndTurn={() => setShowEndTurnConfirm(true)}
        />
      )}

      {showEndTurnConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to end your turn?</p>
            <div className="confirm-buttons">
              <Button
                onClick={() => {
                  handleEndTurn();
                  setShowEndTurnConfirm(false);
                }}
              >
                Yes
              </Button>
              <Button onClick={() => setShowEndTurnConfirm(false)}>No</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
