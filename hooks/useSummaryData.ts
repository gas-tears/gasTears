import { useEffect, useState } from "react"
import {
    ChainOverviewMap, Chains, ExplorerResponse, NetOverview, SummaryData, TokenVSCurrencies, Transaction,
    VSCurrencies, WalletOverviewMap
} from "types"

type Params = {
    addresses: string[],
    viewCurrency: VSCurrencies,
    price: TokenVSCurrencies
}

type ReturnObject = {
    netOverview : NetOverview,
    chainOverviewMap : ChainOverviewMap,
    walletOverviewMap: WalletOverviewMap,
    isLoading: boolean,
    chainToAddressesMap: ExplorerResponse
}

export default function useSummaryData({
    addresses,
    viewCurrency,
    price
}: Params) : ReturnObject {
    const emptyChainOverviewMap : ChainOverviewMap = {
        "avalanche-2": new SummaryData,
        "binancecoin": new SummaryData,
        "ethereum": new SummaryData,
        "fantom": new SummaryData,
        "matic-network": new SummaryData,
    }

    const emptyExplorerResponse : ExplorerResponse = {
        "avalanche-2": {},
        "binancecoin": {},
        "ethereum": {},
        "fantom": {},
        "matic-network": {},
    }

    const [chainToAddressesMap, setChainToAddressesMap] = useState<ExplorerResponse>(emptyExplorerResponse)
    const [isLoading, setIsLoading] = useState(false)
    const [walletOverviewMap, setWalletOverviewMap] = useState<WalletOverviewMap>({})
    const [chainOverviewMap, setChainOverviewMap] = useState<ChainOverviewMap>(emptyChainOverviewMap)
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

        const chainOverviewMap: ChainOverviewMap = {
            "avalanche-2": new SummaryData(),
            binancecoin: new SummaryData(),
            ethereum: new SummaryData(),
            fantom: new SummaryData(),
            "matic-network": new SummaryData()
        }

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
                            walletOverviewMap[address] = {
                                "avalanche-2": new SummaryData(),
                                binancecoin: new SummaryData(),
                                ethereum: new SummaryData(),
                                fantom: new SummaryData(),
                                "matic-network": new SummaryData() 
                            };
                        }

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

                        chainOverviewMap[chain as Chains]["totalGasNative"] += summaryData.totalGasNative
                        chainOverviewMap[chain as Chains]["totalTransactions"] += summaryData.totalTransactions
                        chainOverviewMap[chain as Chains]["totalFailedTransactions"] += summaryData.totalFailedTransactions
                        chainOverviewMap[chain as Chains]["totalSuccessTransactions"] += summaryData.totalSuccessTransactions
                        chainOverviewMap[chain as Chains]["transactions"] = chainOverviewMap[chain as Chains]["transactions"].concat(totalOutgoingTransactions)

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
                const { totalGasNative } = chainInfo
                const totalGasInSelectedCurrency = totalGasNative * (price?.[chain as Chains]?.[viewCurrency] || 0)
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
