import { useEffect, useState } from 'react'
import { HighchartHookParam } from './charts-types'
import { formatCurrency } from "@coingecko/cryptoformat";
import { colorMapping } from 'utils/HighchartsDefaultOption';
import { chainLabelMapping } from 'utils/labels';

const useGasHistoryChart = ({
    chainOverviewMap,
    price
}: HighchartHookParam) => {
    const [chartOption, setChartOption] = useState<Highcharts.Options>({})

    useEffect(() => {
        if (!chainOverviewMap) return

        const series = Object
            .entries(chainOverviewMap)
            .map(([chain, chainOverview]) => {
                const transactions = chainOverview.transactions
                if (!transactions) return

                const processedTransactions = transactions.map((transaction) => {
                    const nativeTransactionPrice = parseFloat(transaction.gasUsed) * parseFloat(transaction.gasPrice) * (0.000000001) ** 2
                    const priceInUSD = nativeTransactionPrice * price[chain]["usd"]
                    return { x: parseInt(transaction.timeStamp) * 1000, y: priceInUSD, transactionHash: transaction.hash }
                })
                //Make it so that the last day on the graph is today
                processedTransactions.push({ x: (new Date()).getTime(), y: undefined, transactionHash: "" })

                return {
                    name: chainLabelMapping[chain],
                    data: processedTransactions,
                    color: colorMapping[chain]
                }
            })

        const option: Highcharts.Options = {
            chart: {
                type: "scatter",
                zoomType: "x"
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: 'Converted Transaction Cost (USD)'
                },
                labels: {
                    formatter: function () {
                        return formatCurrency(this.value, "usd");
                    }
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
                        <div>Transaction Cost: ${formatCurrency(this.y, "usd")}</div>
                    `
                }
            },

            series: series,
        }

        setChartOption(option)
    }, [chainOverviewMap])

    return chartOption
}

export default useGasHistoryChart


