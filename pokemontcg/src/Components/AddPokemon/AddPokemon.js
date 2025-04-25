import { useState } from 'react';
import NumberPad from '../NumberPad/NumberPad';
import Button from '../Button/Button';
import './AddPokemon.scss';

const AddPokemon = ({ playerName, onSubmit, onEndGame, onCancle, isPreGame = false, currentTurn, knockedOut = false }) => {
	const [maxHealth, setMaxHealth] = useState(0);
	const [currentHealth, setCurrentHealth] = useState(0);
	const [maxHealthSet, setMaxHealthSet] = useState(false);
	const [showCurrentHealthPad, setShowCurrentHealthPad] = useState(false);
    const isOppositePlayer = currentTurn && playerName !== currentTurn;

	const handleClearMax = () => {
		setMaxHealth(0);
		setMaxHealthSet(false);
		setCurrentHealth(0);
		setShowCurrentHealthPad(false);
	};

	const handleClearCurrent = () => {
		setCurrentHealth(0);
	};

	const handleFinalSubmit = () => {
		const finalCurrent = Math.min(currentHealth, maxHealth);
		if (maxHealth <= 0 || finalCurrent <= 0) return;

		onSubmit({ maxHealth, currentHealth: finalCurrent });
		setMaxHealth(0);
		setCurrentHealth(0);
		setMaxHealthSet(false);
		setShowCurrentHealthPad(false);
	};

	return (
		<div className={`add-pokemon ${isOppositePlayer ? "opposite-player" : ""}`}>
            {knockedOut && <h2>{playerName}'s Pokemon was knocked out!</h2>}
			<h2>{playerName}, add your Pokémon</h2>

			{/* Step 1: Enter Max Health */}
			{!maxHealthSet && (
				<>
					<NumberPad
						value={maxHealth}
						onChange={setMaxHealth}
						onClear={handleClearMax}
						onSubmit={() => {
							if (maxHealth > 0) {
								if (isPreGame) {
									onSubmit({ maxHealth, currentHealth: maxHealth });
									handleClearMax();
								} else {
									setMaxHealthSet(true);
								}
							}
						}}
					/>
				</>
			)}

			{/* Step 2: Ask about current health (skip if pre-game) */}
			{!isPreGame && maxHealthSet && !showCurrentHealthPad && (
				<div className="health-options">
					<p>Is the Pokémon's current health the same as its max health?</p>
					<Button onClick={() => onSubmit({ maxHealth, currentHealth: maxHealth })}>Yes</Button>
					<Button onClick={() => setShowCurrentHealthPad(true)}>No</Button>
				</div>
			)}

			{/* Step 3: Enter current health if different */}
			{!isPreGame && showCurrentHealthPad && (
				<>
					<NumberPad
						value={currentHealth}
						onChange={(val) => setCurrentHealth(Math.min(val, maxHealth))}
						onClear={handleClearCurrent}
						onSubmit={handleFinalSubmit}
					/>
				</>
			)}

			{/* Skip this button pre-game */}
			{!isPreGame && !onCancle && <Button onClick={onEndGame}>End Game</Button>}
			{!isPreGame && onCancle && <Button onClick={onCancle}>Cancel</Button>}
		</div>
	);
};

export default AddPokemon;
