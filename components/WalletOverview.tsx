import { formatCurrency } from "@coingecko/cryptoformat";
import classNames from "classnames";
import { default as React, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ChainOverviewMap, Chains, TokenVSCurrencies, ViewChains, VSCurrencies } from "types";
import { chainLabelMapping } from "../utils/labels";
import Icon from "./Icon/Icon";
import { NetOverview } from "utils/classes"

type Props = {
    address: string,
    walletSummary: ChainOverviewMap,
    price: TokenVSCurrencies,
    viewCurrency: VSCurrencies,
    isLoading?: boolean
}

const WalletOverview: React.FC<Props> = ({
    address,
    walletSummary,
    price,
    viewCurrency,
    isLoading = false
}) => {
    const [selectedChain, setSelectedChain] = useState<ViewChains>("all")

    const aggregateSummary: NetOverview = useMemo(() => {
        return Object
            .entries(walletSummary)
            .reduce((summaryData, [chain, chainData]) => {
                const totalGas = chainData.totalGasNative * (price?.[chain as Chains]?.[viewCurrency] || 0)
                summaryData.updateTotals(totalGas, chainData)

                return summaryData
            }, new NetOverview())
    }, [walletSummary, viewCurrency])


    const selectedChainSummary: NetOverview = useMemo(() => {
        const summaryData = new NetOverview()

        if (selectedChain === "all" || !walletSummary[selectedChain]) return summaryData

        const selectedChainData = walletSummary[selectedChain]

        const totalGas = (selectedChainData?.totalGasNative || 0) * (price?.[selectedChain as Chains]?.[viewCurrency] || 0)
        summaryData.updateTotals(totalGas, selectedChainData)

        return summaryData
    }, [walletSummary, viewCurrency, selectedChain])

    const {
        totalGas,
        totalTransactions,
        totalSuccessTransactions,
        totalFailedTransactions
    } = selectedChain === "all" ? aggregateSummary : selectedChainSummary

    if (isLoading) return <Skeleton height={80} borderRadius={10} style={{ marginBottom: 10 }} />

    const chains = Object.keys(walletSummary)

    return (
        <div className='walletOverviewSection'>
            <h2 className='walletOverviewName'>{address}</h2>
            <div className="walletOverviewWrapper tilePrimary">
                <div className="walletOverviewChainIconsGrid">
                    {["all", ...chains].map((chain) => {
                        if (chain !== "all" && walletSummary[chain as Chains].totalTransactions === 0) return
                        return (
                            <button
                                key={chain}
                                onClick={() => setSelectedChain(chain as ViewChains)}
                                className={classNames("walletOverviewChainIconWrapper", { selected: chain === selectedChain })}
                                title={chainLabelMapping[chain as ViewChains]}
                            >
                                {chain === "all" ?
                                    <div className="all">All</div> :
                                    <Icon className="walletOverviewChainIcon" name={chain as Chains} />}
                            </button>
                        )
                    })}
                </div>
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