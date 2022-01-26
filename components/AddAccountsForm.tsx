import React, { useEffect, useState, useContext } from 'react'
import { Formik, Field, Form, FieldArray, useFormikContext } from 'formik';
import { useRouter } from 'next/dist/client/router';
import InputField from './FormItems/InputField';
import { WalletConnectContext } from "components/WalletConnectContext"
import useLocalStorage from 'hooks/useLocalStorage';
import Button from './Button';

type Wallet = {
    address: string,
    isConnectedByUser: boolean
}

type FieldValues = {
    wallets: Wallet[]
}

const AddAccountsForm: React.FC = () => {
    const router = useRouter()
    const [storedWallets, setStoredWallets] = useLocalStorage<Wallet[]>("wallets", [{ address: "", isConnectedByUser: false }])
    console.log(storedWallets)
    return (
        <Formik
            initialValues={{
                wallets: storedWallets
            }}
            onSubmit={(values) => {
                console.log(values)
                const { wallets } = values
                const query = wallets
                    .filter(wallet => wallet.address !== "")
                    .map(wallet => "addresses=" + wallet.address)
                    .join("&")
                router.push(`/app?${query}`)
            }}
        >
            {({ values }) => (
                <Form className='addresses-form'>
                    <FieldArray
                        name="wallets"
                    >
                        {(arrayHelpers) => (<>
                            {values.wallets.map((wallet, index) => (
                                <Field
                                    key={index}
                                    name={`wallets[${index}].address`}
                                    as={InputField}
                                    isConnectedByUser={wallet.isConnectedByUser}
                                    onDelete={() => arrayHelpers.remove(index)}
                                />
                            ))}
                            {values.wallets.length < 5 &&
                                <button
                                    onClick={() => arrayHelpers.push({ address: "", isConnectedByUser: false })}
                                    type="button"
                                    className='crudButton addressAddButton'
                                    title="add new address"
                                >
                                    <span className="material-icons">add</span>
                                </button>
                            }
                        </>)}
                    </FieldArray>
                    <Field
                        as={Button}
                        type="submit"
                        primary
                        rounded
                        style={{ width: "100%", maxWidth: 200, marginTop: "1rem" }}
                        disabled={storedWallets.length == 0}
                    >
                        See Gas
                    </Field>
                    <FormikHack setStoredWallets={setStoredWallets} />
                </Form>
            )}
        </Formik>
    )
}

type FormikHackProps = {
    setStoredWallets: (value: Wallet[]) => void
}

const FormikHack = ({ setStoredWallets }: FormikHackProps) => {
    const { values, setFieldValue } = useFormikContext<FieldValues>();
    const { connectedWallets } = useContext(WalletConnectContext)

    useEffect(() => {
        if (!connectedWallets || connectedWallets.length === 0) return
        const currentConnectedWallet = connectedWallets[0]
        // the connected wallet address is already in the array
        if (values.wallets.findIndex((wallet) => wallet.address === currentConnectedWallet) !== -1) return

        let newWallets = [...values.wallets]
        const replaceIdx = newWallets.findIndex((wallet) => wallet.address === "")

        const newWallet = { address: connectedWallets[0], isConnectedByUser: true }
        if (replaceIdx !== -1) {
            newWallets[replaceIdx] = newWallet
        } else {
            newWallets.push(newWallet)
        }

        setFieldValue("wallets", newWallets)
    }, [connectedWallets])

    useEffect(() => {
        setStoredWallets(values.wallets)
    }, [values.wallets])

    return null
}


export default AddAccountsForm