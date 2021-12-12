import React, { useEffect, useState, useContext } from 'react'
import { Formik, Field, Form, FieldArray, useFormikContext } from 'formik';
import { useRouter } from 'next/dist/client/router';
import InputField from './FormItems/InputField';
import { WalletConnectContext } from "components/WalletConnectContext"
import useLocalStorage from 'hooks/useLocalStorage';
import Button from './Button';

const AddAccountsForm: React.FC = () => {
    const router = useRouter()
    const [storedWallets, setStoredWallets] = useLocalStorage("wallets", [""])

    return (
        <Formik
            initialValues={{
                addresses: storedWallets || [""]
            }}
            onSubmit={(values) => {
                const { addresses } = values
                const query = addresses
                    .filter(address => address !== "")
                    .map(address => "addresses=" + address)
                    .join("&")
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
                        as={Button}
                        type="submit"
                        primary
                        rounded
                        style={{ width: "100%", maxWidth: 300 }}
                    >
                        See Gas
                    </Field>
                    <FormikHack setStoredWallets={setStoredWallets} />
                </Form>
            )}
        </Formik>
    )
}

const FormikHack = ({ setStoredWallets }) => {
    const { values, setFieldValue } = useFormikContext();
    const { connectedWallets } = useContext(WalletConnectContext)

    useEffect(() => {
        if (!connectedWallets || connectedWallets.length === 0) return
        if (values.addresses.indexOf(connectedWallets[0]) !== -1) return // the connected wallet address is already in the array

        let newValues = [...values.addresses]
        const replaceIdx = newValues.indexOf("")

        if (replaceIdx !== -1) {
            newValues[replaceIdx] = connectedWallets[0]
        } else {
            newValues.push(connectedWallets[0])
        }

        setFieldValue("addresses", newValues)
    }, [connectedWallets])

    useEffect(() => {
        setStoredWallets(values.addresses)
    }, [values.addresses])

    return null
}


export default AddAccountsForm