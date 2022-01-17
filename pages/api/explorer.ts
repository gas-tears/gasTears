// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ExplorerResponse, AddressToTransactionsMap, Transaction, Chains, VSCurrencies } from "types"

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExplorerResponse>
) {
  const { addresses } = JSON.parse(req.body)

  const allAddressesEthereumTransactions = await Promise.all(addresses.map((address: string) => getAllEthereumTransactionsForAddress(address)))
  const allAddressesAvalancheTransactions = await Promise.all(addresses.map((address: string) => getAllAvalancheTransactionsForAddress(address)))

  const addressToEthereumTransactionsMap: AddressToTransactionsMap = {}
  const addressToAvalancheTransactionsMap: AddressToTransactionsMap = {}

  addresses.forEach((address: string, index: number) => {
    addressToEthereumTransactionsMap[address] = allAddressesEthereumTransactions[index]
    addressToAvalancheTransactionsMap[address] = allAddressesAvalancheTransactions[index]
  })

  const result: ExplorerResponse = {
    "ethereum": addressToEthereumTransactionsMap,
    "avalanche-2": addressToAvalancheTransactionsMap
  }

  res.status(200).json(result)
}

const getAllEthereumTransactionsForAddress = (address: string) => {
  return new Promise(async (resolve, reject) => {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&sort=asc&apikey=${ETHERSCAN_API_KEY}`
    const etherscanRes = await fetch(url)
    const resJSON = await etherscanRes.json()

    if (resJSON.status !== "1") resolve(resJSON) // Return early if there was error with api query, don't want to reject because that will fail the Promise.all

    let resultTransactions = resJSON.result
    const totalTransactions = resultTransactions

    while (resultTransactions.length === 10000) { //10,000 is the max result the api will return
      const prevLastBlock = resultTransactions[resultTransactions.length - 1].blockNumber
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${prevLastBlock}&endblock=99999999&page=1&sort=asc&apikey=${ETHERSCAN_API_KEY}`
      const etherscanRes = await fetch(url)
      const resJSON = await etherscanRes.json()

      if (resJSON.status !== "1") resolve(resJSON) // Return early if there was error with api query, don't want to reject because that will fail the Promise.all

      resultTransactions = resJSON.result
      totalTransactions.concat(resultTransactions)
    }

    resolve(totalTransactions)
  })
}

const getAllAvalancheTransactionsForAddress = (address: string) => {
  return new Promise(async (resolve, reject) => {
    const url = `https://api.snowtrace.io/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${SNOWTRACE_API_KEY}`
    const snowtraceRes = await fetch(url)
    const resJSON = await snowtraceRes.json()

    if (resJSON.status !== "1") resolve(resJSON) // Return early if there was error with api query, don't want to reject because that will fail the Promise.all

    let resultTransactions = resJSON.result
    const totalTransactions = resultTransactions

    while (resultTransactions.length === 10000) { //10,000 is the max result the api will return
      const prevLastBlock = resultTransactions[resultTransactions.length - 1].blockNumber
      const url = `https://api.snowtrace.io/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${SNOWTRACE_API_KEY}`
      const snowtraceRes = await fetch(url)
      const resJSON = await snowtraceRes.json()

      resultTransactions = resJSON.result
      totalTransactions.concat(resultTransactions)
    }

    resolve(totalTransactions)
  })
}