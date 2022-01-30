export interface Transaction {
    blockNumber: string,
    timeStamp: string,
    hash: string,
    nonce: string,
    blockHash: string,
    transactionIndex: string,
    from: string,
    to: string,
    value: string,
    gas: string,
    gasPrice: string,
    isError: string,
    txreceipt_status: string,
    input: string,
    contractAddress: string,
    cumulativeGasUsed: string,
    gasUsed: string,
    confirmations: string,
    gasInUSD?: number
}

export type WalletToTransactions = {
    [key: string]: Transaction[]
}

export type ExplorerResponse = {
    [Chain in Chains]: AddressToTransactionsMap
}

export type AddressToTransactionsMap = {
    [address: string]: Transaction[]
}

export type MetaMaskNetworkName = "eth" | "avax" | "ftm" | "bnb" | "matic"
export type Chains = "ethereum" | "binancecoin" | "fantom" | "matic-network" | "avalanche-2"
export type VSCurrencies = "usd" | "cad" | "eth" | "btc"
export type ViewChains = "all" | Chains
export type ChainHexes = "0x1" | "0xa86a" | "0xfa" | "0x38" | "0x89"

export type ChainOverviewMap = {
    [Chain in Chains]: SummaryData
}

export class SummaryData {
    totalGasNative: number
    totalTransactions: number
    totalSuccessTransactions: number
    totalFailedTransactions: number
    transactions: Transaction[]

    constructor() {
        this.totalGasNative = 0;
        this.totalTransactions = 0;
        this.totalSuccessTransactions = 0;
        this.totalFailedTransactions = 0;
        this.transactions = [];
    }
}

export type WalletOverviewMap = {
    [address: string]: ChainOverviewMap
}

export class NetOverview {
    totalGas: number
    totalTransactions: number
    totalSuccessTransactions: number
    totalFailedTransactions: number

    constructor() {
        this.totalGas = 0
        this.totalTransactions = 0;
        this.totalSuccessTransactions = 0;
        this.totalFailedTransactions = 0;
    }
}

export type ChainTransactionExplorerUrls = {
    [C in Chains]: string
}

export type TokenVSCurrencies = {
    [C in Chains]: {
        [C in VSCurrencies]: number
    }
}
