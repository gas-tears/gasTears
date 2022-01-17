import React from 'react'
import classNames from "classnames"

type Props = {
    isFirstPage?: boolean
}

const PageContainer: React.FC<Props> = ({
    children,
    isFirstPage
}) => {
    return (
        <div className={classNames({ pageContainer: true, isFirstPage })}>
            {children}
        </div>
    )
}

export default PageContainer