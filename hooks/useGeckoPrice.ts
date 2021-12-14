import { useState, useEffect } from 'react'

export type GeckoCoins = "ethereum" | "binancecoin" | "solana" | "fantom" | "matic-network" | "avalanche-2" | "terra-luna"
export type VSCurrencies = "usd" | "cad" | "eth" | "btc"

type Params = {
    tokens?: GeckoCoins[],
    vsCurrencies?: VSCurrencies[]
}

type TokenVSCurrencies = {
    [C in GeckoCoins]?: {
        [C in VSCurrencies]?: number
    }
}

export default function useGeckoPrice({
    tokens = ["ethereum", "binancecoin", "solana", "fantom", "matic-network", "avalanche-2", "terra-luna"],
    vsCurrencies = ["usd", "cad", "eth", "btc"]
}: Params) {
    const [prices, setPrices] = useState<TokenVSCurrencies>()

    useEffect(() => {
        async function getPrices() {
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(",")}&vs_currencies=${vsCurrencies.join(",")}`)
            const tokensVsCurrencies = await res.json()
            setPrices(tokensVsCurrencies)
        }
        getPrices()
    }, [])

    return prices
}