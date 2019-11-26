import Vue from 'vue'

import config from '~/config'

Vue.filter('monitorAccount', function (account) {
  return `${config.monitor}/account/${account}`
})


Vue.filter('humanFloat', function(amount, PRICE_DIGITS = config.PRICE_DIGITS) {
    return (amount / config.PRICE_SCALE).toFixed(PRICE_DIGITS)
})


Vue.prototype.$tokenLogo = function(symbol, contract) {
  
 
  return `https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/${contract}/${symbol}.png`
}
