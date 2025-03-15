import React from 'react';


const Card = ({ title, children, className }) => {
    return (
        <div className={`card ${className || ''}`}>
            {title && <div className="card-header">{title}</div>}
            <div className="card-content">{children}</div>
        </div>
    );
};

export default Card;