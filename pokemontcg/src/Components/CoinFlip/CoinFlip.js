import { useEffect, useState } from 'react';
import './CoinFlip.scss';

const CoinFlip = ({ onResult }) => {
	const [side, setSide] = useState(null);
	const [flipping, setFlipping] = useState(true);

	useEffect(() => {
		// Start animation immediately
		const flipTimeout = setTimeout(() => {
			// Determine result after 1.5s
			const result = Math.random() < 0.5 ? 'heads' : 'tails';
			setSide(result);
			setFlipping(false);

			// Wait 1.5s more before notifying parent
			setTimeout(() => {
				onResult(result);
			}, 1500);
		}, 1500);

		return () => clearTimeout(flipTimeout);
	}, [onResult]);

	return (
		<div className={`coin ${flipping ? 'flipping' : ''} ${side ? side : ''}`}>
			<div className="face heads">Heads</div>
			<div className="face tails">Tails</div>
		</div>
	);
};

export default CoinFlip;
