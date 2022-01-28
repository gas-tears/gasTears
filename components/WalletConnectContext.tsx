import useWalletConnect from "hooks/useWalletConnect";
import React, { createContext } from "react";
import { ChainHexes } from "types";

interface WalletConnectContext {
    getWallets: () => Promise<void> | null,
    connectedWallets: string[],
    changeNetwork: (network: ChainHexes) => Promise<void> | null,
    sendTip: (value: number) => Promise<void> | null,
    connectedChain: ChainHexes
}

export const WalletConnectContext = createContext<WalletConnectContext>({
    getWallets: () => null,
    connectedWallets: [],
    changeNetwork: () => null,
    sendTip: () => null,
    connectedChain: "0x1"
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