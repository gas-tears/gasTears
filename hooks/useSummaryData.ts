import { useState, useEffect } from "react"
import useGeckoPrice, { VSCurrencies, GeckoCoins, TokenVSCurrencies } from 'hooks/useGeckoPrice'
import { Transaction } from "types"

type Params = {
    addresses: string[],
    viewCurrency: VSCurrencies,
    price: TokenVSCurrencies
}

type Overview = {
    totalGas: number,
    totalTransactions: number,
    totalSuccessTransactions: number,
    totalFailedTransactions: number,
}

type ChainOverview = {
    totalGasNative: number,
    totalGasUSD: number,
    totalTransactions: number,
    totalSuccessTransactions: number,
    totalFailedTransactions: number,
    transactions: Transaction[]
}

type ChainInfo = {
    [K in GeckoCoins]?: ChainOverview
}

export default function useSummaryData({
    addresses,
    viewCurrency,
    price
}: Params) {
    const [walletToTransactionsMap, setWalletToTransactionsMap] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [walletInfoArray, setWalletInfoArray] = useState<any[]>([])

    const [chainInfo, setChainInfo] = useState<ChainInfo>()
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

        //TODO: chainOverview and chainInfo are harcoded, 
        //will have to fill this out based on the chains that will be returned from the back end 
        const chainOverview: ChainOverview = {
            totalGasNative: 0,
            totalGasUSD: 0,
            totalTransactions: 0,
            totalFailedTransactions: 0,
            totalSuccessTransactions: 0,
            transactions: []
        }

        // Overview is computed while walletInfos is being extracted to save on operations
        const walletInfos = Object
            .entries(walletToTransactionsMap)
            .map(([address, transactions]) => {
                if (!transactions || !Array.isArray(transactions)) return { address, totalGasNative: 0 }

                const totalOutgoingTransactions: Transaction[] = transactions
                    .filter((transaction) => transaction.from === address.toLowerCase())//Only count transactions originated from the current address

                const totalGasNative = totalOutgoingTransactions
                    .reduce((total, currentTransaction) => {
                        chainOverview["totalTransactions"] += 1
                        if (currentTransaction.isError === "1") {
                            chainOverview["totalFailedTransactions"] += 1
                        } else {
                            chainOverview["totalSuccessTransactions"] += 1
                        }

                        const gas = parseFloat(currentTransaction.gasUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
                        return total + gas
                    }, 0)

                chainOverview["totalGasNative"] += totalGasNative
                chainOverview["transactions"] = chainOverview["transactions"].concat(totalOutgoingTransactions)
                return { address, totalGasNative }
            })

        const chainInfo: ChainInfo = {
            ethereum: chainOverview
        }

        setChainInfo(chainInfo)
        setWalletInfoArray(walletInfos)
    }, [walletToTransactionsMap, price])

    useEffect(() => {
        if (!chainInfo) return

        const overview: Overview = {
            totalGas: 0,
            totalTransactions: 0,
            totalSuccessTransactions: 0,
            totalFailedTransactions: 0,
        }

        Object.entries(chainInfo)
            .forEach(([chain, chainInfo]) => {
                const { totalGasNative } = chainInfo
                const totalGasInSelectedCurrency = totalGasNative * price[chain][viewCurrency.toLowerCase()]
                overview["totalGas"] += totalGasInSelectedCurrency
                overview["totalTransactions"] += chainInfo.transactions.length
                overview["totalSuccessTransactions"] += chainInfo.transactions.filter((transaction) => transaction.isError === "0").length
                overview["totalFailedTransactions"] += chainInfo.transactions.filter((transaction) => transaction.isError === "1").length
            })

        setTotalOverview(overview)
    }, [chainInfo, viewCurrency])

    return {
        totalOverview,
        chainInfo,
        walletInfoArray,
        isLoading,
        walletToTransactionsMap
    }
} 
