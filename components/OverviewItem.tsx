import React from 'react'

type Props = {
    label: string,
    displayValue: string | number,
    supportValue?: string
}

const OverviewItem: React.FC<Props> = ({
    label,
    displayValue,
    supportValue
}) => {
    return (
        <div className="overviewItem">
            <div className="overviewItemLabel">{label}</div>
            <div className="overviewItemDisplayValue">{displayValue}</div>
            {supportValue && <div className="overViewItemSupportValue">{supportValue}</div>}
        </div>
    )
}

export default OverviewItem