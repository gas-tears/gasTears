import React, { useRef } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsExporting from 'highcharts/modules/exporting'

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

const HighCharts = (
    props: HighchartsReact.Props
) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            ref={chartComponentRef}
            {...props}
        />
    )
}

export default HighCharts
