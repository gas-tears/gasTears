import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { useState, useEffect } from "react"
import PageContainer from 'components/layouts/PageContainer'
import ContentContainer from 'components/layouts/ContentContainer'
import Button from 'components/Button'
import useSummaryData from 'hooks/useSummaryData'
import useLocalStorage from 'hooks/useLocalStorage'
import { VSCurrencies } from 'hooks/useGeckoPrice'
import { formatCurrency } from "@coingecko/cryptoformat";

const App: NextPage = () => {
    const router = useRouter()

    const [addresses, setAddresses] = useState([])
    const [viewCurrency, setViewCurrency] = useLocalStorage<VSCurrencies>("selectedCurrency", "usd")
    const { walletInfoArray, totalOverview, isLoading } = useSummaryData({ addresses, viewCurrency })

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
                    <div>
                        <div>Total gas spent: {formatCurrency(totalOverview?.totalGas, viewCurrency, "en")}</div>
                        <div>Total transactions: {totalOverview?.totalTransactions}</div>
                        <div>{totalOverview?.totalSuccessTransactions} transactions succeed</div>
                        <div>{totalOverview?.totalFailedTransactions} transactions failed</div>
                    </div>
                    {walletInfoArray && walletInfoArray.map(({ address, totalGasInSelectedCurrency }) => (
                        <div key={address}>
                            <b>{address}: </b>
                            {formatCurrency(totalGasInSelectedCurrency, viewCurrency, "en")}
                        </div>
                    ))}
                </div>
            </ContentContainer>
        </PageContainer>
    )
}

export default App
