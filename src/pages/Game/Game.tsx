import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"

import { Input } from "../../components/ui/input"
import { Button } from '../../components/ui/button';
import { useCoinContext } from '../../context/CoinContext.tsx';
import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';


export function Game2() {
  const { solPrice, setFetchCall } = useCoinContext();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const connection = new Connection(clusterApiUrl('devnet'));

  useEffect(() => {
    const interval = setInterval(() => {
      setFetchCall(prev => (prev !== null ? prev + 1 : 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [setFetchCall]);

  useEffect(() => {
    if (publicKey) {
      const fetchBalance = async () => {
        const walletBalance = await getWalletBalance(publicKey.toString());
        setBalance(walletBalance);
      };

      fetchBalance();
    }
  }, [publicKey]);

  const getWalletBalance = async (walletAddress: string) => {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  };

  return (
    <Card style={{ fontFamily: "landingpgFont" }}>
      <CardHeader>
        <CardTitle>Solana</CardTitle>
        <h1>{solPrice !== null ? `${solPrice} USD` : "Loading..."}</h1>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <WalletMultiButton />
          {publicKey && (
            <>
              <p>Wallet Address: {publicKey.toString()}</p>
              {balance !== null && (
                <p>Wallet Balance: {balance} SOL</p>
              )}
            </>
          )}
          <p>Odds:</p>
          <div className='flex flex-row space-x-6 py-5'>
            <button>
              <img src="../../BetUp.png" height={"40px"} width={"40px"} />
            </button>
            <button>
              <img src="../../BetDown.png" height={"40px"} width={"40px"} />
            </button>
          </div>
          <div className='flex flex-col'>
            <p>Enter bet amount in SOL below:</p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="number" placeholder="Enter Amount" min={0.000000001} />
              <Button type="submit">Place Bet</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}