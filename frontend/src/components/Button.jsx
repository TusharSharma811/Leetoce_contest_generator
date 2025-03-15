// filepath: /my-react-app/my-react-app/src/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;