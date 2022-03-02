import { ChainOverviewMap, ExplorerResponse } from "types";
import { SummaryData } from "utils/classes";

export function shortenAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4)
}

export function initChainOverviewMap(): ChainOverviewMap {
    return {
        "avalanche-2": new SummaryData,
        "binancecoin": new SummaryData,
        "ethereum": new SummaryData,
        "fantom": new SummaryData,
        "matic-network": new SummaryData,
        "hoo-token": new SummaryData
    }
}

export function initExplorerResponse(): ExplorerResponse {
    return {
        "avalanche-2": {},
        "binancecoin": {},
        "ethereum": {},
        "fantom": {},
        "matic-network": {},
        "hoo-token": {}
    }
}

