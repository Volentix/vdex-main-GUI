import { Serialize } from 'eosjs'
import Big from 'big.js'

import config from './../config'

export const sort_by_price = (a, b) => (a.unit_price < b.unit_price) ? 1 : ((b.unit_price < a.unit_price) ? -1 : 0)

export function amountToFloat (amount, precision) {
  const scale = new Big(10).pow(precision)
  const prefix = Big(amount).div(scale)

  return Number.parseFloat(prefix).toFixed(precision)
}

export function assetToAmount (amount, precision) {
  const scale = new Big(10).pow(precision)

  return parseInt(new Big(Number(amount)).times(scale))
}

export function calculatePrice (sell, buy) {
  let first = parseAsset(buy)
  let second = parseAsset(sell)

  if (second.symbol === 'EOS' && sell.contract === 'eosio.token')
    // EOS main token as main in price
    [first, second] = [second, first]

  const price = (first.amount / second.amount).toFixed(config.PRICE_DIGITS)

  return `${price} EOS`
}

export function parseExtendedAsset (asset) {
  const symbol = Serialize.stringToSymbol(asset.symbol)

  return {
    contract: asset.contract,
    symbol,

    str: symbol.name + '@' + asset.contract
  }
}

export function parseAsset (asset) {
  if (asset.hasOwnProperty('symbol')) return asset

  let [amount, symbol] = asset.split(' ')
  const precision = amount.split('.')[1] ? amount.split('.')[1].length : 0

  const scale = new Big(10).pow(precision)
  amount = parseInt(new Big(amount).times(scale))

  return {
    symbol: {
      symbol,
      precision
    },

    amount,

    get prefix () {
      return amountToFloat(this.amount, this.symbol.precision)
    },

    get quantity () {
      return this.prefix + ' ' + this.symbol.symbol
    }
  }
}

export function mergeSamePriceOrders(ords) {
  // Avoid mutatind store
  ords = JSON.parse(JSON.stringify(ords))

  let orders = {}

  ords.map(o => {
    orders[o.unit_price] ? orders[o.unit_price].push(o) : orders[o.unit_price] = [o]
  })

  return Object.values(orders).map(o => {
    let one_order = { ...o[0] }

    o.slice(1).map(o => {
      one_order.ask.amount += o.ask.amount
      one_order.bid.amount += o.bid.amount

      one_order.ask.prefix = (parseFloat(one_order.ask.prefix) + parseFloat(o.ask.prefix)).toFixed(one_order.ask.symbol.precision)
      one_order.bid.prefix = (parseFloat(one_order.bid.prefix) + parseFloat(o.bid.prefix)).toFixed(one_order.bid.symbol.precision)
    })

    one_order.ask.quantity = `${one_order.ask.prefix} ${one_order.ask.symbol.symbol}`
    one_order.bid.quantity = `${one_order.bid.prefix} ${one_order.bid.symbol.symbol}`

    return one_order
  }).reverse()
}
