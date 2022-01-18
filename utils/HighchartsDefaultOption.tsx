export const highchartDefaultOption: Highcharts.Options = {
    chart: {
        backgroundColor: "#272727",
        style: {
            fontFamily: 'inter',
        }
    },
    legend: {
        itemStyle: {
            color: "#fff"
        }
    },

    title: {
        text: ""
    },

    xAxis: {
        title: {
            style: {
                color: "#fff"
            },
            text: ""
        },
        labels: {
            style: {
                color: "#fff"
            }
        }
    },
    yAxis: {
        title: {
            style: {
                color: "#fff",
            },
            text: ''
        },
        labels: {
            style: {
                color: "#fff"
            }
        },
        min: 0
    },
    loading: {
        style: {
            backgroundColor: "#272727"
        }
    },
    noData: {
        style: {
            backgroundColor: "#272727"
        }
    },
    colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

    exporting: { enabled: false },
    credits: { enabled: false }
}