import { useState } from "react";
import CoinFlip from "../../Components/CoinFlip/CoinFlip";
import PokemonDisplay from "../../Components/PokemonDisplay/PokemonDisplay";
import Actions from "../../Components/Actions/Actions";
import AddPokemon from "../../Components/AddPokemon/AddPokemon";
import NumberPad from "../../Components/NumberPad/NumberPad";
import "./Game.scss";
import Button from "../../Components/Button/Button";
import InbetweenTurns from "../../Components/InbetweenTurns/InbetweenTurns";

const Game = ({
  startingPlayer,
  onToggleScreen,
  player1Pokemon: initialPlayer1,
  player2Pokemon: initialPlayer2,
  currentTurn,
  setCurrentTurn,
}) => {
  const [isCoinFlipping, setIsCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState(null);

  const [player1Pokemon, setPlayer1Pokemon] = useState(initialPlayer1);
  const [player2Pokemon, setPlayer2Pokemon] = useState(initialPlayer2);

  const [pendingHealthInput, setPendingHealthInput] = useState(true);
  const [tempHealth, setTempHealth] = useState("");

  const [showEndTurnConfirm, setShowEndTurnConfirm] = useState(false);
  const [isReplacingPokemon, setIsReplacingPokemon] = useState(false);

  const [isChoosingStatusTarget, setIsChoosingStatusTarget] = useState(false);
  const [pendingEffect, setPendingEffect] = useState(null);

  const [isHealing, setIsHealing] = useState(false);
  const [healAmount, setHealAmount] = useState(0);

  const [isAddingMaxHealth, setIsAddingMaxHealth] = useState(false);
  const [addAmount, setAddAmount] = useState(0);

  const [isAttacking, setIsAttacking] = useState(false);
  const [attackAmount, setAttackAmount] = useState(0);

  const [isBetweenTurns, setIsBetweenTurns] = useState(false);
  const [nextTurnText, setNextTurnText] = useState("");
  const [forcedReplacePlayer, setForcedReplacePlayer] = useState(null);
  const [statusMessages, setStatusMessages] = useState([]);

  const [coinCallback, setCoinCallback] = useState(null);

  const triggerCoinFlip = (callback) => {
    setIsCoinFlipping(true);
    setCoinResult(null);
    setCoinCallback(() => callback);
  };

  const handleCoinFlipResult = (result) => {
    setCoinResult(result);
    setTimeout(() => {
      setIsCoinFlipping(false);
      if (coinCallback) {
        coinCallback(result);
        setCoinCallback(null);
      }
    }, 1500);
  };

  const handleBack = () => {
    onToggleScreen();
  };

  const handleFlipCoin = () => {
    setIsCoinFlipping(true);
    setCoinResult(null);
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

  const handleNewPokemon = () => {
    setIsReplacingPokemon(true);
  };

  const handleReplacePokemon = (pokemon) => {
    setCurrentPokemon(pokemon);
    setIsReplacingPokemon(false);
  };

  const handleHeal = () => {
    setIsHealing(true);
    setHealAmount(0);
  };

  const handleSubmitHeal = () => {
    const amount = Math.max(0, healAmount);
    const current = getCurrentPokemon();
    if (!current) return;

    const updated = {
      ...current,
      currentHealth: Math.min(
        current.currentHealth + amount,
        current.maxHealth
      ),
    };

    setCurrentPokemon(updated);
    setIsHealing(false);
    setHealAmount(0);
  };

  const handleNewMaxHealth = () => {
    setIsAddingMaxHealth(true);
    setAddAmount(0);
  };

  const handleStatusEffect = (effect) => {
    setPendingEffect(effect);
    setIsChoosingStatusTarget(true);
  };

  const handleAttack = () => {
    setIsAttacking(true);
    setAttackAmount(0);
  };

  const handleSubmitAttack = () => {
    const damage = Math.max(0, attackAmount);
    const opponent = getOpponentPokemon();
    if (!opponent) return;

    const updated = {
      ...opponent,
      currentHealth: Math.max(opponent.currentHealth - damage, 0),
    };

    setOpponentPokemon(updated);
    setIsAttacking(false);
    setAttackAmount(0);
  };

  const handleEndTurn = () => {
    const next = currentTurn === "Player 1" ? "Player 2" : "Player 1";
    setNextTurnText(`${next}'s turn`);
    setIsBetweenTurns(true);
    setShowEndTurnConfirm(false);
  };

  const handleForcedReplace = (pokemon) => {
    if (forcedReplacePlayer === "Player 1") {
      setPlayer1Pokemon(pokemon);
    } else {
      setPlayer2Pokemon(pokemon);
    }
    setForcedReplacePlayer(null);
    setIsBetweenTurns(false);
    setCurrentTurn(
		currentTurn === "Player 1" ? "Player 2" : "Player 1"
	  );
  };

  const handleSubmitAddMaxHealth = () => {
    const amount = Math.max(0, addAmount);
    const current = getCurrentPokemon();
    if (!current) return;

    const updated = {
      ...current,
      maxHealth: current.maxHealth + amount,
      currentHealth: current.currentHealth + amount,
    };

    setCurrentPokemon(updated);
    setIsAddingMaxHealth(false);
    setAddAmount(0);
  };

  const applyEffect = (target) => {
    if (!pendingEffect) return;

    if (target === "yours" || target === "both") {
      const current = getCurrentPokemon();
      const alreadyHasEffect = (current.effects || []).includes(pendingEffect);
      if (!alreadyHasEffect) {
        const updated = {
          ...current,
          effects: [...(current.effects || []), pendingEffect],
        };
        setCurrentPokemon(updated);
      }
    }

    if (target === "theirs" || target === "both") {
      const opponent = getOpponentPokemon();
      const alreadyHasEffect = (opponent.effects || []).includes(pendingEffect);
      if (!alreadyHasEffect) {
        const updated = {
          ...opponent,
          effects: [...(opponent.effects || []), pendingEffect],
        };
        setOpponentPokemon(updated);
      }
    }

    setPendingEffect(null);
    setIsChoosingStatusTarget(false);
  };

  return (
	<div className="game">
	  {/* Priority 1: Forced Pokémon replacement (KO state) */}
	  {forcedReplacePlayer && (
		<>
		  <AddPokemon
			playerName={forcedReplacePlayer}
			onSubmit={handleForcedReplace}
			onEndGame={() => onToggleScreen()}
			currentTurn={currentTurn}
			knockedOut={true}
		  />
		</>
	  )}
  
	  {/* Priority 2: Between-turn phase */}
	  {!forcedReplacePlayer && isBetweenTurns && (
		<InbetweenTurns
		  player1Pokemon={player1Pokemon}
		  player2Pokemon={player2Pokemon}
		  setPlayer1Pokemon={setPlayer1Pokemon}
		  setPlayer2Pokemon={setPlayer2Pokemon}
		  currentTurn={currentTurn}
		  nextTurn={currentTurn === "Player 1" ? "Player 2" : "Player 1"}
		  onComplete={(updatedP1, updatedP2) => {
			const p1Dead = updatedP1.currentHealth === 0;
			const p2Dead = updatedP2.currentHealth === 0;
  
			setPlayer1Pokemon(updatedP1);
			setPlayer2Pokemon(updatedP2);
  
			if (p1Dead) {
			  setForcedReplacePlayer("Player 1");
			} else if (p2Dead) {
			  setForcedReplacePlayer("Player 2");
			} else {
			  setCurrentTurn(currentTurn === "Player 1" ? "Player 2" : "Player 1");
			  setIsBetweenTurns(false);
			}
		  }}
		  message={nextTurnText}
		/>
	  )}
  
	  {/* Priority 3: Attack panel */}
	  {!forcedReplacePlayer && !isBetweenTurns && isAttacking && (
		<div className="attack-panel">
		  <p>
			Choose how much damage to deal to{" "}
			{currentTurn === "Player 1" ? "Player 2" : "Player 1"}:
		  </p>
		  <NumberPad
			value={attackAmount}
			onChange={setAttackAmount}
			onClear={() => setAttackAmount(0)}
			onSubmit={handleSubmitAttack}
		  />
		  <Button onClick={() => setIsAttacking(false)}>Cancel</Button>
		</div>
	  )}
  
	  {/* Priority 4: Heal panel */}
	  {!forcedReplacePlayer && !isBetweenTurns && isHealing && (
		<div className="heal-panel">
		  <p>Choose how much to heal {currentTurn}'s Pokémon:</p>
		  <NumberPad
			value={healAmount}
			onChange={setHealAmount}
			onClear={() => setHealAmount(0)}
			onSubmit={handleSubmitHeal}
		  />
		  <Button onClick={() => setIsHealing(false)}>Cancel</Button>
		</div>
	  )}
  
	  {/* Priority 5: Max health panel */}
	  {!forcedReplacePlayer && !isBetweenTurns && isAddingMaxHealth && (
		<div className="add-health-panel">
		  <p>Increase {currentTurn}'s max and current health by:</p>
		  <NumberPad
			value={addAmount}
			onChange={setAddAmount}
			onClear={() => setAddAmount(0)}
			onSubmit={handleSubmitAddMaxHealth}
		  />
		  <Button onClick={() => setIsAddingMaxHealth(false)}>Cancel</Button>
		</div>
	  )}
  
	  {/* Priority 6: Manual replacement */}
	  {!forcedReplacePlayer && !isBetweenTurns && isReplacingPokemon && (
		<AddPokemon
		  playerName={currentTurn}
		  onSubmit={handleReplacePokemon}
		  onCancle={() => setIsReplacingPokemon(false)}
		/>
	  )}
  
	  {/* Priority 7: Main game screen */}
	  {!forcedReplacePlayer &&
		!isBetweenTurns &&
		!isAttacking &&
		!isHealing &&
		!isAddingMaxHealth &&
		!isReplacingPokemon && (
		  <>
			<div className="buttons">
			  <Button onClick={handleBack}>End Game</Button>
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
			  onRemoveEffect={(player, effect) => {
				if (player === "Player 1") {
				  setPlayer1Pokemon((prev) => ({
					...prev,
					effects: (prev.effects || []).filter((e) => e !== effect),
				  }));
				} else {
				  setPlayer2Pokemon((prev) => ({
					...prev,
					effects: (prev.effects || []).filter((e) => e !== effect),
				  }));
				}
			  }}
			/>
  
			{isChoosingStatusTarget && (
			  <div className="choose-effect-target">
				<p>
				  Apply <strong>{pendingEffect}</strong> to:
				</p>
				<Button onClick={() => applyEffect("yours")}>Your Pokémon</Button>
				<Button onClick={() => applyEffect("theirs")}>
				  Their Pokémon
				</Button>
				<Button onClick={() => applyEffect("both")}>Both</Button>
				<Button onClick={() => setIsChoosingStatusTarget(false)}>
				  Cancel
				</Button>
			  </div>
			)}
  
			{!playerNeedsPokemon &&
			  !isChoosingStatusTarget && (
				<Actions
				  onHeal={handleHeal}
				  onNewMaxHealth={handleNewMaxHealth}
				  onNewPokemon={handleNewPokemon}
				  onPoison={() => handleStatusEffect("poisoned")}
				  onBurn={() => handleStatusEffect("burned")}
				  onConfuse={() => handleStatusEffect("confused")}
				  onParalyze={() => handleStatusEffect("paralyzed")}
				  onSleep={() => handleStatusEffect("asleep")}
				  onAttack={handleAttack}
				  onEndTurn={() => setShowEndTurnConfirm(true)}
				  currentEffects={getCurrentPokemon()?.effects || []}
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
					<Button onClick={() => setShowEndTurnConfirm(false)}>
					  No
					</Button>
				  </div>
				</div>
			  </div>
			)}
		  </>
		)}
	</div>
  );  
};

export default Game;
