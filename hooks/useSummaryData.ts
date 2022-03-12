import { useEffect, useState } from "react"
import {
    ChainOverviewMap, Chains, ExplorerResponse, TokenVSCurrencies, Transaction,
    VSCurrencies, WalletOverviewMap
} from "types"
import { initChainOverviewMap, initExplorerResponse } from "utils/Common"
import { SummaryData, NetOverview } from "utils/classes"

type Params = {
    addresses: string[],
    viewCurrency: VSCurrencies,
    price: TokenVSCurrencies
}

type ReturnObject = {
    netOverview: NetOverview,
    chainOverviewMap: ChainOverviewMap,
    walletOverviewMap: WalletOverviewMap,
    isLoading: boolean,
    chainToAddressesMap: ExplorerResponse
}


export default function useSummaryData({
    addresses,
    viewCurrency,
    price
}: Params): ReturnObject {
    const [isLoading, setIsLoading] = useState(false)

    const [chainToAddressesMap, setChainToAddressesMap] = useState<ExplorerResponse>(() => initExplorerResponse())
    const [walletOverviewMap, setWalletOverviewMap] = useState<WalletOverviewMap>({})
    const [chainOverviewMap, setChainOverviewMap] = useState<ChainOverviewMap>(() => initChainOverviewMap())
    const [netOverview, setNetOverview] = useState<NetOverview>(new NetOverview())

    useEffect(() => {
        if (!addresses?.length) return

        const getTransactions = async () => {
            setIsLoading(true)
            const apiRes = await fetch("https://gas-tears.herokuapp.com/explorer", {
                method: "POST",
                body: JSON.stringify({
                    addresses
                }),
                credentials: 'include',
            })
            const apiJSON = await apiRes.json()
            setIsLoading(false)
            setChainToAddressesMap(apiJSON)
        }
        getTransactions()
    }, [addresses])

    useEffect(() => {
        if (!chainToAddressesMap || !price) return

        const chainOverviewMap = initChainOverviewMap()

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
                            walletOverviewMap[address] = initChainOverviewMap();
                        }

                        const totalOutgoingTransactions: Transaction[] = transactions
                            .filter((transaction) => transaction.from === address.toLowerCase()) //Only count transactions originated from the current address

                        const summaryData = totalOutgoingTransactions
                            .reduce((overview, currentTransaction) => {
                                overview["totalTransactions"] += 1
                                overview[currentTransaction.isError === "1" ? "totalFailedTransactions" : "totalSuccessTransactions"] += 1

                                const gas = parseFloat(currentTransaction.gasUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
                                overview["totalGasNative"] += gas
                                return overview
                            }, new SummaryData())

                        const chainInfo = chainOverviewMap[chain as Chains]
                        chainInfo["totalGasNative"] += summaryData.totalGasNative
                        chainInfo["totalTransactions"] += summaryData.totalTransactions
                        chainInfo["totalFailedTransactions"] += summaryData.totalFailedTransactions
                        chainInfo["totalSuccessTransactions"] += summaryData.totalSuccessTransactions
                        chainInfo["transactions"] = chainInfo["transactions"].concat(totalOutgoingTransactions)

                        walletOverviewMap[address][chain as Chains] = summaryData
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
                const totalGasInSelectedCurrency = chainInfo.totalGasNative * (price?.[chain as Chains]?.[viewCurrency] || 0)
                overview.updateTotals(totalGasInSelectedCurrency, chainInfo)
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
