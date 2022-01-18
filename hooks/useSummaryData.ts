import { useState, useEffect } from "react"
import { TokenVSCurrencies } from 'hooks/useGeckoPrice'
import {
    ExplorerResponse,
    Transaction,
    VSCurrencies,
    ChainOverviewMap,
    WalletOverviewMap,
    ChainOverview,
    NetOverview
} from "types"

type Params = {
    addresses: string[],
    viewCurrency: VSCurrencies,
    price: TokenVSCurrencies
}

export default function useSummaryData({
    addresses,
    viewCurrency,
    price
}: Params) {
    const [chainToAddressesMap, setChainToAddressesMap] = useState<ExplorerResponse>({})
    const [isLoading, setIsLoading] = useState(false)
    const [walletOverviewMap, setWalletOverviewMap] = useState<WalletOverviewMap>({})
    const [chainOverviewMap, setChainOverviewMap] = useState<ChainOverviewMap>({})
    const [netOverview, setNetOverview] = useState<NetOverview>(new NetOverview())

    useEffect(() => {
        if (!addresses?.length) return

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
            setChainToAddressesMap(apiJSON)
        }
        getTransactions()
    }, [addresses])

    useEffect(() => {
        if (!chainToAddressesMap || !price) return

        const chainOverviewMap: ChainOverviewMap = Object
            .keys(chainToAddressesMap)
            .reduce((acc, chain) => ({
                ...acc, [chain]: new ChainOverview()
            }), {})

        // Overview is computed while walletOverviewMap is being extracted to save on operations
        const walletOverviewMap: WalletOverviewMap = {}
        Object.entries(chainToAddressesMap)
            .forEach(([chain, addressToTransactionsMap]) => {
                Object.entries(addressToTransactionsMap)
                    .forEach(([address, transactions]) => {
                        if (!(address in walletOverviewMap)) {
                            walletOverviewMap[address] = [];
                        }

                        if (!transactions || !Array.isArray(transactions)) {
                            walletOverviewMap[address].push({ chain, totalGasNative: 0, totalGasUSD: 0 })
                            return
                        }

                        const totalOutgoingTransactions: Transaction[] = transactions
                            .filter((transaction) => transaction.from === address.toLowerCase()) //Only count transactions originated from the current address

                        const totalGasNative = totalOutgoingTransactions
                            .reduce((acc, currentTransaction) => {
                                chainOverviewMap[chain]["totalTransactions"] += 1
                                if (currentTransaction.isError === "1") {
                                    chainOverviewMap[chain]["totalFailedTransactions"] += 1
                                } else {
                                    chainOverviewMap[chain]["totalSuccessTransactions"] += 1
                                }

                                const gas = parseFloat(currentTransaction.gasUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
                                return acc + gas
                            }, 0)

                        const totalGasUSD = totalGasNative * price[chain]["usd"]

                        chainOverviewMap[chain]["totalGasNative"] += totalGasNative
                        chainOverviewMap[chain]["totalGasUSD"] += totalGasUSD
                        chainOverviewMap[chain]["transactions"] = chainOverviewMap[chain]["transactions"].concat(totalOutgoingTransactions)
                        walletOverviewMap[address].push({ chain, totalGasNative, totalGasUSD })
                    })
            })

        setChainOverviewMap(chainOverviewMap)
        setWalletOverviewMap(walletOverviewMap)
    }, [chainToAddressesMap, price])

    useEffect(() => {
        if (!chainOverviewMap) return

        const overview: NetOverview = {
            totalGas: 0,
            totalTransactions: 0,
            totalSuccessTransactions: 0,
            totalFailedTransactions: 0,
        }

        Object
            .entries(chainOverviewMap)
            .forEach(([chain, chainInfo]) => {
                const { totalGasNative } = chainInfo
                const totalGasInSelectedCurrency = totalGasNative * price[chain][viewCurrency.toLowerCase()]
                overview["totalGas"] += totalGasInSelectedCurrency
                overview["totalTransactions"] += chainInfo.transactions.length
                overview["totalSuccessTransactions"] += chainInfo.transactions.filter((transaction) => transaction.isError === "0").length
                overview["totalFailedTransactions"] += chainInfo.transactions.filter((transaction) => transaction.isError === "1").length
            })

        setNetOverview(overview)
    }, [chainOverviewMap, viewCurrency])

    return {
        netOverview,
        chainOverviewMap,
        walletOverviewMap,
        isLoading,
        chainToAddressesMap
    }
} 
