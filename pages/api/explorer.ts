// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ExplorerResponse, Chains } from "types"

type ChainToApiKey = {
  [Chain in Chains]?: string
}

type ChainToApiEndpointUrl = {
  [Chain in Chains]?: string
}

const CHAIN_TO_API_KEY_MAP : ChainToApiKey = {
  "avalanche-2": process.env.SNOWTRACE_API_KEY,
  "binancecoin": process.env.BSCSCAN_API_KEY,
  "ethereum": process.env.ETHERSCAN_API_KEY,
  "fantom": process.env.FTMSCAN_API_KEY,
  "matic-network": process.env.POLYGONSCAN_API_KEY,
}

const CHAIN_TO_API_ENDPOINT_URL : ChainToApiEndpointUrl = {
  "avalanche-2": "https://api.snowtrace.io/api",
  "binancecoin": "https://api.bscscan.com/api",
  "ethereum": "https://api.etherscan.io/api",
  "fantom": "https://api.ftmscan.com/api",
  "matic-network": "https://api.polygonscan.com/api"
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExplorerResponse>
) {
  const { addresses } = JSON.parse(req.body)
  const result : ExplorerResponse = {}
  const chains : Chains[] = ["avalanche-2", "binancecoin", "ethereum", "fantom", "matic-network"];

  await Promise.all(chains.map(async (chain: Chains) => {
    const allTransactions = await Promise.all(addresses.map((address: string) => getAllTransactions(address, chain)))
    addresses.forEach((address: string, index: number) => {
      if (!(chain in result)) {
        result[chain] = {}
      }
      result[chain][address] = allTransactions[index]
    })
  }))

  res.status(200).json(result)
}

const getAllTransactions = (address: string, chain: Chains) => {
  return new Promise(async (resolve, reject) => {
    const url = CHAIN_TO_API_ENDPOINT_URL[chain]?.concat(`?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&sort=asc&apikey=${CHAIN_TO_API_KEY_MAP[chain]}`)
    
    const res = await fetch(url)
    const resJSON = await res.json()
    
    // Return early if there was error with api query, don't want to reject because that will fail the Promise.all
    if (resJSON.status !== "1") resolve(resJSON) 

    let resultTransactions = resJSON.result
    const totalTransactions = resultTransactions

    while (resultTransactions.length === 10000) { //10,000 is the max result the api will return
      const prevLastBlock = resultTransactions[resultTransactions.length - 1].blockNumber
      const url = CHAIN_TO_API_ENDPOINT_URL[chain]?.concat(`?module=account&action=txlist&address=${address}&startblock=${prevLastBlock}&endblock=99999999&page=1&sort=asc&apikey=${CHAIN_TO_API_KEY_MAP[chain]}`)
      
      const res = await fetch(url)
      const resJSON = await res.json()

      // Return early if there was error with api query, don't want to reject because that will fail the Promise.all
      if (resJSON.status !== "1") resolve(resJSON) 

      resultTransactions = resJSON.result
      totalTransactions.concat(resultTransactions)
    }

    resolve(totalTransactions)
  })
}