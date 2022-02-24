import { ViewChains } from 'types'

type ChainNameMapping = {
    [C in ViewChains]: string
}

export const chainLabelMapping: ChainNameMapping = {
    "all": "All chains",
    "avalanche-2": "Avalanche",
    fantom: "Fantom",
    binancecoin: "BSC",
    "matic-network": "Polygon",
    ethereum: "Ethereum",
    "hoo-token": "HSC",
}