import Button from '../Button/Button';
import './NumberPad.scss';

const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const hundreds = [100, 200, 300, 400, 500];

const NumberPad = ({ onSubmit, onClear, onChange, value }) => {
	const handleAdd = (num) => {
		const newValue = value + num;
		onChange(newValue);
	};

	return (
		<div className="number-pad">
			<div className="number-display">
				<p><strong>{value}</strong></p>
			</div>

			<div className="row">
				{hundreds.map((num) => (
					<div key={num} className='hundred' onClick={() => handleAdd(num)}><p>{num}</p></div>
				))}
			</div>
			<div className="row">
				{tens.map((num) => (
					<div key={num} className='ten' onClick={() => handleAdd(num)}><p>{num}</p></div>
				))}
			</div>
			<div className="buttons">
				<Button onClick={onClear}>Clear</Button>
				<Button onClick={() => onSubmit(value)} disabled={value <= 0}>Submit</Button>
			</div>
		</div>
	);
};

export default NumberPad;
