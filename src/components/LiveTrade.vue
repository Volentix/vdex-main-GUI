<template lang="pug">
  BaseSection
    p.text-h6.q-mb-lg Live Trades
    BaseTable( :data='trades' head-class='text-neutral-light' )
      template( #price="{ row }" )
        span( :class="determineColor(row.type)" ) {{ row.value }}

      template( #quantity="{ row }" )
        span {{ row }}

      template( #time="{ row }" )
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
      let matches = this.matches
      matches.sort((a, b) => b.timestamp - a.timestamp)

      return {
        Price: matches.map(match => ({
          value: this.$options.filters.humanFloat(match.unit_price),
          type: match.type
        })),

        Quantity: matches.map(m => m.ask.symbol.symbol === this.baseToken ? m.ask.prefix : m.bid.prefix),
        Time: matches.map(m => m.timestamp)
      }
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
