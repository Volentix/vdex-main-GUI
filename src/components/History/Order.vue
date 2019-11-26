<template lang="pug">
BaseTable( :data='trades' head-class='balances-head' ).balances-rows
  template( #head-other='{ head }' )

  template( #price='{ row }' )
    span {{ row | humanFloat }}

  template( #time='{ row }' )
    span {{ row | moment("DD/MM hh:mm:ss") }}


</template>

<script>
import BaseSection from 'src/components/BaseSection'
import BaseTable from 'src/components/BaseTable'
import { mapGetters, mapState } from 'vuex'


export default {
  name: 'LiveTrades',
  components: {
    BaseSection,
    BaseTable
  },

  computed: {
    ...mapGetters({
      matches: 'market/matches',
      baseToken: 'market/baseToken'
    }),

    trades () {
      let orders = {
        'Type': [],
        'Price': [],
        'Time': [],
        'Sell': [],
        'Buy': []
      }

      if (!this.$store.state.user) {
        return orders
      }

      this.matches.filter(m => [m.bidder, m.asker].includes(this.$store.state.user.name))
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(o => {
          orders.Type.push(o.bid.symbol.symbol === this.$store.state.market.baseToken ? 'Buy' : 'Sell')
          orders.Price.push(o.unit_price)
          orders.Time.push(o.timestamp)
          orders.Sell.push(o.bid.quantity)
          orders.Buy.push(o.ask.quantity)
        })

      return orders

      //let result = {
      //  Price: [],
      //  Bid: [],
      //  Ask: [],
      //  Time: []
      //}

      //if (!this.$store.state.user) return result

      //this.matches.filter(m => [m.bidder, m.asker].includes(this.$store.state.user.name)).map(m => {
      //  result.Price.push({
      //    value: this.$options.filters.humanFloat(m.unit_price),
      //    type: m.type
      //  })

      //  result.Bid.push(m.bid.quantity)
      //  result.Ask.push(m.ask.quantity)
      //  result.Time.push(m.timestamp)
      //})

      //return result
    }
  },

  methods: {
    determineColor (type) {
      return {
        'text-accent-1': type === 'buymatch',
        'text-accent-2': type === 'sellmatch'
      }
    }
  }
}
</script>

<style lang="scss">

</style>
