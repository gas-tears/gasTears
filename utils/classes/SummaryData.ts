import { Transaction } from "types"
export default class SummaryData {
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
