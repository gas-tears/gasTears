// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Transaction } from "types"

const API_KEY = process.env.ETHERSCAN_API_KEY

type AddressToTransactionsMap = {
  [address: string]: Transaction[]
}

type Data = {
  addressToTransactionsMap: AddressToTransactionsMap
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { addresses } = JSON.parse(req.body)

  const allAddressesTransactions = await Promise.all(addresses.map((address: string) => getAllTractionsForAddress(address)))

  const addressToTransactionsMap = {}

  addresses.forEach((address, index) => addressToTransactionsMap[address] = allAddressesTransactions[index])

  res.status(200).json({ addressToTransactionsMap })
}


const getAllTractionsForAddress = (address: string) => {
  return new Promise(async (resolve, reject) => {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&sort=asc&apikey=${API_KEY}`
    const etherscanRes = await fetch(url)
    const resJSON = await etherscanRes.json()

    if (resJSON.status !== "1") resolve(resJSON) // Return early if there was error with api query, don't want to reject because that will fail the Promise.all

    let resultTransactions = resJSON.result
    const totalTransactions = resultTransactions

    while (resultTransactions.length === 10000) { //10,000 is the max result the api will return
      const prevLastBlock = resultTransactions[resultTransactions.length - 1].blockNumber
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${prevLastBlock}&endblock=99999999&page=1&sort=asc&apikey=${API_KEY}`
      const etherscanRes = await fetch(url)
      const resJSON = await etherscanRes.json()

      resultTransactions = resJSON.result
      totalTransactions.concat(resultTransactions)
    }

    resolve(totalTransactions)
  })
}