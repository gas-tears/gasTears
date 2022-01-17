import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { useState, useEffect } from "react"
import PageContainer from 'components/layouts/PageContainer'
import ContentContainer from 'components/layouts/ContentContainer'
import Button from 'components/Button'
import useSummaryData from 'hooks/useSummaryData'
import useLocalStorage from 'hooks/useLocalStorage'
import useGeckoPrice, { VSCurrencies } from 'hooks/useGeckoPrice'
import { formatCurrency } from "@coingecko/cryptoformat";
import OverviewTile from 'components/OverviewTile'
import HighCharts from 'components/HighCharts'
import useGasHistoryChart from 'hooks/useGasHistoryChart'
import useChainDistributionChart from 'hooks/useChainDistributionChart'
import classNames from 'classnames'

const App: NextPage = () => {
    const price = useGeckoPrice({ tokens: ["ethereum"] })
    const router = useRouter()

    const [addresses, setAddresses] = useState([])
    const [viewCurrency, setViewCurrency] = useLocalStorage<VSCurrencies>("selectedCurrency", "usd")

    const [chainFilter, setChainFilter] = useState([
        { name: "All", isSelected: true },
        { name: "Ethereum", isSelected: false },
        { name: "BSC", isSelected: false },
        { name: "Avalanche", isSelected: false },
        { name: "Fantom", isSelected: false },
        { name: "Polygon", isSelected: false },
    ])

    const { walletInfoArray, totalOverview, isLoading, walletToTransactionsMap } = useSummaryData({ addresses, viewCurrency, price })

    const gasHistoryOptions = useGasHistoryChart({ walletToTransactionsMap })
    const chainDistributionOptions = useChainDistributionChart({ walletToTransactionsMap })

    const setSelected = (name) => {
        setChainFilter((filter) => {
            return filter.map((chain) => {
                return { ...chain, isSelected: chain.name === name }
            })
        })
    }

    useEffect(() => {
        const { addresses } = router.query
        if (!addresses) return
        if (typeof addresses === "string") {
            setAddresses([addresses])
        }
        if (Array.isArray(addresses)) {
            setAddresses(addresses)
        }
    }, [router.query])

    return (
        <PageContainer>
            <ContentContainer>
                <div className="dashboardTopBar">
                    <Button
                        secondary
                        onClick={() => router.back()}
                    >
                        <span className="material-icons">
                            arrow_back
                        </span>
                        Edit Addresses
                    </Button>
                    <select
                        className="viewCurrencySelect"
                        value={viewCurrency}
                        onChange={(e) => setViewCurrency(e.target.value)}
                    >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                        <option value="ETH">ETH</option>
                        <option value="BTC">BTC</option>
                    </select>
                </div>
            </ContentContainer>
            <ContentContainer>
                <div className="dashboardMain">
                    <div className="topLevelInfoGrid">
                        <OverviewTile
                            label='Total gas spent'
                            displayValue={formatCurrency(totalOverview?.totalGas, viewCurrency, "en")}
                        />
                        <OverviewTile
                            label='Total transactions'
                            displayValue={totalOverview?.totalTransactions}
                        />
                        <OverviewTile
                            label='Successful transactions'
                            displayValue={totalOverview?.totalSuccessTransactions}
                        />
                        <OverviewTile
                            label='Failed Transactions'
                            displayValue={totalOverview?.totalFailedTransactions}
                        />
                    </div>
                    <div className="chainFiltersWrapper">
                        {chainFilter.map(({ name, isSelected }) => (
                            <div
                                className={classNames("chainFilterTile tilePrimary", { isSelected })}
                                onClick={() => setSelected(name)}
                                key={name}
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                    <h1>Gas usage history</h1>
                    <div className='chartWrapper'>
                        <HighCharts
                            options={gasHistoryOptions}
                        />
                    </div>
                    <h1>Gas usage per chain</h1>
                    <div className="chartWrapper">
                        <HighCharts
                            options={chainDistributionOptions}
                        />
                    </div>
                    {walletInfoArray && walletInfoArray.length > 1 && (<>
                        <h1>Wallets</h1>
                        {walletInfoArray.map(({ address, totalGasNative }) => (
                            <div key={address}>
                                <b>{address}: </b>
                                {formatCurrency(totalGasNative * price['ethereum'][viewCurrency.toLowerCase()], viewCurrency, "en")}
                            </div>))}
                    </>)}
                </div>
            </ContentContainer>
        </PageContainer>
    )
}


export default App
