import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsExporting from 'highcharts/modules/exporting'
import React, { useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import initHighcharts from 'utils/HighchartsDefaultOption'

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
    initHighcharts()
}


const HighCharts = (
    props: HighchartsReact.Props
) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    if (props.isLoading) return <Skeleton height={400} />

    return (
        <HighchartsReact
            highcharts={Highcharts}
            ref={chartComponentRef}
            {...props}
        />
    )
}

export default HighCharts
