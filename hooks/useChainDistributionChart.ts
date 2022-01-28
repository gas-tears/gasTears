import { formatCurrency } from "@coingecko/cryptoformat";
import { useEffect, useState } from 'react';
import { Chains, SummaryData } from "types";
import { colorMapping } from 'utils/HighchartsDefaultOption';
import { chainLabelMapping } from 'utils/labels';
import { HighchartHookParam } from './charts-types';

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
            .map(([chain, chainOverview]) => {
                const gasInViewCurrency = chainOverview.totalGasNative * (price?.[chain as Chains]?.[viewCurrency] || 0)

                return {
                    name: chainLabelMapping[chain as Chains],
                    y: gasInViewCurrency,
                    color: colorMapping[chain as Chains]
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
                        <div>Total gas usage: ${formatCurrency(this.y, viewCurrency)} (${this.percentage?.toFixed(1)}%)</div>
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
    }, [chainOverviewMap, viewCurrency])

    return chartOption
}

export default useChainDistributionChart


