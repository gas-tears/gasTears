import { ChainOverviewMap, VSCurrencies } from "types"
import { TokenVSCurrencies } from "./useGeckoPrice"

export type HighchartHookParam = {
    chainOverviewMap: ChainOverviewMap,
    price?: TokenVSCurrencies,
    viewCurrency: VSCurrencies
}