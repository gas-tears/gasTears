const mailSignUp = (email: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            // setTimeout(() => console.log("hello"), 5000)
            const apiRes = await fetch('/api/email-signup', {
                method: "POST",
                body: JSON.stringify({
                    email
                })
            })

            console.log(apiRes)

            if (apiRes.ok) {
                resolve("You have sucessfully signed up to our email list. Please check your inbox to confirm your email address")
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
        }

    })
}


export default mailSignUp