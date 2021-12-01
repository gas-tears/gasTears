import React from 'react'
import { Formik, Field, Form, FieldArray } from 'formik';
import { useRouter } from 'next/dist/client/router';


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
                <Form>
                    <FieldArray
                        name="addresses"
                    >
                        {(arrayHelpers) => (<>
                            {values.addresses.map((address, index) => (
                                <div key={index}>
                                    <Field name={`addresses.${index}`} as="input" value={address} />
                                    <button type="button" onClick={() => arrayHelpers.remove(index)}>X</button>
                                </div>
                            ))}
                            <button
                                onClick={() => arrayHelpers.push("")}
                                type="button"
                            >
                                Add Another Wallet Address
                            </button>
                        </>)}
                    </FieldArray>
                    <Field as="button" type="submit">See Gas</Field>
                </Form>
            )}
        </Formik>
    )
}
