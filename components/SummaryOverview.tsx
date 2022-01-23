import React from 'react'
import OverviewTile from 'components/OverviewTile'
import { formatCurrency } from "@coingecko/cryptoformat";
import { VSCurrencies, Chains, ChainOverviewMap, NetOverview, ViewChains } from 'types'
import { TokenVSCurrencies } from "hooks/useGeckoPrice"

type Props = {
    netOverview: NetOverview,
    chainOverviewMap: ChainOverviewMap,
    viewCurrency: VSCurrencies,
    selectedChain: ViewChains,
    price: TokenVSCurrencies
}

const SummaryOverview: React.FC<Props> = ({
    netOverview,
    chainOverviewMap,
    viewCurrency,
    selectedChain,
    price
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
            totalGas: info.totalGasNative * price[selectedChain][viewCurrency?.toLowerCase()],
            ...info
        }
    })()

    return (
        <div className="topLevelInfoGrid">
            <OverviewTile
                label='Total Gas Fees'
                displayValue={formatCurrency(totalGas, viewCurrency, "en")}
            />
            <OverviewTile
                label='Total Transactions'
                displayValue={totalTransactions}
            />
            <OverviewTile
                label='Successful Transactions'
                displayValue={totalSuccessTransactions}
            />
            <OverviewTile
                label='Failed Transactions'
                displayValue={totalFailedTransactions}
            />
        </div>
    )
}

export default SummaryOverview
