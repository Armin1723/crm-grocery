  import React, { createContext, useContext } from 'react';

const SaleContext = createContext();

export const useSale = () => useContext(SaleContext);

export const SaleProvider = ({ children, sale }) => {
  return (
    <SaleContext.Provider value={sale}>
      {children}
    </SaleContext.Provider>
  );
};