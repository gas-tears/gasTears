import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { useState, useEffect } from "react"
import useGeckoPrice from 'hooks/useGeckoPrice'
import PageContainer from 'components/layouts/PageContainer'
import ContentContainer from 'components/layouts/ContentContainer'
import Button from 'components/Button'

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const App: NextPage = () => {
    const router = useRouter()
    const price = useGeckoPrice({ token: "ethereum" })

    const [addresses, setAddresses] = useState([])
    const [walletToTransactionsMap, setWalletToTransactionsMap] = useState()
    const [data, setData] = useState([])

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

    useEffect(() => {
        if (addresses?.length === 0) return
        const getTransactions = async () => {
            const apiRes = await fetch("/api/explorer", {
                method: "POST",
                body: JSON.stringify({
                    addresses
                })
            })
            const apiJSON = await apiRes.json()
            setWalletToTransactionsMap(apiJSON.addressToTransactionsMap)
        }
        getTransactions()
    }, [addresses])

    useEffect(() => {
        if (!walletToTransactionsMap || !price) return

        const data = Object
            .entries(walletToTransactionsMap)
            .map(([address, transactions]) => {
                if (!transactions || !Array.isArray(transactions)) return { address, totalGasInUSD: 0 }
                const totalGas = transactions
                    .filter((transaction) => transaction.from === address.toLowerCase())
                    .reduce((total, currentTransaction) => {
                        const gas = parseFloat(currentTransaction.gassUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
                        return total + gas
                    }, 0)
                const totalGasInUSD = totalGas * price
                return { address, totalGasInUSD }
            })
        setData(data)
    }, [walletToTransactionsMap, price])

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
                    <select>
                        <option value="usd">USD</option>
                        <option value="cad">CAD</option>
                        <option value="eth">ETH</option>
                        <option value="btc">BTC</option>
                    </select>
                </div>
            </ContentContainer>
            <ContentContainer>
                <div className="dashboardMain">
                    {data && data.map(({ address, totalGasInUSD }) => (
                        <div key={address}>
                            <b>{address}: </b>
                            {formatter.format(totalGasInUSD)}
                        </div>
                    ))}
                </div>
            </ContentContainer>
        </PageContainer>
    )
}

export default App
