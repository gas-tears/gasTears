import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { useState, useEffect } from "react"
import PageContainer from 'components/layouts/PageContainer'
import ContentContainer from 'components/layouts/ContentContainer'
import Button from 'components/Button/Button'
import useSummaryData from 'hooks/useSummaryData'
import useLocalStorage from 'hooks/useLocalStorage'
import useGeckoPrice from 'hooks/useGeckoPrice'
import HighCharts from 'components/HighCharts'
import useGasHistoryChart from 'hooks/useGasHistoryChart'
import useChainDistributionChart from 'hooks/useChainDistributionChart'
import { VSCurrencies, ViewChains } from 'types'
import SummaryOverview from 'components/SummaryOverview'
import classNames from 'classnames'
import WalletOverviewNotFound from 'components/WalletOverviewNotFound'
import WalletOverview from 'components/WalletOverview'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import ChainSelector from 'components/Button/ChainSelector'

const App: NextPage = () => {
    const price = useGeckoPrice({})
    const router = useRouter()

    const [addresses, setAddresses] = useState<string[]>([])
    const [viewCurrency, setViewCurrency] = useLocalStorage<VSCurrencies>("selectedCurrency", "usd")
    const [selectedChain, setSelectedChain] = useLocalStorage<ViewChains>("selectedChainView", "all")

    const { chainOverviewMap, netOverview, isLoading, walletOverviewMap } = useSummaryData({ addresses, viewCurrency, price })

    const gasHistoryOptions = useGasHistoryChart({ chainOverviewMap, price, viewCurrency })
    const chainDistributionOptions = useChainDistributionChart({ chainOverviewMap, price, viewCurrency })

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
        <SkeletonTheme baseColor='#272727' highlightColor="#4a4a4a">
            <PageContainer>
                <ContentContainer>
                    <div className="dashboardTopBar">
                        <Button
                            secondary
                            onClick={() => router.push("/")}
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
                            <option value="usd">USD</option>
                            <option value="cad">CAD</option>
                            <option value="eth">ETH</option>
                            <option value="btc">BTC</option>
                        </select>
                    </div>
                </ContentContainer>
                <ContentContainer>
                    <div className="dashboardMain">
                        <div className="chainFiltersWrapper">
                            {chainOptions.map(({ label, value }) => (
                                <ChainSelector
                                    isSelected={value === selectedChain}
                                    onClick={() => setSelectedChain(value)}
                                    key={value}
                                    title={label}
                                    isLoading={isLoading}
                                    disabled={chainOverviewMap[value]?.totalTransactions == 0}
                                >
                                    {label}
                                </ChainSelector>
                            ))}
                        </div>
                        <SummaryOverview
                            netOverview={netOverview}
                            viewCurrency={viewCurrency}
                            selectedChain={selectedChain}
                            price={price}
                            chainOverviewMap={chainOverviewMap}
                            isLoading={isLoading}
                        />

                        <h1>Gas History</h1>
                        <div className='chartWrapper tilePrimary'>
                            <HighCharts
                                isLoading={isLoading}
                                options={gasHistoryOptions}
                            />
                        </div>

                        <h1>Gas usage per chain</h1>
                        <div className="chartWrapper tilePrimary">
                            <HighCharts
                                isLoading={isLoading}
                                options={chainDistributionOptions}
                            />
                        </div>

                        {addresses.length !== 0 && (<>
                            <h1>Wallet Breakdown</h1>

                            {addresses.map((address) => {
                                if (!walletOverviewMap[address]) return <WalletOverviewNotFound address={address} />
                                return <WalletOverview
                                    address={address}
                                    price={price}
                                    viewCurrency={viewCurrency}
                                    selectedChain={selectedChain}
                                    walletSummary={walletOverviewMap[address]}
                                    isLoading={isLoading}
                                />
                            })}
                        </>)}
                    </div>
                </ContentContainer>
            </PageContainer>
        </SkeletonTheme>
    )
}

type ChainOption = {
    label: string,
    value: ViewChains
}
type ChainOptions = ChainOption[]

const chainOptions: ChainOptions = [
    { label: "All", value: "all" },
    { label: "Ethereum", value: "ethereum" },
    { label: "BSC", value: "binancecoin" },
    { label: "Avalanche", value: "avalanche-2" },
    { label: "Fantom", value: "fantom" },
    { label: "Polygon", value: "matic-network" },
]

export default App
