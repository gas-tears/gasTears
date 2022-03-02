import SummaryData from "utils/classes/SummaryData"

export interface Transaction {
    timeStamp: string,
    hash: string,
    from: string,
    gas: string,
    gasPrice: string,
    isError: string,
    gasUsed: string,
    gasInUSD?: number
}

export type WalletAddress = string

export type AddressToTransactionsMap = Record<WalletAddress, Transaction[]>
export type ExplorerResponse = Record<Chains, AddressToTransactionsMap>

export type MetaMaskNetworkName = "eth" | "avax" | "ftm" | "bnb" | "matic"
export type Chains = "ethereum" | "binancecoin" | "fantom" | "matic-network" | "avalanche-2" | "hoo-token"
export type ViewChains = "all" | Chains
export type VSCurrencies = "usd" | "cad" | "eth" | "btc"
export type ChainHexes = "0x1" | "0xa86a" | "0xfa" | "0x38" | "0x89" | "0xAA"

export type ChainOverviewMap = Record<Chains, SummaryData>
export type WalletOverviewMap = Record<WalletAddress, ChainOverviewMap>

export type ChainTransactionExplorerUrls = Record<Chains, string>

export type VSCurrenciesPrices = Record<VSCurrencies, number>
export type TokenVSCurrencies = Record<Chains, VSCurrenciesPrices>
