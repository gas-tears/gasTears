import MetaMaskOnboarding from '@metamask/onboarding';
import { useEffect, useRef, useState } from "react";
import { MetaMaskNetworkName } from "types";

export default function useWalletConnect() {
    const [connectedWallets, setConnectedWallets] = useState<string[]>([])
    const [connectedChain, setConnectedChain] = useState<string>()
    const onboarding = useRef<MetaMaskOnboarding>();

    useEffect(() => {
        if (!onboarding.current) onboarding.current = new MetaMaskOnboarding();

        if (!MetaMaskOnboarding.isMetaMaskInstalled()) return

        const addresses = window.ethereum?._state?.accounts.length === 0 ? null : window.ethereum?._state?.accounts;
        setConnectedWallets(addresses || []);

        (async () => {
            try {
                const chain = await ethereum.request({ method: 'eth_chainId' })
                setConnectedChain(chain)
            } catch (error) {
                console.log(error)
                setConnectedChain("0x1")
            }
        })()


        window.ethereum.on('accountsChanged', setConnectedWallets);
        window.ethereum.on('chainChanged', setConnectedChain);

        return () => {
            window.ethereum.removeListener('accountsChanged', setConnectedWallets)
            window.ethereum.removeListener('chainChanged', setConnectedChain)
        }
    }, []);

    const getWallets = async () => {
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) onboarding?.current?.startOnboarding()

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setConnectedWallets(accounts)
    }

    const changeNetwork = async (chainId: MetaMaskNetworkName) => {
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) onboarding?.current?.startOnboarding()

        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                //TODO: Change chain id to chain name
                alert(`Oops! It seems like you currently don't have the ${chainId} networth installed`)
            }
        }
    }

    const sendTip = async (value: number) => {
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) onboarding?.current?.startOnboarding()

        const transactionParameters = {
            nonce: '0x00', // ignored by MetaMask
            to: '0xE00669A884B8eB60bc6C1222A931407C46596085', // Required except during contract publications.
            from: connectedWallets[0], // must match user's active address.
            value: convertValueToHexString(value * 10 ** 18), // Only required to send ether to the recipient from the initiating external account.
        };

        // txHash is a hex string
        // As with any RPC call, it may throw an error
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
    }

    return {
        getWallets,
        connectedWallets,
        changeNetwork,
        sendTip,
        connectedChain
    }
}

function convertValueToHexString(value: number) {
    return "0x" + value.toString(16)
}


type ChainIdHexes = {
    [C in MetaMaskNetworkName]: string
}

const chainIdHexes: ChainIdHexes = {
    eth: "0x1",
    avax: "0xA86A",
    ftm: "0xFA",
    bnb: "0x38",
    matic: "0x89"
}