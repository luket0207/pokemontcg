import './PokemonDisplay.scss';

const PokemonDisplay = ({ player1Pokemon, player2Pokemon, currentTurn }) => {
	const renderHealthBar = (label, pokemon) => {
		if (!pokemon) return (
			<div className="pokemon-block">
				<h2>{label}</h2>
				<p>No Pokémon</p>
			</div>
		);

		const { currentHealth, maxHealth } = pokemon;
		const healthPercentage = (currentHealth / maxHealth) * 100;

		const dangerThreshold = Math.min(20, maxHealth * 0.1);
		const isLowHealth = currentHealth < dangerThreshold;

		return (
			<div className="pokemon-block">
				<h2>{label}</h2>
				<div className="health-bar-wrapper">
					<div
						className={`health-bar ${isLowHealth ? 'low' : 'healthy'}`}
						style={{ width: `${healthPercentage}%` }}
					></div>
					<span className="health-label">
						{currentHealth} / {maxHealth} HP
					</span>
				</div>
			</div>
		);
	};

	const isPlayer1 = currentTurn === 'Player 1';

	const yourPokemon = isPlayer1 ? player1Pokemon : player2Pokemon;
	const theirPokemon = isPlayer1 ? player2Pokemon : player1Pokemon;

	return (
		<div className="status">
			{renderHealthBar("Their Pokémon", theirPokemon)}
			{renderHealthBar("Your Pokémon", yourPokemon)}
		</div>
	);
};

export default PokemonDisplay;
