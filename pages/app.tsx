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
            const apiRes = await fetch("/explorer", {
                body: JSON.stringify({
                    addresses: addresses.join(',')
                })
            })
            const apiJSON = await apiRes.json()
            setTransactions(apiJSON.transactions)
        }
    }, [addresses])

    return (
        <div className={styles.container}>
            {addresses && addresses.map((address) => (
                <div key={address}>{address}</div>
            ))}
            <pre>
                {transactions}
            </pre>
        </div>
    )
}

export default App
