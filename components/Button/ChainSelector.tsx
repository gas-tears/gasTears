import React from 'react'
import classNames from "classnames"
import Skeleton from "react-loading-skeleton"

type Props = {
    isSelected: boolean,
    isLoading?: boolean
}

const ChainSelector: React.FC<Props & React.HTMLAttributes<HTMLButtonElement>> = ({
    children,
    isSelected,
    isLoading = false,
    ...props
}) => {
    if (isLoading) return <Skeleton height={37} width={70} borderRadius={5} />

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