import { formatCurrency } from "@coingecko/cryptoformat";
import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Chains, ChainOverviewMap, NetOverview, TokenVSCurrencies, ViewChains, VSCurrencies } from "types";

type Props = {
    address: string,
    walletSummary: ChainOverviewMap,
    price: TokenVSCurrencies,
    viewCurrency: VSCurrencies,
    selectedChain: ViewChains,
    isLoading?: boolean
}

const WalletOverview: React.FC<Props> = ({
    address,
    walletSummary,
    price,
    viewCurrency,
    selectedChain,
    isLoading = false
}) => {
    const aggregateSummary: NetOverview = useMemo(() => {
        return Object
            .entries(walletSummary)
            .reduce((summaryData, [chain, chainData]) => {
                summaryData.totalTransactions += chainData.totalTransactions
                summaryData.totalSuccessTransactions += chainData.totalSuccessTransactions
                summaryData.totalFailedTransactions += chainData.totalFailedTransactions
                summaryData.totalGas += chainData.totalGasNative * (price[chain as Chains]?.[viewCurrency] || 0)
                return summaryData
            }, new NetOverview())
    }, [walletSummary, viewCurrency])


    const selectedChainSummary: NetOverview = useMemo(() => {
        const summaryData = new NetOverview()

        if (selectedChain === "all" || !walletSummary[selectedChain]) return summaryData

        const selectedChainData = walletSummary[selectedChain]
        summaryData.totalTransactions += selectedChainData?.totalTransactions || 0
        summaryData.totalSuccessTransactions += selectedChainData?.totalSuccessTransactions || 0
        summaryData.totalFailedTransactions += selectedChainData?.totalFailedTransactions || 0
        summaryData.totalGas = (selectedChainData?.totalGasNative || 0) * (price[selectedChain as Chains]?.[viewCurrency] || 0)

        return summaryData
    }, [walletSummary, viewCurrency, selectedChain])

    const {
        totalGas,
        totalTransactions,
        totalSuccessTransactions,
        totalFailedTransactions
    } = selectedChain === "all" ? aggregateSummary : selectedChainSummary

    if (isLoading) return <Skeleton height={80} borderRadius={10} style={{ marginBottom: 10 }} />

    return (
        <div className='walletOverviewSection'>
            <h2 className='walletOverviewName'>{address}</h2>
            <div className="walletOverviewWrapper tilePrimary">
                <div className="walletOverviewSummaryGrid">
                    <SummaryTile title="Gas Fees" displayValue={formatCurrency(totalGas, viewCurrency)} />
                    <SummaryTile title="Transactions" displayValue={totalTransactions} />
                    <SummaryTile title="Successful Transactions" displayValue={totalSuccessTransactions} />
                    <SummaryTile title="Failed Transactions" displayValue={totalFailedTransactions} />
                </div>
            </div>
        </div>
    );
};

type SummaryTileProps = {
    title: string,
    displayValue: string | number,
}

const SummaryTile: React.FC<SummaryTileProps> = ({ title, displayValue }) => {
    return (
        <div className='walletSummaryItem'>
            <div className='walletSummaryItemTitle'>{title}</div>
            <div className="walletSummaryitemValue">{displayValue}</div>
        </div>
    )
}

export default WalletOverview;