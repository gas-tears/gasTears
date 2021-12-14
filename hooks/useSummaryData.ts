import { useState, useEffect } from "react"
import useGeckoPrice, { VSCurrencies } from 'hooks/useGeckoPrice'

type Params = {
    addresses: string[],
    viewCurrency: VSCurrencies
}

export default function useSummaryData({
    addresses,
    viewCurrency
}: Params) {
    const price = useGeckoPrice({ tokens: ["ethereum"] })

    const [walletToTransactionsMap, setWalletToTransactionsMap] = useState()
    const [data, setData] = useState([])

    useEffect(() => {
        if (addresses?.length === 0) return
        const getTransactions = async () => {
            const apiRes = await fetch("/api/explorer", {
                method: "POST",
                body: JSON.stringify({
                    addresses
                })
            })
            const apiJSON = await apiRes.json()
            setWalletToTransactionsMap(apiJSON.addressToTransactionsMap)
        }
        getTransactions()
    }, [addresses])

    useEffect(() => {
        if (!walletToTransactionsMap || !price) return

        const data = Object
            .entries(walletToTransactionsMap)
            .map(([address, transactions]) => {
                if (!transactions || !Array.isArray(transactions)) return { address, totalGasInUSD: 0 }
                const totalGas = transactions
                    .filter((transaction) => transaction.from === address.toLowerCase())
                    .reduce((total, currentTransaction) => {
                        const gas = parseFloat(currentTransaction.gasUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
                        return total + gas
                    }, 0)
                const totalGasInUSD = totalGas * price["ethereum"][viewCurrency]
                return { address, totalGasInUSD }
            })
        setData(data)
    }, [walletToTransactionsMap, price, viewCurrency])

    return data
} 