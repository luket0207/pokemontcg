import './Button.scss';

const Button = ({ children, onClick, disabled = false }) => {
	return (
		<button
			className={`btn ${disabled ? 'btn--disabled' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
