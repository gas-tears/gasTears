import { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import HighCharts from 'highcharts'
import { HighchartHookParam } from './charts-types'
import { formatCurrency } from "@coingecko/cryptoformat";

import { highchartDefaultOption } from 'utils/HighchartsDefaultOption';

const useGasHistoryChart = ({
    walletToTransactionsMap
}: HighchartHookParam) => {
    const [chartOption, setChartOption] = useState<Highcharts.Options>(highchartDefaultOption)

    useEffect(() => {
        if (!walletToTransactionsMap) return
        const series = Object
            .entries(walletToTransactionsMap)
            .filter(([_, transactions]) => Array.isArray(transactions))
            .map(([walletAddress, transactions]) => {
                const processedTransactions = transactions.map((transaction) => {
                    const gasInEth = parseFloat(transaction.gasUsed) * parseFloat(transaction.gasPrice) * (0.000000001) ** 2
                    return { x: parseInt(transaction.timeStamp) * 1000, y: gasInEth, transactionHash: transaction.hash }
                })
                //Fixed the final date to today
                processedTransactions.push({ x: (new Date()).getTime(), y: null, transactionHash: "" })
                return {
                    name: walletAddress,
                    data: processedTransactions
                }
            })
        const option: Highcharts.Options = {
            chart: {
                type: "scatter",
                zoomType: "x"
            },
            title: {
                text: ""
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true
                    },
                    cursor: "pointer",
                    point: {
                        events: {
                            click: function () {
                                const url = "https://etherscan.io/tx/" + this.options.transactionHash
                                window.open(url, "_blank")?.focus()
                            }
                        }
                    }
                }
            },

            tooltip: {
                formatter: function () {
                    const date = new Date(this.x)
                    return `
                        <div><b>${date.toLocaleString()}</b></div><br/>
                        <div>Transaction Cost: ${formatCurrency(this.y, "eth")}</div>
                    `
                }
            },

            colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

            series: series,
            exporting: { enabled: false },
            credits: { enabled: false }
        }

        setChartOption(HighCharts.merge(option, highchartDefaultOption))
    }, [walletToTransactionsMap])

    return chartOption
}

export default useGasHistoryChart


