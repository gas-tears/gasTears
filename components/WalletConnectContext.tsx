import React, { createContext } from "react";
import useWalletConnect from "hooks/useWalletConnect";

interface WalletConnectContext {
    getWallets: () => Promise<any> | null,
    connectedWallets: string[] | undefined,
}

export const WalletConnectContext = createContext<WalletConnectContext>({
    getWallets: () => null,
    connectedWallets: [],
})

const WalletConnectProvider: React.FC = ({
    children
}) => {
    const { getWallets, connectedWallets } = useWalletConnect()

    return (
        <WalletConnectContext.Provider value={{ getWallets, connectedWallets }}>
            {children}
        </WalletConnectContext.Provider>
    )
}

export default WalletConnectProvider