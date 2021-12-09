import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react"
import useGeckoPrice from 'hooks/useGeckoPrice'

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
                        const gas = parseFloat(currentTransaction.gasUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
                        return total + gas
                    }, 0)
                const totalGasInUSD = totalGas * price
                return { address, totalGasInUSD }
            })
        setData(data)
    }, [walletToTransactionsMap, price])

    return (
        <div className={styles.container}>
            {data && data.map(({ address, totalGasInUSD }) => (
                <div key={address}>
                    <b>{address}: </b>
                    {formatter.format(totalGasInUSD)}
                </div>
            ))}
        </div>
    )
}

export default App
