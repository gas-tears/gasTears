import React from 'react'
import classNames from "classnames"

type Props = {
    isSelected: boolean
}

const ChainSelector: React.FC<Props & React.HTMLAttributes<HTMLButtonElement>> = ({
    children,
    isSelected,
    ...props
}) => {
    return (
        <button
            className={classNames("chainFilterTile tilePrimary", { isSelected })}
            {...props}
        >
            {children}
        </button>
    )
}

export default ChainSelector