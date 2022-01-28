import { formatCurrency } from "@coingecko/cryptoformat";
import { useEffect, useState } from 'react';
import { chainTransactionExplorerUrls } from 'utils/ChainInfos';
import { shortenAddress } from 'utils/Common';
import { colorMapping } from 'utils/HighchartsDefaultOption';
import { chainLabelMapping } from 'utils/labels';
import { HighchartHookParam } from './charts-types';
import { Chains } from "types";
import { PointOptionsObject, SeriesOptionsType, SeriesScatterOptions } from "highcharts"

interface CustomPointOptions extends PointOptionsObject {
    transactionUrl: string,
    address: string
}


const useGasHistoryChart = ({
    chainOverviewMap,
    price,
    viewCurrency
}: HighchartHookParam) => {
    const [chartOption, setChartOption] = useState<Highcharts.Options>({})

    useEffect(() => {
        if (!chainOverviewMap) return

        const series: SeriesScatterOptions[] = Object
            .entries(chainOverviewMap)
            .filter(([_, chainOverview]) => chainOverview.totalTransactions > 0)
            .map(([chain, chainOverview]) => {
                const transactions = chainOverview.transactions

                const processedTransactions: CustomPointOptions[] = transactions.map((transaction) => {
                    const transactionTime = parseInt(transaction.timeStamp) * 1000

                    //TODO: do we have native price on the transaction? Or can we add this?
                    const nativeTransactionPrice = parseFloat(transaction.gasUsed) * parseFloat(transaction.gasPrice) * (0.000000001) ** 2
                    const priceInViewCurrency = nativeTransactionPrice * (price?.[chain as Chains]?.[viewCurrency] || 0)
                    const transactionUrl = chainTransactionExplorerUrls[chain as Chains] + transaction.hash
                    const address = transaction.from

                    return { x: transactionTime, y: priceInViewCurrency, transactionUrl, address }
                })
                //Make it so that the last day on the graph is today
                processedTransactions.push({ x: (new Date()).getTime(), y: undefined, transactionUrl: "", address: "" })

                return {
                    type: "scatter",
                    name: chainLabelMapping[chain as Chains],
                    data: processedTransactions,
                    color: colorMapping[chain as Chains]
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
                        return formatCurrency(this.value as number, viewCurrency);
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
                                const options = this.options as CustomPointOptions
                                const url = options.transactionUrl
                                window.open(url, "_blank")?.focus()
                            }
                        }
                    }
                }
            },

            tooltip: {
                formatter: function () {
                    const date = new Date(this.x)
                    const options = this.point.options as CustomPointOptions

                    return `
                        <div><b>${date.toLocaleString()}</b></div><br/>
                        <div>Address: ${shortenAddress(options.address)}</div><br/>
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


