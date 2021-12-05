import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react"

const App: NextPage = () => {
    const router = useRouter()
    const [addresses, setAddresses] = useState([])
    const [transactions, setTransactions] = useState([])

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
            console.log(apiJSON.addressToTransactionsMap)
            // setTransactions(apiJSON.transactions)
        }
        getTransactions()
    }, [addresses])

    // useEffect(() => {
    //     const totalGas = transactions.reduce((total, currentTransaction) => {
    //         const gas = parseFloat(currentTransaction.gasUsed) * parseFloat(currentTransaction.gasPrice) * (0.000000001) ** 2
    //         return total + gas
    //     }, 0)
    //     console.log(totalGas)
    // }, [transactions])

    return (
        <div className={styles.container}>
            {addresses && addresses.map((address) => (
                <div key={address}>{address}</div>
            ))}
        </div>
    )
}

export default App
