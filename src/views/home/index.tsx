// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';

// Store
// import useUserSTICKBalanceStore from '../../stores/useUserSTICKBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  // const tokenAmount = useUserSTICKBalanceStore((s) => s.tokenAmount)
  // const { getUserSTICKBalance } = useUserSTICKBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      
    }
  }, [wallet.publicKey, connection])

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <div className='text-sm font-normal align-bottom text-right text-slate-600 mt-4'>v0.1</div>
        <h1 className="text-center text-5xl md:pl-12 font-bold  bg-clip-text bg-gradient-to-br from-black-500 to-fuchsia-500 ">
          Look at my Stick
        </h1>
        </div>
        <h4 className="text-sm  text-center text-slate-100 my-2">
          <p>Look at my stick I found it on Solanos!</p>
        </h4>
        {/*<p className='text-slate-500 text-2x1 leading-relaxed'>a indipendint dertist tokin</p>*/}
{/*        <div className="relative group">
          <div className="absolute bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-lg blur opacity-40 animate-tilt"></div>
            <pre data-prefix=">">
              <p><a href="https://birdeye.so/token/H6EnjZfQn3Dip84n8jhGA741fQ63bESUyd4bez2Qr9xB?chain=solana">Get $STICK</a></p>
            </pre>
        </div>*/}
        <div className=" flex-col mt-2 justify-center">
        <a href="https://birdeye.so/token/H6EnjZfQn3Dip84n8jhGA741fQ63bESUyd4bez2Qr9xB?chain=solana"><button className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black ">
            <span>Get $STICK</span>   
          </button></a>
          <a href="/mint"><button className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black">
            <span>Mint a Rock</span>   
          </button></a>
          
          
          <div className="flex flex-row justify-center">
             <div className='flex flex-row ml-1 mt-10'>

                    <Image
                      src="/yaytp.png"
                      alt="LAMS LOGO"
                      width={300}
                      height={96}
                    />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
