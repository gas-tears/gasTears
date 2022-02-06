import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email } = JSON.parse(req.body)

    const url = 'https://us20.api.mailchimp.com/3.0/lists/80e1a388f7/members'

    const data = JSON.stringify({
        email_address: email,
        status: "pending"
    })

    const apiRes = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.MAIL_CHIMP_API_KEY}`,
            "Content-type": "application/json"
        },
        body: data
    })

    const resJSON = await apiRes.json()

    const { status, detail } = resJSON

    res.status(status === "pending" ? 200 : status).json({ message: detail })
}