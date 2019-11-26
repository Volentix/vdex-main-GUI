import Vue from 'vue'
//import money from 'v-money'
import VueTheMask from 'vue-the-mask'

import VueNumericInput from 'vue-numeric-input'
import VueNumeric from 'vue-numeric'

Vue.use(VueNumeric)
Vue.use(VueNumericInput)
//Vue.use(VueTheMask)

export default ({ app, store }) => {
  store.dispatch('auth/init')
  store.dispatch('market/init')

  setInterval(function() { store.dispatch('market/fetchMarket') }, 10 * 1000)
}
