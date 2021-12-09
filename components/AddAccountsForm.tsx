import React from 'react'
import { Formik, Field, Form, FieldArray } from 'formik';
import { useRouter } from 'next/dist/client/router';
import InputField from './FormItems/InputField';

export default function AddAccountsForm() {
    const router = useRouter()

    return (
        <Formik
            initialValues={{
                addresses: [""]
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
        >
            {({ values }) => (
                <Form className='addresses-form'>
                    <FieldArray
                        name="addresses"
                    >
                        {(arrayHelpers) => (<>
                            {values.addresses.map((address, index) => (
                                <Field name={`addresses.${index}`} as={InputField} value={address} onDelete={() => arrayHelpers.remove(index)} />
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
                    >
                        See Gas
                    </Field>
                </Form>
            )}
        </Formik>
    )
}
