import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, FieldArray, useFormikContext } from 'formik';
import { useRouter } from 'next/dist/client/router';
import InputField from './FormItems/InputField';

type Props = {
    connectedWallets: string[]
}

const AddAccountsForm: React.FC<Props> = ({
    connectedWallets
}) => {
    const router = useRouter()

    return (
        <Formik
            initialValues={{
                addresses: connectedWallets || [""]
            }}
            onSubmit={(values) => {
                const { addresses } = values
                const query = addresses
                    .filter(address => address !== "")
                    .map(address => "addresses=" + address)
                    .join("&")
                console.log(query)
                router.push(`/app?${query}`)
            }}
            enableReinitialize
        >
            {({ values }) => (
                <Form className='addresses-form'>
                    <FieldArray
                        name="addresses"
                    >
                        {(arrayHelpers) => (<>
                            {values.addresses.map((address, index) => (
                                <Field key={index} name={`addresses.${index}`} as={InputField} value={address} onDelete={() => arrayHelpers.remove(index)} />
                            ))}
                            <button
                                onClick={() => arrayHelpers.push("")}
                                type="button"
                                className='crud-button address-add-button'
                            >
                                <span className="material-icons">add</span>
                            </button>
                        </>)}
                    </FieldArray>
                    <Field
                        as="button"
                        type="submit"
                        className="btn btn-primary btn-rounded"
                        style={{ width: "100%", maxWidth: 300 }}
                    >
                        See Gas
                    </Field>
                </Form>
            )}
        </Formik>
    )
}


export default AddAccountsForm