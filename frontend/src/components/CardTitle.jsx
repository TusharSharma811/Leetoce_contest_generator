// filepath: /my-react-app/my-react-app/src/components/ui/CardTitle.jsx
import React from 'react';

const CardTitle = ({ children }) => {
    return (
        <h2 className="text-xl font-bold">
            {children}
        </h2>
    );
};

export default CardTitle;