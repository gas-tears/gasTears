import React from 'react'
import { FieldProps } from 'formik'

type Props = {
    isConnectedByUser?: boolean
    onDelete?: () => void
}

const InputField: React.FC<FieldProps & Props> = ({
    field,
    form,
    onDelete,
    isConnectedByUser = false,
    ...props
}) => {
    return (
        <div className='addressInputFieldRow'>
            <div className='addressInputFieldWrapper'>
                {isConnectedByUser && <div className='addressInputFieldLabel'>Connected</div>}
                <div className="addressInputFieldMain">
                    <input
                        className="addressTextInput"
                        type="text"
                        disabled={isConnectedByUser}
                        {...field}
                        {...props}
                    />
                    {onDelete && (
                        <button
                            type='button'
                            onClick={() => onDelete()}
                            className='crud-button address-remove-button'
                        >
                            <span className="material-icons">
                                close
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InputField