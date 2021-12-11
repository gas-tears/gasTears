import React, { useEffect, useState, useContext } from 'react'
import { Formik, Field, Form, FieldArray, useFormikContext } from 'formik';
import { useRouter } from 'next/dist/client/router';
import InputField from './FormItems/InputField';
import { WalletConnectContext } from "components/WalletConnectContext"

const AddAccountsForm: React.FC = () => {
    const router = useRouter()
    const { connectedWallets } = useContext(WalletConnectContext)

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
                    <FormikHack accounts={connectedWallets} />
                </Form>
            )}
        </Formik>
    )
}

const FormikHack = ({ accounts }) => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        if (!accounts || accounts.length === 0) return
        let newValues = [...values.addresses]
        const replaceIdx = newValues.indexOf("")

        if (replaceIdx !== -1) {
            newValues[replaceIdx] = accounts[0]
        } else {
            newValues.push(accounts[0])
        }

        setFieldValue("addresses", newValues)
    }, [accounts])

    return null
}


export default AddAccountsForm