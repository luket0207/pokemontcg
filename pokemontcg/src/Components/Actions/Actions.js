import { useState } from 'react';
import Button from '../Button/Button';
import './Actions.scss';

const Actions = ({
	onHeal,
	onNewMaxHealth,
	onPoison,
	onBurn,
	onConfuse,
	onParalyze,
	onSleep,
	onAttack,
	onEndTurn
}) => {
	const [showEffects, setShowEffects] = useState(false);

	return (
		<div className="actions">
			{/* Toggle effects visibility */}
			<Button onClick={() => setShowEffects(prev => !prev)}>
				{showEffects ? 'Hide Effects' : 'Show Effects'}
			</Button>

			{showEffects && (
				<div className="status-effects">
					<Button onClick={onPoison}>Poison Opponent</Button>
					<Button onClick={onBurn}>Burn Opponent</Button>
					<Button onClick={onConfuse}>Confuse Opponent</Button>
					<Button onClick={onParalyze}>Paralyze Opponent</Button>
					<Button onClick={onSleep}>Make Opponent Fall Asleep</Button>
				</div>
			)}

			{/* Regular actions */}
			<Button onClick={onHeal}>Heal</Button>
			<Button onClick={onNewMaxHealth}>New Max Health</Button>
			<Button onClick={onAttack}>Attack</Button>
			<Button onClick={onEndTurn}>End Turn</Button>
		</div>
	);
};

export default Actions;
