import { WalletConnectContext } from "components/WalletConnectContext";
import { Field, FieldArray, FieldProps, Form, Formik, useFormikContext } from 'formik';
import useLocalStorage from 'hooks/useLocalStorage';
import { useRouter } from 'next/dist/client/router';
import { default as React, useContext, useEffect } from 'react';
import * as yup from 'yup';
import Button from './Button/Button';
import InputField from './FormItems/InputField';

declare let grecaptcha: any

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

    return (
        <Formik
            initialValues={{
                wallets: storedWallets
            }}
            onSubmit={(values) => {
                const { wallets } = values
                const query = wallets
                    .filter(wallet => wallet.address !== "")
                    .map(wallet => "addresses=" + wallet.address)
                    .join("&")
                grecaptcha.ready(function () {
                    grecaptcha
                        .execute('6LdYfEkeAAAAALIxY3AisT6fBgj12DW3aV8GDBWn', { action: 'submit' })
                        .then(async function (token: string) {
                            const apiRes = await fetch('/api/recaptcha', {
                                method: "POST",
                                body: JSON.stringify({
                                    token
                                })
                            })

                            const res = await apiRes.json()
                            if (res.success && res.score >= 0.5) {
                                if (apiRes.ok) {
                                    router.push(`/app?${query}`)
                                }
                            }
                        })
                })
            }}
            validationSchema={validationSchema}
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
                                >
                                    {(formikFieldProps: FieldProps) => (
                                        <InputField
                                            {...formikFieldProps}
                                            isConnectedByUser={wallet.isConnectedByUser}
                                            onDelete={() => arrayHelpers.remove(index)}
                                        />
                                    )}
                                </Field>
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

const validationSchema = yup.object().shape({
    wallets: yup.array()
        .of(
            yup.object().shape({
                address: yup
                    .string()
                    .required("No wallet, no gas")
                    .matches(
                        /^0x[a-fA-F0-9]{40}$/,
                        "Wrong wallet, no gas"
                    )
                ,
                isConnectedByUser: yup.boolean(),
            })
        )
        .min(1, 'No wallet, no gas')
        .max(5, 'No wallet, no gas'),
});


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