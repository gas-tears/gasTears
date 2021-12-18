import { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'

const useGasHistoryChart = ({
    walletToTransactionsMap
}) => {
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
                        return [parseInt(transaction.timeStamp * 1000), gasInEth]
                    })
                }
            })
        const option: HighchartsReact.Props = {
            chart: {
                type: "scatter"
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
                    }
                }
            },

            colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

            series: series,
            exporting: { enabled: false },
            credits: { enabled: false }
        }

        setChartOption(option)
    }, [walletToTransactionsMap])

    return chartOption
}

export default useGasHistoryChart


