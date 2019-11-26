import ScatterJS from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import { Notify } from 'quasar'

import { rpc, eos, api } from '../api'
import config from '../config'

ScatterJS.plugins(new ScatterEOS())

export const network = ScatterJS.Network.fromJson({
  blockchain: 'eos',
  ...config
})

export const state = () => ({
  scatterConnected: true,
  oldScatter: false
})

export const actions = {
  async init ({ state, commit, dispatch }) {
    console.log('Connect scatter..')

    await ScatterJS.connect(config.APP_NAME, { network }).then(v =>
      commit('setScatterConnected', v)
    )

    if (state.scatterConnected) {
      window.scatterConnected = true
      await dispatch('login')
    } else {
      await dispatch('init')
    }

    console.log('App starting..')
  },

  async logout ({ commit }) {
    await ScatterJS.logout()
    commit('setUser', null, { root: true })
  },

  async login ({ state, commit, dispatch, rootState }) {
    if (!state.scatterConnected) {
      return Notify.create('Scatter is not connected')
    }

    try {
      const r = await ScatterJS.login()

      commit('setUser', r.accounts[0], { root: true })

      api.post('register_account', { name: rootState.user.name }).then(r => {
        commit('setUser', { ...rootState.user, ...r.data }, { root: true })
      })

      dispatch('loadUserBalances', {}, { root: true })
    } catch (e) {
      return Notify.create('Login: ' + e.message)
    }
  },

  async scatterConnect ({ commit }) {
    commit(
      'setScatterConnected',
      await ScatterJS.connect('Ordersbook', { network })
    )
  }
}

export const mutations = {
  setUser: (state, user) => {
    state.user = user
  },
  setScatterConnected: (state, value) => {
    state.scatterConnected = value
  },
  setOldScatter: (state, value) => {
    state.oldScatter = value
  }
}

export const getters = {
  rpc: () => rpc,
  eos: () => eos,
  scatter: () => ScatterJS.scatter
}

export function transfer (contract, actor, to, quantity, memo) {
  return eos.transact(
    {
      actions: [
        {
          account: contract,
          name: 'transfer',
          authorization: [
            {
              actor,
              permission: 'active'
            }
          ],
          data: {
            from: actor,
            to: to,
            quantity,
            memo
          }
        }
      ]
    },
    { blocksBehind: 3, expireSeconds: 3 * 60 }
  )
}

export function cancelorder (contract, account, market_id, type, order_id) {
  return eos.transact(
    {
      actions: [
        {
          account: contract,
          name: type === 'bid' ? 'cancelbuy' : 'cancelsell',
          authorization: [
            {
              actor: account,
              permission: 'active'
            }
          ],
          data: { executor: account, market_id, order_id }
        }
      ]
    },
    { blocksBehind: 3, expireSeconds: 3 * 60 }
  )
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
