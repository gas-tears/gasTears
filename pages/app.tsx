import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react"

const App: NextPage = () => {
    const router = useRouter()
    const [addresses, setAddresses] = useState([])

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
        <div className={styles.container}>
            {addresses && addresses.map((address) => (
                <div>{address}</div>
            ))}
        </div>
    )
}

export default App
