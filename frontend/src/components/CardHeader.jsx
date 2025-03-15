import React from 'react';


const CardHeader = ({ children, className }) => {
  return (
    <div className={`border-b p-4 ${className}`}>
      {children}
    </div>
  );
};

export default CardHeader;