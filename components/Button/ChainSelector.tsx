import classNames from "classnames"
import React from 'react'
import Skeleton from "react-loading-skeleton"
import Icon, { IconName } from "../Icon/Icon"

type Props = {
    isSelected: boolean,
    isLoading?: boolean,
    iconName?: IconName
}

const ChainSelector: React.FC<Props & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    isSelected,
    isLoading = false,
    iconName,
    ...props
}) => {
    if (isLoading) return <Skeleton height={37} width={70} borderRadius={5} />

    return (
        <button
            className={classNames("chainFilterTile tilePrimary", { isSelected })}
            {...props}
        >
            {iconName && <Icon name={iconName} width={18} height={18} />}
            {children}
        </button>
    )
}


export default ChainSelector