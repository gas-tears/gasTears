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

export type MetaMaskNetworkName = "eth" | "avax" | "ftm" | "bnb" | "matic"
