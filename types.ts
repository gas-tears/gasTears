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
    [C in Chains]?: AddressToTransactionsMap
}

export type AddressToTransactionsMap = {
    [address: string]: Transaction[]
}

export type MetaMaskNetworkName = "eth" | "avax" | "ftm" | "bnb" | "matic"
export type Chains = "ethereum" | "binancecoin" | "fantom" | "matic-network" | "avalanche-2"
export type VSCurrencies = "usd" | "cad" | "eth" | "btc"
export type ViewChains = "all" | Chains


export type ChainOverviewMap = {
    [Chain in Chains]?: ChainOverview
}

export class ChainOverview {
    totalGasNative: number
    totalGasUSD: number
    totalTransactions: number
    totalSuccessTransactions: number
    totalFailedTransactions: number
    transactions: Transaction[]

    constructor() {
        this.totalGasNative = 0;
        this.totalGasUSD = 0;
        this.totalTransactions = 0;
        this.totalSuccessTransactions = 0;
        this.totalFailedTransactions = 0;
        this.transactions = [];
    }
}

export type WalletOverviewMap = {
    [address: string]: WalletTransaction[]
}

type WalletTransaction = {
    chain: Chains,
    totalGasNative: number,
    totalGasUSD: number
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

