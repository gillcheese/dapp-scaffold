import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const tokenAddress = "H6EnjZfQn3Dip84n8jhGA741fQ63bESUyd4bez2Qr9xB"

interface UserSTICKBalanceStore extends State {
  tokenAmount: number;
  getUserSTICKBalance: (publicKey: PublicKey, connection: Connection) => void
}

const useUserSTICKBalanceStore = create<UserSTICKBalanceStore>((set, _get) => ({
  tokenAmount: 0,
  getUserSTICKBalance: async (publicKey, connection) => {
    let tokenAmount = 0;
    try {
      tokenAmount = await connection.getTokenAccountBalance(
        tokenAddress
        
      );
        tokenAmount = tokenAmount / LAMPORTS_PER_SOL;
    } catch (e) {
      console.log(`error getting balance: `, e);
    }
    set((s) => {
      s.tokenAmount = tokenAmount;
      console.log(`balance updated, `, tokenAmount);
    })
  },
}));

export default useUserSTICKBalanceStore;