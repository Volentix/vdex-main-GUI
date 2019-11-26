import Vue from 'vue'
import config from '../config'
import moment from 'vue-moment'

Vue.use(moment)

Vue.filter('decimal', value => {
  return String(value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')
})

Vue.filter('sign', value => {
  return value.toString().toLowerCase().replace(/\s/g, '')
})

Vue.filter('humanFloat', function (amount, PRICE_DIGITS = config.PRICE_DIGITS) {
  return (amount / config.PRICE_SCALE).toFixed(PRICE_DIGITS)
})
