import React from 'react'
import Skeleton from 'react-loading-skeleton'

type Props = {
    label: string,
    displayValue: string | number,
    supportValue?: string,
    isLoading?: boolean
}

const OverviewTile: React.FC<Props> = ({
    label,
    displayValue,
    supportValue,
    isLoading = false
}) => {
    if (isLoading) return <Skeleton height={75} borderRadius={10} />

    return (
        <div className="overviewTile tilePrimary">
            <div className="overviewTileLabel">{label}</div>
            <div className="overviewTileDisplayValue">{displayValue}</div>
            {supportValue && <div className="overViewItemSupportValue">{supportValue}</div>}
        </div>
    )
}

export default OverviewTile