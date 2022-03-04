import { ChainOverviewMap, TokenVSCurrencies, VSCurrencies } from "types"

export type HighchartHookParam = {
    chainOverviewMap: ChainOverviewMap,
    price: TokenVSCurrencies,
    viewCurrency: VSCurrencies,
}