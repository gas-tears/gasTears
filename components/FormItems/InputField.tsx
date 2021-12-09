import React from 'react'
import { FieldProps } from 'formik'

type Props = {
    onDelete?: () => void
}

const InputField: React.FC<FieldProps & Props> = ({
    field,
    form,
    onDelete,
    ...props
}) => {
    return (
        <div className='input-field-wrapper'>
            <input className="address-text-input" type="text" {...field} {...props} />
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
    )
}

export default InputField