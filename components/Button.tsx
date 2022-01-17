import React from 'react'
import classNames from "classnames"

type ButtonProps = {
    primary?: boolean,
    secondary?: boolean,
    rounded?: boolean
}

const Button: React.FC<ButtonProps & React.HTMLAttributes<HTMLButtonElement>> = ({
    children,
    primary,
    secondary,
    rounded,
    ...props
}) => {
    return (
        <button
            className={
                classNames("btn", { "btnPrimary": primary }, { "btnRounded": rounded }, { "btnSecondary": secondary })}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
