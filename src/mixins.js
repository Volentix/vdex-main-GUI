import { EventBus } from 'src/utils/event-bus'
import config from 'src/config'
import { assetToAmount, amountToFloat } from 'src/utils'
import { Notify } from 'quasar'

function correct_price(price, _from, _for) {
  let diff_precision = Math.abs(_from - _for)

  if (_from < _for) {
    price *= Math.pow(10, diff_precision)
  } else if (_from > _for) {
    price /= Math.pow(10, diff_precision)
  }

  return price
}

export const tradeChangeEvents = {
  created() {
    EventBus.$on('setPrice', price => {
      this.price = price
      this.priceChange()
    })

    EventBus.$on('setAmount', amount => {
      this.amount = amount
      this.amountChange()
    })

    EventBus.$on('setTotal', total => {
      this.total = total
      this.totalChange()
    })
  }
}

export const tradeMixin = {
  methods: {
    getValidAmount(amount_str, desc = false) {
      let bp = this.baseToken.precision
      let qp = this.quoteToken.precision

      let amount = assetToAmount(amount_str, qp) || 1

      let price = assetToAmount(this.price, 8)

      let pp = parseFloat(this.price).toString().split('.')
      let price_numbers = pp[1] ? pp[1].length : 0

      price_numbers = qp - bp + price_numbers

      let step = Math.pow(10, price_numbers)

      //let min_amount_number_precision = Math.min(qp, bp)

      //let min_amount = Math.pow(10, price_numbers)
      //min_amount = correct_price(min_amount, min_amount_number_precision, qp)

      //console.log('min_amount', min_amount)

      //if (amount < min_amount) {
      //  amount = min_amount
      //}

      //let minimum_tolal = assetToAmount(Math.round(parseFloat(this.price * Math.pow(10, bp))) / Math.pow(10, bp), bp) || 1
      //console.log('minimum_tolal', minimum_tolal, Math.round(minimum_tolal / 10))

      ////let min_amount = minimum_tolal * correct_price(price, bp, qp) / config.PRICE_SCALE
      ////console.log('min_amount', min_amount)

      for (let i = 1000; ; i--) {
        if (i === 0) {
          console.log('a lot itertions')
          Notify.create('Calculate better amount not possible, try onter amount or pirce')
          break
        }

        if (amount * correct_price(price, qp, bp) % config.PRICE_SCALE !== 0) {
          amount = Math.round(amount / step) * step
          if (desc) {
            amount -= step
          } else {
            amount += step
          }
          continue
        }

        break
      }

      let total = amount * correct_price(price, qp, bp) / config.PRICE_SCALE

      return [amountToFloat(amount, qp), amountToFloat(total, bp)]
    },

    //amountInput(amount) {
    //  let [int, digit] = amount.split('.')

    //  console.log('ss', String(parseInt(digit)))
    //  if (digit && String(parseInt(digit)).length > 4) {
    //    this.amount_ = this.amount
    //    return
    //  }

    //  this.amount_ = amount
    //  this.amount = amount
    //},

    fixedAmount (digits) {
      this.amount = this.amount.toFixed(this.quoteToken.precision)
    },

    fixedTotal (digits) {
      this.total = this.total.toFixed(this.baseToken.precision)
    },

    priceChange () {
      let price = Math.max(parseFloat(this.price), 1 / Math.pow(10, config.PRICE_DIGITS))
      this.price = price.toFixed(config.PRICE_DIGITS)
      this.total = (this.price * this.amount)
      this.amountChange()
    },

    amountChange (desc = false) {
      this.amount = parseFloat(this.amount)

      let [ amount, total ] = this.getValidAmount(this.amount, desc)

      this.amount = amount
      this.total = total
      this.amount_ = amount
    },

    totalChange (desc = false) {
      this.total = parseFloat(this.total)

      let [ amount, total ] = this.getValidAmount(this.total / this.price, desc)

      this.amount = amount
      this.total = total
    }
  }
}
