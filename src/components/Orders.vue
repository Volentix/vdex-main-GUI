<template lang="pug">
  BaseSection.orders
    p.orders__title.text-h6 Orders book
    BaseTable.q-mb-md( :data='sorted_asks' head-class='text-neutral-light' )
      template( #price='{ row }')
        span.pointer(@click="setPrice(row)").text-neutral-blue.text-accent-2 {{ row | humanFloat }}
      template( #quantity='{ row }' )
        span.text-neutral-dark {{ row }}
      template( #total='{ row }')
        .orders__col-3
          span.orders__col-3__text {{ row.total }}
          .orders__col-3__gradient( :style='{ width: `${row.totalPerc}%`}' )

    p.orders__spread Spread of {{ spread | humanFloat }}
    p.orders__price Price: {{ price | humanFloat }}

    BaseTable( :data='sorted_bids' head-class='hidden')
      template( #price='{ row }')
        span(@click="setPrice(row)").pointer.text-neutral-blue.text-accent-1 {{ row | humanFloat}}
      template( #quantity='{ row }' )
        span.text-neutral-dark {{ row }}
      template( #total='{ row }' )
        .orders__col-3
          span.orders__col-3__text {{ row.total }}
          .orders__col-3__gradient( :style='{ width: `${row.totalPerc}%`}' )
</template>

<script>
import BaseSection from 'src/components/BaseSection'
import BaseTable from 'src/components/BaseTable'
import { mapState, mapGetters } from 'vuex'
import { mergeSamePriceOrders } from 'src/utils'
import { EventBus } from 'src/utils/event-bus'

export default {
  name: 'Orders',
  components: {
    BaseSection,
    BaseTable
  },

  methods: {
    setPrice(price) {
      price = this.$options.filters.humanFloat(price)
      EventBus.$emit('setPrice', price)
    },

    setTotal(total) {
      EventBus.$emit('setTotal', total)
    },

    setAmount(amount) {
      EventBus.$emit('setAmount', amount)
    }
  },

  computed: {
    ...mapGetters({
      spread: 'market/spread',
      price: 'market/price'
    }),

    ...mapState({
      bids: state => state.market.bids,
      asks: state => state.market.asks
    }),

    sorted_bids () {
      let result = {
        Price: [],
        Quantity: [],
        Total: []
      }

      this.bids.map(b => {
        result.Price.push(b.unit_price)
        result.Quantity.push(b.bid.prefix)
        result.Total.push({ total: b.ask.prefix, totalPerc: 0 })
      })

      return result
    },

    sorted_asks () {
      let result = {
        Price: [],
        Quantity: [],
        Total: []
      }

      mergeSamePriceOrders(this.asks).map(b => {
        result.Price.push(b.unit_price)
        result.Quantity.push(b.ask.prefix)
        result.Total.push({ total: b.bid.prefix, totalPerc: 0 })
      })

      return result
    }
  }
}
</script>

<style lang="scss">
.orders {
  .pointer {
    cursor: pointer;
  }

  padding: 0 $gap/2;
  &__title {
    text-transform: capitalize;
  }
  &__spread, &__price {
    display: inline-block;
  }
  &__price {
    margin-left: $gap;
  }
  &__col-3 {
    position: relative;
    &__text {
      position: relative;
      z-index: 1;
      color: $neutral-dark;
    }
    &__gradient {
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      background: linear-gradient(to left, #{$accent-1}, #{darken($accent-1, 40%)});
    }
  }
}
</style>
