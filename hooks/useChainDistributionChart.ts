import { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import { HighchartHookParam } from './charts-types'

const useChainDistributionChart = ({
    walletToTransactionsMap
}: HighchartHookParam) => {
    const [chartOption, setChartOption] = useState<HighchartsReact.Props>({})

    useEffect(() => {
        if (!walletToTransactionsMap) return
        const series = Object
            .entries(walletToTransactionsMap)
            .filter(([_, transactions]) => Array.isArray(transactions))
            .map(([walletAddress, transactions]) => {
                return {
                    name: walletAddress,
                    data: transactions.map((transaction) => {
                        const gasInEth = parseFloat(transaction.gasUsed) * parseFloat(transaction.gasPrice) * (0.000000001) ** 2
                        return [parseInt(transaction.timeStamp) * 1000, gasInEth]
                    })
                }
            })
        const option: HighchartsReact.Props = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
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
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0
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

            colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

            series: [{
                name: "Gas usage per chain",
                colorByPoint: true,
                data: [{
                    name: "Ethereum",
                    y: 100,
                }]
            }],
            exporting: { enabled: false },
            credits: { enabled: false }
        }

        setChartOption(option)
    }, [walletToTransactionsMap])

    return chartOption
}

export default useChainDistributionChart


