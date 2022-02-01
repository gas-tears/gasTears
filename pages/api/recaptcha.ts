import type { NextApiRequest, NextApiResponse } from 'next'
import { ExplorerResponse } from "types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExplorerResponse>
) {
    const { token } = JSON.parse(req.body)
    const url = 'https://www.google.com/recaptcha/api/siteverify'
    
    const apiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    })
    
    const resJSON = await apiRes.json()
    console.log(resJSON)
    res.status(200).json(resJSON)
}