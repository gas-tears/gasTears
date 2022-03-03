import { formatCurrency } from "@coingecko/cryptoformat";
import OverviewTile from 'components/OverviewTile';
import React from 'react';
import { Chains, ChainOverviewMap, TokenVSCurrencies, ViewChains, VSCurrencies } from 'types';
import { NetOverview } from "utils/classes";


type Props = {
    netOverview: NetOverview,
    chainOverviewMap: ChainOverviewMap,
    viewCurrency: VSCurrencies,
    selectedChain: ViewChains,
    price: TokenVSCurrencies,
    isLoading?: boolean
}

const SummaryOverview: React.FC<Props> = ({
    netOverview,
    chainOverviewMap,
    viewCurrency,
    selectedChain,
    price,
    isLoading
}) => {
    const {
        totalGas,
        totalTransactions,
        totalSuccessTransactions,
        totalFailedTransactions
    } = (() => {
        if (selectedChain === "all") return netOverview

        const info = chainOverviewMap?.[selectedChain]
        if (!info) return new NetOverview()

        return {
            totalGas: info.totalGasNative * (price?.[selectedChain as Chains]?.[viewCurrency] || 0),
            ...info
        }
    })()

    return (
        <div className="topLevelInfoGrid">
            <OverviewTile
                label='Total Gas Fees'
                displayValue={formatCurrency(totalGas, viewCurrency, "en")}
                isLoading={isLoading}
            />
            <OverviewTile
                label='Total Transactions'
                displayValue={totalTransactions}
                isLoading={isLoading}
            />
            <OverviewTile
                label='Successful Transactions'
                displayValue={totalSuccessTransactions}
                isLoading={isLoading}
            />
            <OverviewTile
                label='Failed Transactions'
                displayValue={totalFailedTransactions}
                isLoading={isLoading}
            />
        </div>
    )
}

export default SummaryOverview
