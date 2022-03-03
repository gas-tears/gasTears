import { formatCurrency } from "@coingecko/cryptoformat";
import { useEffect, useState } from 'react';
import { Chains } from "types";
import { colorMapping } from 'utils/HighchartsDefaultOption';
import { chainLabelMapping } from 'utils/labels';
import { HighchartHookParam } from './charts-types';
import { Point } from "highcharts"


interface CustomPointOptions extends Point {
    numTransactions: number,
}

const useChainDistributionChart = ({
    chainOverviewMap,
    price,
    viewCurrency
}: HighchartHookParam) => {
    const [chartOption, setChartOption] = useState<Highcharts.Options>({})

    useEffect(() => {
        if (!chainOverviewMap) return

        const data = Object
            .entries(chainOverviewMap)
            .filter(([_, chainOverview]) => chainOverview.totalTransactions > 0)
            .map(([chain, chainOverview]) => {
                const gasInViewCurrency = chainOverview.totalGasNative * (price?.[chain as Chains]?.[viewCurrency] || 0)

                return {
                    name: chainLabelMapping[chain as Chains],
                    y: gasInViewCurrency,
                    color: colorMapping[chain as Chains],
                    numTransactions: chainOverview.totalTransactions
                }
            })
        const option: Highcharts.Options = {
            chart: {
                plotBackgroundColor: undefined,
                plotBorderWidth: undefined,
                plotShadow: false,
                type: 'pie',
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        style: {
                            color: "#ffffff",
                            textOutline: "none"
                        },
                        formatter: function () {
                            const point = this.point as CustomPointOptions
                            return `
                                <div style="display:flex;flex-direction:column">
                                    <div>${point.name} (${point.numTransactions} txn)</div><br>
                                    <div>${formatCurrency(this.y || 0, viewCurrency)} (${this.percentage?.toFixed(2)}%)</div><br>
                                    <div>${formatCurrency((this.y || 0) / point.numTransactions, viewCurrency, "en", false, { significantFigures: 2 })}/txn</div>
                                </div>
                            `
                        }
                    },
                    showInLegend: true
                }
            },
            tooltip: {
                enabled: false,
            },
            series: [{
                name: "Gas usage per chain",
                type: "pie",
                colorByPoint: true,
                data: data
            }],
        }

        setChartOption(option)
    }, [chainOverviewMap, viewCurrency])

    return chartOption
}

export default useChainDistributionChart


