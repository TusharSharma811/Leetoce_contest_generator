import React from 'react';

const Badge = ({ children, className }) => {
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full ${className}`}>
      {children}
    </span>
  );
};

export default Badge;