import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

interface CoinContextType {
    solPrice: number | null;
    setSolPrice: React.Dispatch<React.SetStateAction<number | null>>;
    fetchCall: number | null;
    setFetchCall: React.Dispatch<React.SetStateAction<number>>;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const CoinContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [solPrice, setSolPrice] = useState<number | null>(null);
    const [fetchCall, setFetchCall] = useState<number>(1);

  const fetchSol = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/sol_usdc`
      );
    //   console.log(response.data[0].price);
      setSolPrice(response.data[0].price);
    } catch (error) {
      console.error("Error fetching Solana price:", error);
    }
  };

  useEffect(() => {
    fetchSol(); // Initial fetch
  }, [fetchCall]);

  return (
    <CoinContext.Provider value={{ solPrice, fetchCall , setFetchCall, setSolPrice}}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoinContext = (): CoinContextType => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error("useCoinContext must be used within a CoinContextProvider");
  }
  return context;
};