import React from 'react'

type Props = {
    label: string,
    displayValue: string | number,
    supportValue?: string
}

const OverviewTile: React.FC<Props> = ({
    label,
    displayValue,
    supportValue
}) => {
    return (
        <div className="overviewTile tilePrimary">
            <div className="overviewTileLabel">{label}</div>
            <div className="overviewTileDisplayValue">{displayValue}</div>
            {supportValue && <div className="overViewItemSupportValue">{supportValue}</div>}
        </div>
    )
}

export default OverviewTile