import { useState } from 'react';
import Button from '../Button/Button';
import './Actions.scss';

const Actions = ({
	onHeal,
	onNewMaxHealth,
	onNewPokemon,
	onPoison,
	onBurn,
	onConfuse,
	onParalyze,
	onSleep,
	onAttack,
	onEndTurn,
	currentEffects = []
}) => {
	const [showEffects, setShowEffects] = useState(false);

	const isDisabled = currentEffects.includes("asleep") || currentEffects.includes("paralyzed");

	return (
		<div className="actions">
			{/* Toggle effects visibility */}
			<Button onClick={() => setShowEffects(prev => !prev)}>
				{showEffects ? 'Hide Effects' : 'Show Effects'}
			</Button>

			{showEffects && (
				<div className="status-effects">
					<Button onClick={onPoison}>Poison</Button>
					<Button onClick={onBurn}>Burn</Button>
					<Button onClick={onConfuse}>Confuse</Button>
					<Button onClick={onParalyze}>Paralyze</Button>
					<Button onClick={onSleep}>Sleep</Button>
				</div>
			)}

			{/* Regular actions */}
			<Button onClick={onHeal}>Heal</Button>
			<Button onClick={onNewMaxHealth}>Increase Max Health</Button>
			<Button onClick={onNewPokemon} disabled={isDisabled}>New Pokemon</Button>
			<Button onClick={onAttack} disabled={isDisabled}>Attack</Button>
			<Button onClick={onEndTurn}>End Turn</Button>
		</div>
	);
};

export default Actions;
