import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import auth from './auth'
import market from './market'
import config from '../config'

Vue.use(Vuex)

const state = () => ({
  user: null
})

const mutations = {
  setUser: (state, user) => state.user = user
}

const actions = {
  update ({ dispatch }) {
    dispatch('loadUserBalances')
  },

  loadUserBalances ({ rootState, state, commit }) {
    if (state.user) {
      // TODO Вынести этот эндпоинт в конфиг
      axios.get(`${config.lightapi}/api/account/${config.name}/${rootState.user.name}`).then((r) => {
        const balances = r.data.balances
        balances.sort((a, b) => {
          if (a.currency < b.currency) { return -1 }
          if (a.currency > b.currency) { return 1 }

          return 0
        })

        let balances_obj = {}

        balances.map(b => b.id = b.currency + '@' + b.contract)
        balances.map(b => balances_obj[b.currency] = b)

        commit('setUser', { ...state.user, balances: balances_obj }, { root: true })
      })
    }
  }
}

export const getters = {
  user (state) {
    return state.user
  },

  baseBalance(state) {
    let balance = 0

    if (state.user && state.user.balances) {
      if (state.user.balances[state.market.baseToken]) {
        return state.user.balances[state.market.baseToken].amount
      }
    }

    return balance.toFixed(balance.degits)
  },

  quoteBalance(state) {
    let balance = 0

    if (state.user && state.user.balances) {
      if (state.user.balances[state.market.quoteToken]) {
        return state.user.balances[state.market.quoteToken].amount
      }
    }

    return balance.toFixed(balance.degits)
  }
}

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      market
    },

    state,
    actions,
    mutations,
    getters,

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
