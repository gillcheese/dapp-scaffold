import React, { useCallback, useEffect, useMemo, useState } from "react"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
  CandyGuard,
  CandyMachine,
  DefaultGuardSetMintArgs,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine"
import { publicKey, some, unwrapOption } from "@metaplex-foundation/umi"
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine"
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters"
import { mintV2 } from "@metaplex-foundation/mpl-candy-machine"
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox"
import { transactionBuilder, generateSigner } from "@metaplex-foundation/umi"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Head from "next/head"

import { fromTxError } from "../../utils/errors"

if (!process.env.NEXT_PUBLIC_RPC_ENDPOINT)
  throw new Error(
    "No RPC endpoint. Please, provide a NEXT_PUBLIC_RPC_ENDPOINT env variable"
  )

// Use the RPC endpoint of your choice.
const umi = createUmi(process.env.NEXT_PUBLIC_RPC_ENDPOINT).use(
  mplCandyMachine()
)

const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
export const MintView: FC = ({ }) => {

  const [candyMachine, setCandyMachine] = useState<CandyMachine | null>(null)
  const [candyGuard, setCandyGuard] = useState<CandyGuard | null>(null)
  const wallet = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState<string | null>(null)

  const fetchCandyMachineData = useCallback(async () => {
    if (!candyMachineId)
      throw new Error(
        "Please, provide a NEXT_PUBLIC_CANDY_MACHINE_ID env variable"
      )
    const candyMachinePublicKey = publicKey(candyMachineId)
    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey)
    const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

    setCandyMachine(candyMachine)
    setCandyGuard(candyGuard)
  }, [candyMachineId])

  // Fetch candy machine on mount
  useEffect(() => {
    fetchCandyMachineData()
  }, [fetchCandyMachineData])

  const solPaymentGuard = useMemo(() => {
    return candyGuard ? unwrapOption(candyGuard.guards.solPayment) : null
  }, [candyGuard])

  const cost = useMemo(
    () =>
      candyGuard
        ? solPaymentGuard
          ? Number(solPaymentGuard.lamports.basisPoints) / 1e9 + " SOL"
          : "rock"
        : "...",
    [candyGuard]
  )

  /**
   * Setup guards arguments and mint from the candy machine
   */
  const mint = async () => {
    if (!candyMachine) throw new Error("No candy machine")
    if (!candyGuard)
      throw new Error(
        "No candy guard found. Set up a guard for your candy machine."
      )

    setIsLoading(true)
    const { guards } = candyGuard

    const enabledGuardsKeys =
      guards && Object.keys(guards).filter((guardKey) => guards[guardKey])

    let mintArgs: Partial<DefaultGuardSetMintArgs> = {}

    // If there are enabled guards, set the mintArgs
    if (enabledGuardsKeys.length) {
      // Map enabled guards and set mintArgs automatically based on the fields defined in each guard
      enabledGuardsKeys.forEach((guardKey) => {
        const guardObject = unwrapOption(candyGuard.guards[guardKey])
        if (!guardObject) return null

        mintArgs = { ...mintArgs, [guardKey]: some(guardObject) }
      })
    }

    const umiWalletAdapter = umi.use(walletAdapterIdentity(wallet))
    const nftMint = generateSigner(umiWalletAdapter)

    try {
      await transactionBuilder()
        .add(setComputeUnitLimit(umiWalletAdapter, { units: 800_000 }))
        .add(
          mintV2(umiWalletAdapter, {
            candyMachine: candyMachine.publicKey,
            nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            tokenStandard: candyMachine.tokenStandard,
            candyGuard: candyGuard?.publicKey,
            mintArgs,
          })
        )
        .sendAndConfirm(umiWalletAdapter)

      setFormMessage("Minted successfully!")
    } catch (e: any) {
      const msg = fromTxError(e)

      if (msg) {
        setFormMessage(msg.message)
      } else {
        const msg = e.message || e.toString()
        setFormMessage(msg)
      }
    } finally {
      setIsLoading(false)

      setTimeout(() => {
        setFormMessage(null)
      }, 5000)
    }

    setIsLoading(false)
  }


  return (
    <>
      <Head>
        <title>Rocks</title>
        <meta name="description" content="Get your unique NFT now!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "96px 0",
          }}
        >
        <h1 
          style={{marginBottom:"32px", fontSize: "22pt"
          }}>
          Mint a Rock wif $STICK!</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              alignItems: "center",
            }}
          >

            <img
              style={{ maxWidth: "396px", borderRadius: "8px" }}
              // src={collection?.json?.image}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // background: "#111",
                padding: "32px 24px",
                borderRadius: "16px",
                // border: "3px solid fuchsia",
                width: "400px",
                alignItems: "center"
              }}
            >
              
<br></br>
              <p style={{ color: "#FFFFFF", marginBottom: "32px" }}>
                Mint your rock NFT now. You need 696,696 STICK and 0.022 SOL for Analtonys Rent.
                <br></br>
                
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  
                  padding: "16px 12px",
                  borderRadius: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                 
                  
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                 
                  {/* <span style={{ fontSize: "11px" }}>512/1024</span> */}
                </div>
                <button className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black " disabled={!publicKey || isLoading} onClick={mint}>
            <span>{isLoading ? "Minting your NFT..." : "Mint"}</span>   
          </button>
                {/*<button disabled={!publicKey || isLoading} onClick={mint}>
                  {isLoading ? "Minting your NFT..." : "Mint"}
                </button>*/}
                <WalletMultiButton className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"

                />
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "4px",
                  }}
                >
                  {formMessage}
                </p>
              </div>
            </div>
          </div>
          <a href="https://birdeye.so/token/H6EnjZfQn3Dip84n8jhGA741fQ63bESUyd4bez2Qr9xB?chain=solana"><button className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black ">
            <span>Get $STICK</span>   
          </button></a>
        </main>
      </div>
    </>
  )
}
