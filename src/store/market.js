import { api, rpc, hyperion, getSellOrders, getBuyOrders } from '../api'
import { parseAsset, parseExtendedAsset } from '../utils'
import config from '../config'


export const sort_by_price = (a, b) => (a.unit_price < b.unit_price) ? 1 : ((b.unit_price < a.unit_price) ? -1 : 0)


const state = () => ({
  user: null,
  baseToken: 'VTX',
  quoteToken: '',
  markets: [],
  market: {}, // Current market
  bids: [],
  asks: [],
  matches: [],
  history: []
})

const mutations = {
  setUser: (state, user) => state.user = user,
  setMarket: (state, market) => state.market = market,
  setMarkets: (state, markets) => state.markets = markets,
  setBaseToken: (state, token) => state.baseToken = token,
  setQuoteToken: (state, token) => state.quoteToken = token,
  setBids: (state, bids) => state.bids = bids,
  setAsks: (state, asks) => state.asks = asks,
  setHistory: (state, history) => state.history = history,
  setMatches: (state, matches) => {
    state.matches = matches
  }
}

const actions = {
  async init ({ state, commit, dispatch }) {
    await dispatch('fetchMarkets')

    if (state.markets.length > 0) {
      commit('setMarket', state.markets[0])
    }
  },

  update ({ dispatch }) {
    dispatch('loadUserBalances')
  },

  setBaseToken ({ commit, dispatch }, token) {
    commit('setBaseToken', token)
    dispatch('fetchMarkets', token)
  },

  setMarket ({ state, commit, dispatch, getters }, quoteToken) {
    let market = state.markets.filter(m => m.quote === quoteToken)[0]

    rpc.get_table_rows({
      code: getters.contract,
      scope: getters.contract,
      table: 'markets',
      lower_bound: market.market_id,
      limit: 1
    }).then(r => {
      market.token = r.rows[0].token
    })

    commit('setMarket', market)
    commit('setQuoteToken', market.quote)
    dispatch('fetchMarket')
  },

  async fetchMarket ({ state, commit, getters, dispatch }) {
    dispatch('loadUserBalances', null, { root: true })

    api.get(`charts?quote=${state.quoteToken}&base=${state.baseToken}`).then(r => {
      commit('setHistory', r.data)
      this.history = r.data
    }).catch(e => {
      console.log('graph fetch error:', e)
    })

    hyperion.get('/history/get_actions', { params:
      // TODO Fetch all actions
      {
        account: config.CONTRACTS[state.baseToken],
        // skip: skip,
        sort: '1',
        limit: '1000'
      }
    }).then(r => {
      let matches = r.data.actions.filter(m => ['sellmatch', 'buymatch'].includes(m.act.name)).map(m => {
        let data = m.act.data.record
        data.type = m.act.name
        data.ask = parseAsset(data.ask)
        data.bid = parseAsset(data.bid)

        return data
      })

      commit('setMatches', matches)
    })

    let [bids, asks] = await Promise.all([
      getBuyOrders(getters.contract, state.market.market_id),
      getSellOrders(getters.contract, state.market.market_id)
    ])

    bids.map((b) => {
      b.ask = parseAsset(b.ask)
      b.bid = parseAsset(b.bid)
    })

    asks.map((b) => {
      b.ask = parseAsset(b.ask)
      b.bid = parseAsset(b.bid)
    })

    commit('setBids', bids.sort(sort_by_price))
    commit('setAsks', asks.sort(sort_by_price))
  },

  async fetchMarkets ({ state, commit }, baseToken) {
    let { data } = await api.get('markets', { params: { base: baseToken } })

    commit('setMarkets', data)
  }
}

export const getters = {
  userBalance () {
    // TODO
    return '0.0000 EOS'
  },

  matches (state) {
    return state.matches.filter(m => m.market.token.symbol.split(',')[1] === state.quoteToken)
  },

  price (state) {
    if (state.bids.length) {
      return state.bids[0].unit_price
    }

    if (state.asks.length) {
      return state.asks[state.asks.length - 1].unit_price
    }

    return 0
  },

  spread (state, { vm }) {
    if (!state.bids.length || !state.asks.length) {
      return 0
    }

    return Math.abs(state.bids[0].unit_price - state.asks[state.asks.length - 1].unit_price)
  },

  contract (state) {
    return config.CONTRACTS[state.baseToken]
  },

  baseToken: state => {
    return {
      symbol: state.baseToken,
      ...config.ASSETS[state.baseToken]
    }
  },

  quoteToken: state => {
    return {
      symbol: state.quoteToken,
      ...config.ASSETS[state.quoteToken]
    }
  }
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
