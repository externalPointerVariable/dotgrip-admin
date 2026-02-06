import React from 'react';
 const container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full h-full p-4">
      {children}
    </div>
  );
};

export default container;