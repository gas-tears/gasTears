import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { useState, useEffect } from "react"
import PageContainer from 'components/layouts/PageContainer'
import ContentContainer from 'components/layouts/ContentContainer'
import Button from 'components/Button'
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
                            <button
                                className={classNames("chainFilterTile tilePrimary", { isSelected: value === selectedChain })}
                                onClick={() => setSelectedChain(value)}
                                key={value}
                                title={label}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <SummaryOverview
                        netOverview={netOverview}
                        viewCurrency={viewCurrency}
                        selectedChain={selectedChain}
                        price={price}
                        chainOverviewMap={chainOverviewMap}
                    />

                    <h1>Gas History</h1>
                    <div className='chartWrapper tilePrimary'>
                        <HighCharts
                            options={gasHistoryOptions}
                        />
                    </div>

                    <h1>Gas usage per chain</h1>
                    <div className="chartWrapper tilePrimary">
                        <HighCharts
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
                            />
                        })}
                    </>)}
                </div>
            </ContentContainer>
        </PageContainer>
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
