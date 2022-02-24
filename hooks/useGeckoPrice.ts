import { useEffect, useState } from 'react'
import { Chains, TokenVSCurrencies, VSCurrencies } from 'types'

export type Params = {
    tokens?: Chains[],
    vsCurrencies?: VSCurrencies[]
}

export default function useGeckoPrice({
    tokens = ["avalanche-2", "binancecoin", "ethereum", "fantom", "matic-network", "hoo-token"],
    vsCurrencies = ["usd", "cad", "btc", "eth"]
}: Params): TokenVSCurrencies {
    const [prices, setPrices] = useState<TokenVSCurrencies>()

    useEffect(() => {
        async function getPrices() {
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(",")}&vs_currencies=${vsCurrencies.join(",")}`)
            const tokensVsCurrencies = await res.json()
            setPrices(tokensVsCurrencies)
        }
        getPrices()
    }, [])

    return prices!
}