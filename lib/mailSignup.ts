declare let grecaptcha: any

const mailSignUp = (email: string) => {
    return new Promise(async (resolve, reject) => {
        const token = await grecaptcha.execute('6LdYfEkeAAAAALIxY3AisT6fBgj12DW3aV8GDBWn', { action: 'submit' })
        const apiRes = await fetch('/api/recaptcha', {
            method: "POST",
            body: JSON.stringify({
                token
            })
        })

        const res = await apiRes.json()
        if (!res.success && res.score < 0.5) {
            reject("Something seems wrong...")
            return
        }

        try {
            // setTimeout(() => console.log("hello"), 5000)
            const apiRes = await fetch('/api/email-signup', {
                method: "POST",
                body: JSON.stringify({
                    email
                })
            })

            if (apiRes.ok) {
                resolve("You have sucessfully signed up to our email list. Please check your inbox or spam folder to confirm your email address")
            }

            else if (apiRes.status === 400) {
                const error = await apiRes.json()
                reject(error.message)
            }
            else {
                reject(apiRes.statusText)
            }
        } catch (error: any) {
            console.error(error)
            reject("An error has occured, please try again later.")
        }

    })
}


export default mailSignUp