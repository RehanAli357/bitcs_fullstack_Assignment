import React, { createContext, useState } from 'react';

export const BikeContext = createContext();

export const BikeProvider = ({ children }) => {
  const [bike, setBike] = useState({
    bId: '',
    bName: '',
    bPrice: '',
    available: '',
  });

  return (
    <BikeContext.Provider value={{ bike, setBike }}>
      {children}
    </BikeContext.Provider>
  );
};
