import { useState, useEffect } from "react"
import { TokenVSCurrencies } from 'hooks/useGeckoPrice'
import {
    ExplorerResponse,
    Transaction,
    VSCurrencies,
    ChainOverviewMap,
    WalletOverviewMap,
    SummaryData,
    NetOverview,
    WalletChainSummaryData
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
                ...acc, [chain]: new SummaryData()
            }), {})

        // Overview is computed while walletOverviewMap is being extracted to save on operations
        const walletOverviewMap: WalletOverviewMap = {}
        Object.entries(chainToAddressesMap)
            .forEach(([chain, addressToTransactionsMap]) => {
                Object.entries(addressToTransactionsMap)
                    .forEach(([address, transactions]) => {
                        // If no array was returned, the return for this address is an error 
                        // therefore we don't want to include it in the overview
                        if (!Array.isArray(transactions) || !transactions) return

                        if (!(address in walletOverviewMap)) {
                            walletOverviewMap[address] = {};
                        }

                        // if (!transactions) {
                        //     walletOverviewMap[address][chain] = new SummaryData()
                        //     return
                        // }

                        const totalOutgoingTransactions: Transaction[] = transactions
                            .filter((transaction) => transaction.from === address.toLowerCase()) //Only count transactions originated from the current address

                        const summaryData = totalOutgoingTransactions
                            .reduce((overview, currentTransaction) => {
                                overview["totalTransactions"] += 1
                                if (currentTransaction.isError === "1") {
                                    overview["totalFailedTransactions"] += 1
                                } else {
                                    overview["totalSuccessTransactions"] += 1
                                }

                                const gas = parseFloat(currentTransaction.gasUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
                                overview["totalGasNative"] += gas
                                return overview
                            }, new SummaryData())

                        chainOverviewMap[chain]["totalGasNative"] += summaryData.totalGasNative
                        chainOverviewMap[chain]["totalTransactions"] += summaryData.totalTransactions
                        chainOverviewMap[chain]["totalFailedTransactions"] += summaryData.totalFailedTransactions
                        chainOverviewMap[chain]["totalSuccessTransactions"] += summaryData.totalSuccessTransactions
                        chainOverviewMap[chain]["transactions"] = chainOverviewMap[chain]["transactions"].concat(totalOutgoingTransactions)

                        walletOverviewMap[address][chain] = summaryData
                    })
            })

        setChainOverviewMap(chainOverviewMap)
        setWalletOverviewMap(walletOverviewMap)
    }, [chainToAddressesMap, price])

    useEffect(() => {
        if (!chainOverviewMap) return

        const overview = new NetOverview()

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
