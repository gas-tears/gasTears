import React from 'react'

const ContentContainer: React.FC = ({
    children
}) => {
    return (
        <div className='contentContainer'>
            {children}
        </div>
    )
}

export default ContentContainer