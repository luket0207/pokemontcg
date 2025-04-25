import { useEffect, useState } from "react";
import CoinFlip from "../CoinFlip/CoinFlip";
import "./InbetweenTurns.scss";

const InbetweenTurns = ({
  player1Pokemon,
  player2Pokemon,
  setPlayer1Pokemon,
  setPlayer2Pokemon,
  currentTurn,
  nextTurn,
  onComplete,
  message,
}) => {
  const [logs, setLogs] = useState([]);
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const [pendingFlips, setPendingFlips] = useState([]);
  const [flipKey, setFlipKey] = useState(0);

  const applyStatusEffects = (pokemon, label) => {
    const logList = [];
    let updated = { ...pokemon };

    if (!updated) return { updated, logs: [], flips: [] };

    const flips = [];

    if (updated.effects?.includes("poisoned")) {
      updated.currentHealth = Math.max(0, updated.currentHealth - 10);
      logList.push(`${label}'s Pokémon was dealt 10 damage from poison.`);
    }

    if (updated.effects?.includes("burned")) {
      updated.currentHealth = Math.max(0, updated.currentHealth - 20);
      logList.push(`${label}'s Pokémon was dealt 20 damage from burn.`);
      flips.push({ label, pokemon: updated, condition: "burned" });
    }

    if (updated.effects?.includes("paralyzed") && label === currentTurn) {
      updated.effects = updated.effects.filter((e) => e !== "paralyzed");
      logList.push(`${label}'s paralysis wore off.`);
    }

    return { updated, logs: logList, flips };
  };

  const applySleepFlips = () => {
    const flips = [];

    if (player1Pokemon?.effects?.includes("asleep")) {
      flips.push({
        label: "Player 1",
        pokemon: player1Pokemon,
        condition: "asleep",
      });
    }

    if (player2Pokemon?.effects?.includes("asleep")) {
      flips.push({
        label: "Player 2",
        pokemon: player2Pokemon,
        condition: "asleep",
      });
    }

    return flips;
  };

  const handleFlipResult = (result) => {
    const [current] = pendingFlips;
    const remaining = pendingFlips.slice(1);

    const updatedPokemon = { ...current.pokemon };
    const label = current.label;
    const condition = current.condition;
    const logList = [];

    if (result === "heads") {
      updatedPokemon.effects = updatedPokemon.effects.filter(
        (e) => e !== condition
      );
      logList.push(`${label}'s ${condition} was cured!`);
    } else {
      if (condition === "asleep") {
        logList.push(`${label}'s Pokémon is still asleep.`);
      } else if (condition === "burned") {
        logList.push(`${label}'s burn remains.`);
      }
    }

    if (label === "Player 1") {
      setPlayer1Pokemon(updatedPokemon);
    } else {
      setPlayer2Pokemon(updatedPokemon);
    }

    setLogs((prev) => [...prev, ...logList]);

    if (remaining.length > 0) {
      setPendingFlips(remaining);
      setFlipKey((k) => k + 1); // trigger next coin flip
    } else {
      setShowCoinFlip(false);
      setTimeout(() => {
        onComplete(
          pendingFlips.some((f) => f.label === "Player 1")
            ? updatedPokemon
            : player1Pokemon,
          pendingFlips.some((f) => f.label === "Player 2")
            ? updatedPokemon
            : player2Pokemon
        );
      }, 3000);
    }
  };

  useEffect(() => {
    const p1 = applyStatusEffects(player1Pokemon, "Player 1");
    const p2 = applyStatusEffects(player2Pokemon, "Player 2");

    const combinedLogs = [...p1.logs, ...p2.logs];
    setLogs(combinedLogs);

    setPlayer1Pokemon(p1.updated);
    setPlayer2Pokemon(p2.updated);

    const allFlips = [...p1.flips, ...p2.flips, ...applySleepFlips()];
    if (allFlips.length > 0) {
      const delay = combinedLogs.length > 0 ? 3000 : 0;
      const timer = setTimeout(() => {
        setPendingFlips(allFlips);
        setShowCoinFlip(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete(p1.updated, p2.updated);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const renderPokemonStatus = (label, pokemon) => {
    if (!pokemon) {
      return (
        <div className="pokemon-status">
          <h3>{label}</h3>
          <p>No Pokémon</p>
        </div>
      );
    }

    return (
      <div className="pokemon-status">
        <h3>{label}</h3>
        {pokemon.effects && pokemon.effects.length > 0 && (
          <div className="effects">
            <strong>Status Effects:</strong> {pokemon.effects.join(", ")}
          </div>
        )}
      </div>
    );
  };

  const currentFlip = pendingFlips[0];

  return (
    <div className="inbetween-turns">
      {showCoinFlip ? (
        <div className="coin-flip-section">
          <h2>
            {currentFlip?.label}, {currentFlip?.condition} check
          </h2>
          <CoinFlip key={flipKey} onResult={handleFlipResult} />
        </div>
      ) : (
        <>
          <h2>{message || `${nextTurn}'s turn`}</h2>
          <div className="pokemon-overview">
            {renderPokemonStatus("Player 1", player1Pokemon)}
            {renderPokemonStatus("Player 2", player2Pokemon)}
          </div>

          {logs.length > 0 && (
            <div className="inbetween-log">
              <h4>Turn Summary</h4>
              <ul>
                {logs.map((log, idx) => (
                  <li key={idx}>{log}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InbetweenTurns;
