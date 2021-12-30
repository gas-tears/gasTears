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
import OverviewItem from 'components/OverviewItem'
import HighCharts from 'components/HighCharts'
import useGasHistoryChart from 'hooks/useGasHistoryChart'
import useChainDistributionChart from 'hooks/useChainDistributionChart'


const App: NextPage = () => {
    const price = useGeckoPrice({ tokens: ["ethereum"] })
    const router = useRouter()

    const [addresses, setAddresses] = useState([])
    const [viewCurrency, setViewCurrency] = useLocalStorage<VSCurrencies>("selectedCurrency", "usd")

    const { walletInfoArray, totalOverview, isLoading, walletToTransactionsMap } = useSummaryData({ addresses, viewCurrency, price })

    const gasHistoryOptions = useGasHistoryChart({ walletToTransactionsMap })
    const chainDistributionOptions = useChainDistributionChart({ walletToTransactionsMap })

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
                        primary
                        onClick={() => router.back()}
                    >
                        <span className="material-icons">
                            arrow_back
                        </span>
                        Edit Addresses
                    </Button>
                    <select value={viewCurrency} onChange={(e) => setViewCurrency(e.target.value)}>
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
                        <OverviewItem
                            label='Total gas spent'
                            displayValue={formatCurrency(totalOverview?.totalGas, viewCurrency, "en")}
                        />
                        <OverviewItem
                            label='Total transactions'
                            displayValue={totalOverview?.totalTransactions}
                        />
                        <OverviewItem
                            label='Successful transactions'
                            displayValue={totalOverview?.totalSuccessTransactions}
                        />
                        <OverviewItem
                            label='Failed Transactions'
                            displayValue={totalOverview?.totalFailedTransactions}
                        />
                    </div>
                    <h1>Gas usage history</h1>
                    <HighCharts
                        options={gasHistoryOptions}
                    />
                    <h1>Gas usage per chain</h1>
                    <HighCharts
                        options={chainDistributionOptions}
                    />
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
