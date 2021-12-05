import { useState, useEffect } from 'react'

type Params = {
    token: "ethereum"
}

export default function useGeckoPrice({
    token
}: Params) {
    const [price, setPrice] = useState<number | null>(null)

    useEffect(() => {
        async function getPrice() {
            const tokenVsUSD = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`)
            const tokenVsUSDJSON = await tokenVsUSD.json()
            setPrice(tokenVsUSDJSON[token].usd)
        }
        getPrice()
    }, [])

    return price
}