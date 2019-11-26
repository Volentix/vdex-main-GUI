import axios from 'axios'
import ScatterJS from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import { Api, JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

import config from './../config'
import { parseAsset } from './../utils'
import { getters } from '../store/market'

ScatterJS.plugins(new ScatterEOS())

export const network = ScatterJS.Network.fromJson({
  blockchain: 'eos',
  ...config
})

export const rpc = new JsonRpc(config.host, { fetch })
export const eos = ScatterJS.eos(network, Api, { rpc, beta3: true })

export const api = axios.create({
  baseURL: process.env.API_HOST || config.api,
  timeout: 2000
})

export const hyperion = axios.create({
  baseURL: config.hyperion,
  timeout: 10000
})

export async function getMarkets (quote, base) {
  return api.get('markets', { quote, base })
}

async function getOrders (contract, market_id, side, kwargs) {
  // Set default options
  kwargs = { limit: 1000, ...kwargs }

  const { rows } = await rpc.get_table_rows({
    code: contract,
    scope: market_id,
    table: `${side}order`,
    limit: 1000,
    ...kwargs
  })

  return rows.map((b) => {
    b.ask = parseAsset(b.ask)
    b.bid = parseAsset(b.bid)
    return b
  })
}

export async function getSellOrders (contract, market_id, kwargs) {
  return await getOrders(contract, market_id, 'sell', kwargs)
}

export async function getBuyOrders (contract, market_id, kwargs) {
  return await getOrders(contract, market_id, 'buy', kwargs)
}
