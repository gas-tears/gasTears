// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { EtherscanTransaction } from "types"

type RequestData = {
  addresses: string
}

type Data = {
  transactions: EtherscanTransaction[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { addresses } = req.body
  console.log(addresses)

  const apikey = process.env.ETHERSCAN_API_KEY
  const etherscanRes = await fetch(`
    https://api.etherscan.io/api
      ?module=account
      &action=txlist
      &address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a
      &startblock=0
      &endblock=99999999
      &page=1
      &offset=10
      &sort=asc
      &apikey=${apikey}
  `)
  const resJSON = await etherscanRes.json()
  res.status(200).json({ transactions: resJSON.results })
}
