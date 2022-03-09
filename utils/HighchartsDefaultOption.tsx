import Highcharts from "highcharts"
import { Chains, ViewChains } from "types"

export const highchartDefaultOption: Highcharts.Options = {
    chart: {
        backgroundColor: "#272727",
        style: {
            fontFamily: 'inter',
        }
    },
    legend: {
        itemStyle: {
            color: "#d6d6d6"
        },
        itemHoverStyle: {
            color: "#ffffff"
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
    plotOptions: {
        pie: {
            borderWidth: 0
        }
    },
    tooltip: {
        useHTML: true,
        followTouchMove: true,
        followPointer: true,
    },
    // colors: ["#36f2f5", "#ffd166", "#3C80F6", "#FE4A49", "#FF9B71", "#118ab2", "#E0E342", "#06d6a0"],

    exporting: { enabled: false },
    credits: { enabled: false }
}

export default function initHighcharts() {
    Highcharts.setOptions(highchartDefaultOption)
}


type ColorMapping = {
    [C in ViewChains]: string
}

export const colorMapping: ColorMapping = {
    "all": "#36f2f5",
    ethereum: "#36f2f5",
    "avalanche-2": "#e66e6f",
    "matic-network": "#bda2e8",
    binancecoin: "#fae1a0",
    fantom: "#52cdf7",
    "hoo-token": "#00d8b0"
}