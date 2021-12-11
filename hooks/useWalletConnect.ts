import { useState, useEffect, useRef } from "react"
import MetaMaskOnboarding from '@metamask/onboarding';

export default function useWalletConnect() {
    const [connectedWallets, setConnectedWallets] = useState<string[]>()
    const onboarding = useRef<MetaMaskOnboarding>();

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);


    useEffect(() => {
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) return

        const addresses = window.ethereum?._state?.accounts.length === 0 ? null : window.ethereum?._state?.accounts
        setConnectedWallets(addresses)

        window.ethereum.on('accountsChanged', setConnectedWallets);

        return () => {
            window.ethereum.removeListener('accountsChanged', setConnectedWallets)
        }
    })

    const getWallets = async () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setConnectedWallets(accounts)
        } else {
            onboarding?.current?.startOnboarding()
        }
    }

    return {
        getWallets,
        connectedWallets
    }
}