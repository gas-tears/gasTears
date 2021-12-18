import { useState, useEffect } from "react"
import useGeckoPrice, { VSCurrencies } from 'hooks/useGeckoPrice'

type Params = {
    addresses: string[],
    viewCurrency: VSCurrencies
}

type Overview = {
    totalGas: number,
    totalTransactions: number,
    totalSuccessTransactions: number,
    totalFailedTransactions: number,
}

export default function useSummaryData({
    addresses,
    viewCurrency
}: Params) {
    const price = useGeckoPrice({ tokens: ["ethereum"] })

    const [walletToTransactionsMap, setWalletToTransactionsMap] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [walletInfoArray, setWalletInfoArray] = useState<any[]>([])
    const [totalOverview, setTotalOverview] = useState<Overview>()

    useEffect(() => {
        if (addresses?.length === 0) return

        const getTransactions = async () => {
            setIsLoading(true)
            const apiRes = await fetch("/api/explorer", {
                method: "POST",
                body: JSON.stringify({
                    addresses
                })
            })
            const apiJSON = await apiRes.json()
            setIsLoading(false)
            setWalletToTransactionsMap(apiJSON.addressToTransactionsMap)
        }
        getTransactions()
    }, [addresses])

    useEffect(() => {
        if (!walletToTransactionsMap || !price) return

        const overview: Overview = {
            totalGas: 0,
            totalTransactions: 0,
            totalSuccessTransactions: 0,
            totalFailedTransactions: 0,
        }

        const walletInfos = Object
            .entries(walletToTransactionsMap)
            .map(([address, transactions]) => {
                if (!transactions || !Array.isArray(transactions)) return { address, totalGasInSelectedCurrency: 0 }
                const totalGas = transactions
                    .filter((transaction) => transaction.from === address.toLowerCase())
                    .reduce((total, currentTransaction) => {
                        overview["totalTransactions"] += 1
                        if (currentTransaction.isError === "1") {
                            overview["totalFailedTransactions"] += 1
                        } else {
                            overview["totalSuccessTransactions"] += 1
                        }

                        const gas = parseFloat(currentTransaction.gasUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
                        return total + gas
                    }, 0)

                const totalGasInSelectedCurrency = totalGas * price["ethereum"][viewCurrency.toLowerCase()]
                overview["totalGas"] += totalGasInSelectedCurrency
                return { address, totalGasInSelectedCurrency }
            })
        setTotalOverview(overview)
        setWalletInfoArray(walletInfos)
    }, [walletToTransactionsMap, price, viewCurrency])

    return {
        totalOverview,
        walletInfoArray,
        isLoading,
        walletToTransactionsMap
    }
} 
