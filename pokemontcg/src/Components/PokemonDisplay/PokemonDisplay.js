import { useState } from "react";
import "./PokemonDisplay.scss";

const PokemonDisplay = ({
  player1Pokemon,
  player2Pokemon,
  currentTurn,
  onRemoveEffect,
}) => {
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const renderHealthBar = (label, pokemon, playerKey) => {
    if (!pokemon)
      return (
        <div className="pokemon-block">
          <h2>{label}</h2>
          <p>No Pokémon</p>
        </div>
      );

    const { currentHealth, maxHealth, effects = [] } = pokemon;
    const healthPercentage = (currentHealth / maxHealth) * 100;
    const isLowHealth = currentHealth <= 20;

    return (
      <div className="pokemon-block">
        <h2>{label}</h2>
        <div className="health-bar-wrapper">
          <div
            className={`health-bar ${isLowHealth ? "low" : "healthy"}`}
            style={{ width: `${healthPercentage}%` }}
          ></div>
          <p className="health-label">
            {currentHealth} / {maxHealth} HP
          </p>
        </div>

        <div className="status-effects">
          {effects.map((effect, idx) => {
            const displayLetter =
              effect.toLowerCase() === "asleep"
                ? "Z"
                : effect.charAt(0).toUpperCase();

            return (
              <div
                key={idx}
                className={`effect-pill ${effect.toLowerCase()}`}
                onClick={() => setPendingRemoval({ effect, playerKey, label })}
              >
                <p>{displayLetter}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isPlayer1 = currentTurn === "Player 1";

  const yourPokemon = isPlayer1 ? player1Pokemon : player2Pokemon;
  const theirPokemon = isPlayer1 ? player2Pokemon : player1Pokemon;

  return (
    <div className="status">
      {renderHealthBar(
        "Their Pokémon",
        theirPokemon,
        isPlayer1 ? "Player 2" : "Player 1"
      )}
      {renderHealthBar("Your Pokémon", yourPokemon, currentTurn)}

      {pendingRemoval && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>
              Are you sure you want to remove{" "}
              <strong>{pendingRemoval.effect}</strong> from{" "}
              <strong>{pendingRemoval.label.toLowerCase()}</strong> Pokémon?
            </p>
            <div className="confirm-buttons">
              <button
                onClick={() => {
                  onRemoveEffect(
                    pendingRemoval.playerKey,
                    pendingRemoval.effect
                  );
                  setPendingRemoval(null);
                }}
              >
                Yes
              </button>
              <button onClick={() => setPendingRemoval(null)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDisplay;
