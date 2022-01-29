import { useEffect, useState } from 'react'
import { Chains, VSCurrencies, TokenVSCurrencies } from 'types'

type Params = {
    tokens?: Chains[],
    vsCurrencies?: VSCurrencies[]
}

export default function useGeckoPrice({
    tokens = ["ethereum", "binancecoin", "fantom", "matic-network", "avalanche-2"],
    vsCurrencies = ["usd", "cad", "eth", "btc"]
}: Params) {
    const [prices, setPrices] = useState<TokenVSCurrencies>({})

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