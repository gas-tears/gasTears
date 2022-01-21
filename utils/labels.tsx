import { Chains } from 'types'

type ChainNameMapping = {
    [C in Chains]: string
}

export const chainLabelMapping: ChainNameMapping = {
    "avalanche-2": "Avalanche",
    fantom: "Fantom",
    binancecoin: "BSC",
    "matic-network": "Polygon",
    ethereum: "Ethereum"
}