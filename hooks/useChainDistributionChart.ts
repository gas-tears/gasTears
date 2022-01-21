import { useEffect, useState } from 'react'
import { HighchartHookParam } from './charts-types'
import { formatCurrency } from "@coingecko/cryptoformat";
import { colorMapping } from 'utils/HighchartsDefaultOption';
import { chainLabelMapping } from 'utils/labels';

const useChainDistributionChart = ({
    chainOverviewMap
}: HighchartHookParam) => {
    const [chartOption, setChartOption] = useState<Highcharts.Options>({})

    useEffect(() => {
        if (!chainOverviewMap) return

        const data = Object
            .entries(chainOverviewMap)
            .map(([chain, chainOverview]) => {
                return {
                    name: chainLabelMapping[chain],
                    y: chainOverview.totalGasUSD,
                    color: colorMapping[chain]
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
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            tooltip: {
                formatter: function () {
                    return `
                        <div><b>${this.point.name}</b></div><br/>
                        <div>Total gas usage: ${formatCurrency(this.y, "usd")} (${this.percentage?.toFixed(1)}%)</div>
                    `
                }
            },
            series: [{
                name: "Gas usage per chain",
                type: "pie",
                colorByPoint: true,
                data: data
            }],
        }

        setChartOption(option)
    }, [chainOverviewMap])

    return chartOption
}

export default useChainDistributionChart


