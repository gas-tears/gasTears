import React from 'react'

const PageContainer: React.FC = ({
    children
}) => {
    return (
        <div className='pageContainer'>
            {children}
        </div>
    )
}

export default PageContainer