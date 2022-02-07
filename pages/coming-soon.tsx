import Button from 'components/Button/Button';
import mailSignUp from 'lib/mailSignup';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RecaptchaTOS from "components/RecaptchaTOS"
import PageContainer from "components/layouts/PageContainer"
import SocialsLink from "components/SocialsLinks"
import * as yup from 'yup';
import GasTears from "../public/gastears.svg";

declare let grecaptcha: any

const ComingSoon: NextPage = () => {
    const [email, setEmail] = useState("")
    const [formError, setFormError] = useState("")

    const submitEmail = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setFormError("")

        try {
            await validationSchema.validate({ email })
        } catch (error: any) {
            setFormError(error.message)
            return
        }

        toast.promise(
            mailSignUp(email),
            {
                pending: {
                    render() {
                        return "Adding your email address"
                    }
                },
                success: {
                    render({ data }) {
                        setEmail("")
                        return data
                    },
                },
                error: {
                    render({ data }) {
                        return data
                    }
                }
            }
        )

    }

    return (<>
        <ToastContainer {...ToastContainer.defaultProps} theme="dark" position={toast.POSITION.BOTTOM_CENTER} />
        <PageContainer>
            <div className='comingSoonPageWrapper'>
                <div className="comingSoonContent">
                    <GasTears className="logoSvg" />
                    <h1 className="comingSoonLogoText">GasTears</h1>

                    <h2 style={{ fontSize: "1.75rem" }}>Launching Soon!</h2>
                    <p className="comingSoonText">Sign up below to be notified of our release</p>
                    <form
                        className="comingSoonInput"
                        onSubmit={submitEmail}
                    >
                        <div>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                className="addressTextInput"
                                type="text"
                                placeholder='example@email.com'
                            />
                            {formError &&
                                <div className='addressInputFieldError'>{formError}</div>
                            }
                        </div>
                        <Button
                            primary
                            rounded
                            type="submit"
                        >
                            Notify me
                        </Button>
                    </form>
                </div>
            </div>
            <SocialsLink />
            <RecaptchaTOS />
        </PageContainer>
    </>)
}

const validationSchema = yup.object().shape({
    email: yup
        .string()
        .required("Please input an email address")
        .email("Please use a valid email address")
})

export default ComingSoon