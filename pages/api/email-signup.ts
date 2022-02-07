import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email } = JSON.parse(req.body)

    const mailChimpApiKey = process.env.MAIL_CHIMP_API_KEY
    const region = mailChimpApiKey?.split("-")[1]

    const url = `https://${region}.api.mailchimp.com/3.0/lists/${process.env.MAIL_CHIMP_LIST_ID}/members`
    const data = JSON.stringify({
        email_address: email,
        status: "pending"
    })

    const apiRes = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${mailChimpApiKey}`,
            "Content-type": "application/json"
        },
        body: data
    })

    const resJSON = await apiRes.json()
    const { status, detail } = resJSON

    res.status(status === "pending" ? 200 : status).json({ message: detail })
}