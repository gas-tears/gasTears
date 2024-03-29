import Button from 'components/Button/Button'
import ChainSelector from 'components/Button/ChainSelector'
import FooterContent from 'components/FooterContent'
import HighCharts from 'components/HighCharts'
import ContentContainer from 'components/layouts/ContentContainer'
import PageContainer from 'components/layouts/PageContainer'
import SummaryOverview from 'components/SummaryOverview'
import WalletOverview from 'components/WalletOverview'
import WalletOverviewNotFound from 'components/WalletOverviewNotFound'
import useChainDistributionChart from 'hooks/useChainDistributionChart'
import useDailyGasUsageChart from 'hooks/useDailyGasUsageChart'
import useGasHistoryChart from 'hooks/useGasHistoryChart'
import useGeckoPrice from 'hooks/useGeckoPrice'
import useLocalStorage from 'hooks/useLocalStorage'
import useSummaryData from 'hooks/useSummaryData'
import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from "react"
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ViewChains, VSCurrencies } from 'types'
import { shortenAddress } from 'utils/Common'
import { chainLabelMapping } from 'utils/labels'

const App: NextPage = () => {
    const price = useGeckoPrice({})
    const router = useRouter()
    const [addresses, setAddresses] = useState<string[]>([])
    const [viewCurrency, setViewCurrency] = useLocalStorage<VSCurrencies>("selectedCurrency", "usd")
    const [selectedChain, setSelectedChain] = useLocalStorage<ViewChains>("selectedChainView", "all")
    const [gasHistoryView, setGasHistoryView] = useLocalStorage("selectedGasHistoryView", "individual")

    const { chainOverviewMap, netOverview, isLoading, walletOverviewMap } = useSummaryData({ addresses, viewCurrency, price })
    const gasHistoryOptions = useGasHistoryChart({ chainOverviewMap, price, viewCurrency })
    const chainDistributionOptions = useChainDistributionChart({ chainOverviewMap, price, viewCurrency })
    const dailyGasUsageOptions = useDailyGasUsageChart({ chainOverviewMap, price, viewCurrency, selectedChain })

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
                            className="select"
                            value={viewCurrency}
                            onChange={(e) => setViewCurrency(e.target.value as VSCurrencies)}
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
                                    title={chainLabelMapping[value]}
                                    isLoading={isLoading}
                                    disabled={value !== "all" && chainOverviewMap[value]?.totalTransactions == 0}
                                    iconName={value === "all" ? undefined : value}
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

                        <div className="sectionHeaderContainer">
                            <h1>Gas History</h1>
                            <select
                                className="select"
                                value={gasHistoryView}
                                onChange={(e) => setGasHistoryView(e.target.value)}
                            >
                                <option value="individual">Individual Transaction</option>
                                <option value="daily">Daily Totals</option>
                            </select>
                        </div>
                        <div className='chartWrapper tilePrimary'>
                            <HighCharts
                                isLoading={isLoading}
                                options={gasHistoryView === "individual" ? gasHistoryOptions : dailyGasUsageOptions}
                            />
                        </div>

                        <h1>Gas usage per chain</h1>
                        <div className="chartWrapper tilePrimary">
                            <HighCharts
                                isLoading={isLoading}
                                options={chainDistributionOptions}
                            />
                        </div>

                        {addresses.length > 1 && (<>
                            <h1>Wallet Breakdown</h1>

                            {addresses.map((address) => {
                                if (!walletOverviewMap[address]) return <WalletOverviewNotFound key={address} address={address} />
                                return <WalletOverview
                                    key={address}
                                    address={shortenAddress(address)}
                                    price={price}
                                    viewCurrency={viewCurrency}
                                    walletSummary={walletOverviewMap[address]}
                                    isLoading={isLoading}
                                />
                            })}
                        </>)}
                    </div>
                </ContentContainer>
                <FooterContent />
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
    { label: "All Chains", value: "all" },
    { label: "Ethereum", value: "ethereum" },
    { label: "BSC", value: "binancecoin" },
    { label: "Avalanche", value: "avalanche-2" },
    { label: "Fantom", value: "fantom" },
    { label: "Polygon", value: "matic-network" },
    { label: "HSC", value: "hoo-token" },
]

export default App
