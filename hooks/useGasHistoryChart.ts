import { formatCurrency } from "@coingecko/cryptoformat";
import { useEffect, useState } from 'react';
import { chainTransactionExplorerUrls } from 'utils/ChainInfos';
import { shortenAddress } from 'utils/Common';
import { colorMapping } from 'utils/HighchartsDefaultOption';
import { chainLabelMapping } from 'utils/labels';
import { HighchartHookParam } from './charts-types';

const useGasHistoryChart = ({
    chainOverviewMap,
    price,
    viewCurrency
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
                    const transactionTime = parseInt(transaction.timeStamp) * 1000
                    //TODO: do we have native price on the transaction? Or can we add this?
                    const nativeTransactionPrice = parseFloat(transaction.gasUsed) * parseFloat(transaction.gasPrice) * (0.000000001) ** 2
                    const priceInViewCurrency = nativeTransactionPrice * price[chain][viewCurrency]
                    const transactionUrl = chainTransactionExplorerUrls[chain] + transaction.hash
                    const address = transaction.from

                    return { x: transactionTime, y: priceInViewCurrency, transactionUrl, address }
                })
                //Make it so that the last day on the graph is today
                processedTransactions.push({ x: (new Date()).getTime(), y: undefined, transactionUrl: "", address: "" })

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
                    text: `Transaction Cost (${viewCurrency.toLocaleUpperCase()})`
                },
                labels: {
                    formatter: function () {
                        return formatCurrency(this.value, viewCurrency);
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
                                const url = this.options.transactionUrl
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
                        <div>Address: ${shortenAddress(this.point.options.address)}</div><br/>
                        <div>Transaction Cost: ${formatCurrency(this.y, viewCurrency)}</div>
                    `
                }
            },

            series: series,
        }

        setChartOption(option)
    }, [chainOverviewMap, viewCurrency])

    return chartOption
}

export default useGasHistoryChart


