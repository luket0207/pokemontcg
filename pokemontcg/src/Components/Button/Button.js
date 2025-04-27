import './Button.scss';

const Button = ({ children, onClick, disabled = false, type = "primary" }) => {
	return (
		<button
			className={`btn btn--${type} ${disabled ? 'btn--disabled' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
