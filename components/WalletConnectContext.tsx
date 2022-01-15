import React, { createContext } from "react";
import useWalletConnect from "hooks/useWalletConnect";
import { MetaMaskNetworkName } from "types"
interface WalletConnectContext {
    getWallets: () => Promise<void> | null,
    connectedWallets: string[] | undefined,
    changeNetwork: (network: MetaMaskNetworkName) => Promise<void> | null,
    sendTip: (value: number) => Promise<void> | null,
    connectedChain: string | undefined
}

export const WalletConnectContext = createContext<WalletConnectContext>({
    getWallets: () => null,
    connectedWallets: [],
    changeNetwork: () => null,
    sendTip: () => null,
    connectedChain: undefined
})

const WalletConnectProvider: React.FC = ({
    children
}) => {
    const walletConnect = useWalletConnect()

    return (
        <WalletConnectContext.Provider value={walletConnect}>
            {children}
        </WalletConnectContext.Provider>
    )
}

export default WalletConnectProvider