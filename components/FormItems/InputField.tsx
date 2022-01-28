import { ErrorMessage, FieldProps } from 'formik'
import { default as React } from 'react'

type Props = {
    isConnectedByUser?: boolean
    onDelete?: () => void
}

const InputField: React.FC<FieldProps & Props> = ({
    field,
    meta,
    onDelete,
    isConnectedByUser = false,
    ...props
}) => {
    return (
        <div className='addressInputFieldRow'>
            <div className='addressInputFieldWrapper'>
                {isConnectedByUser &&
                    <div className="addressInputFieldLabel">Connected</div>
                }
                <div className="addressInputFieldMain">
                    <input
                        className="addressTextInput"
                        type="text"
                        disabled={isConnectedByUser}
                        placeholder='Connect or paste a valid crypto address here'
                        {...field}
                    />
                    {onDelete && (
                        <button
                            type='button'
                            onClick={() => onDelete()}
                            className='crudButton addressRemoveButton'
                        >
                            <span className="material-icons">
                                close
                            </span>
                        </button>
                    )}
                </div>
                <ErrorMessage name={field.name} render={(msg) => <div className='addressInputFieldError'>{msg}</div>} />
            </div>
        </div>
    )
}

export default InputField