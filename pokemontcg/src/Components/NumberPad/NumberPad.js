import './NumberPad.scss';

const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const hundreds = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const NumberPad = ({ onSubmit, onClear, onChange, value }) => {
	const handleAdd = (num) => {
		const newValue = value + num;
		onChange(newValue);
	};

	return (
		<div className="number-pad">
			<div className="number-display">
				<p>Selected: <strong>{value}</strong></p>
			</div>

			<div className="row">
				{hundreds.map((num) => (
					<button key={num} onClick={() => handleAdd(num)}>{num}</button>
				))}
			</div>
			<div className="row">
				{tens.map((num) => (
					<button key={num} onClick={() => handleAdd(num)}>{num}</button>
				))}
			</div>
			<div className="row">
				<button onClick={onClear}>Clear</button>
				<button onClick={() => onSubmit(value)} disabled={value <= 0}>Submit</button>
			</div>
		</div>
	);
};

export default NumberPad;
