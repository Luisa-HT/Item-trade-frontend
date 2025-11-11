import React from 'react';
import './Button.css'; // We'll create this file next

/**
 * A reusable button component with different visual styles.
 *
 * @param {Object} props
 * @param {React.Node} props.children - The text or icon inside the button.
 * @param {Function} props.onClick - The function to call when clicked.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The HTML button type.
 * @param {'primary' | 'secondary' | 'danger'} [props.variant='primary'] - The visual style.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 */
const Button = ({
                    children,
                    onClick,
                    type = 'button',
                    variant = 'primary',
                    className = '',
                    disabled = false,
                }) => {
    // We combine the base class, the variant class, and any extra classes
    const buttonClassName = `
    btn
    btn-${variant}
    ${className}
  `.trim();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonClassName}
        >
            {children}
        </button>
    );
};

export default Button;