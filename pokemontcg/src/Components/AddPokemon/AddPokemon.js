import { useState } from 'react';
import NumberPad from '../NumberPad/NumberPad';
import Button from '../Button/Button';
import './AddPokemon.scss';

const AddPokemon = ({ onSubmit, onEndGame }) => {
	const [health, setHealth] = useState(0);

	const handleClear = () => {
		setHealth(0);
	};

	const handleSubmit = (value) => {
		onSubmit(value);
		setHealth(0);
	};

	return (
		<div className="add-pokemon">
			<h2>Add a Pokémon</h2>
			<p>Max Health: <strong>{health}</strong></p>
			<NumberPad
				value={health}
				onChange={setHealth}
				onClear={handleClear}
				onSubmit={handleSubmit}
			/>
			<Button onClick={onEndGame}>End Game</Button>
		</div>
	);
};

export default AddPokemon;
