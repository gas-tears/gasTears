import { formatCurrency } from "@coingecko/cryptoformat";
import { useEffect, useState } from 'react';
import { HighchartHookParam } from './charts-types';
import { Chains } from "types";
import { PointOptionsObject, SeriesColumnOptions } from "highcharts"
import { colorMapping } from 'utils/HighchartsDefaultOption';

const useDailyGasUsageChart = ({
    chainOverviewMap,
    price,
    viewCurrency
}: HighchartHookParam) => {
    const [chartOption, setChartOption] = useState<Highcharts.Options>({})

    useEffect(() => {
        if (!chainOverviewMap) return

        const dailyUsageMap = new Map()

        Object
            .entries(chainOverviewMap)
            .filter(([_, chainOverview]) => chainOverview.totalTransactions > 0)
            .forEach(([chain, chainOverview]) => {
                const transactions = chainOverview.transactions

                transactions.forEach((transaction) => {
                    const transactionDate = new Date(parseInt(transaction.timeStamp) * 1000);
                    transactionDate.setUTCHours(0, 0, 0, 0)
                    const transactionTime = transactionDate.getTime()

                    const nativeTransactionPrice = parseFloat(transaction.gasUsed) * parseFloat(transaction.gasPrice) * (0.000000001) ** 2
                    const priceInViewCurrency = nativeTransactionPrice * (price?.[chain as Chains]?.[viewCurrency] || 0)

                    if (dailyUsageMap.has(transactionTime)) {
                        const dayValue = dailyUsageMap.get(transactionTime)
                        dailyUsageMap.set(transactionTime, dayValue + priceInViewCurrency)
                    } else {
                        dailyUsageMap.set(transactionTime, priceInViewCurrency)
                    }
                })
            })

        const series: SeriesColumnOptions[] = [{
            name: "Daily Gas Usage",
            data: Array.from(dailyUsageMap),
            type: "column",
            stickyTracking: true,
            color: colorMapping["ethereum"]
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
                    stickyTracking: true
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
    }, [chainOverviewMap, viewCurrency])

    return chartOption
}

export default useDailyGasUsageChart


