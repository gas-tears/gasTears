import { formatCurrency } from "@coingecko/cryptoformat";
import { useEffect, useState } from 'react';
import { HighchartHookParam } from './charts-types';
import { Chains, ViewChains } from "types";
import { SeriesColumnOptions } from "highcharts"
import { colorMapping } from 'utils/HighchartsDefaultOption';

const useDailyGasUsageChart = ({
    chainOverviewMap,
    price,
    viewCurrency,
    selectedChain
}: HighchartHookParam & { selectedChain: ViewChains }) => {
    const [chartOption, setChartOption] = useState<Highcharts.Options>({})

    useEffect(() => {
        if (!chainOverviewMap) return

        const dailyUsageMap = new Map()

        Object
            .entries(chainOverviewMap)
            .forEach(([chain, chainOverview]) => {
                if (chainOverview.totalTransactions === 0) return
                if (selectedChain !== "all" && selectedChain !== chain) return

                const transactions = chainOverview.transactions

                transactions.forEach((transaction) => {
                    const transactionDate = new Date(parseInt(transaction.timeStamp) * 1000);
                    transactionDate.setUTCHours(0, 0, 0, 0)
                    const transactionTime = transactionDate.getTime()

                    const nativeTransactionPrice = parseFloat(transaction.gasUsed) * parseFloat(transaction.gasPrice) * (0.000000001) ** 2
                    const priceInViewCurrency = nativeTransactionPrice * (price?.[chain as Chains]?.[viewCurrency] || 0)

                    const dayValue = (dailyUsageMap.get(transactionTime) || 0) + priceInViewCurrency
                    dailyUsageMap.set(transactionTime, dayValue)
                })
            })

        const series: SeriesColumnOptions[] = [{
            name: "Daily Gas Usage",
            data: Array.from(dailyUsageMap),
            type: "column",
            stickyTracking: true,
            color: colorMapping[selectedChain]
        }]

        const option: Highcharts.Options = {
            chart: {
                type: "column",
                zoomType: "x"
            },
            xAxis: {
                title: {
                    text: ''
                },
                type: "datetime",
                crosshair: true
            },
            yAxis: {
                title: {
                    text: `Daily Spendings (${viewCurrency.toLocaleUpperCase()})`
                },
                labels: {
                    formatter: function () {
                        return formatCurrency(this.value as number, viewCurrency);
                    }
                },
                min: 0
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    stickyTracking: true,
                    cursor: "default",
                    point: {
                        events: {
                            click: undefined
                        }
                    }
                },
                column: {
                    borderWidth: 0,
                    stickyTracking: true
                }
            },
            tooltip: {
                shared: true,
                formatter: function () {
                    const date = new Date(this.x)

                    return `
                        <div style="display:flex; align-items:center">
                            <div>${date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}<div>
                            <div><b>${formatCurrency(this.y, viewCurrency)}</b></div>
                        <div>
                    `
                }
            },
            series: series,
        }

        setChartOption(option)
    }, [chainOverviewMap, viewCurrency, selectedChain])

    return chartOption
}

export default useDailyGasUsageChart


