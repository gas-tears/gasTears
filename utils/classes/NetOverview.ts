import SummaryData from "./SummaryData"

export default class NetOverview {
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

    updateTotals(totalGas: number, chainSummaryData: SummaryData) {
        this.totalGas += totalGas
        this.totalTransactions += chainSummaryData.totalTransactions;
        this.totalSuccessTransactions += chainSummaryData.totalSuccessTransactions;
        this.totalFailedTransactions += chainSummaryData.totalFailedTransactions;
    }
}