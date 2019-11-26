<template lang="pug">
  BaseSection( bodyClass='wallet' )
    div
      q-select.wallet__select(
        v-model='wallet'
        :options='wallets'
        color='accent-1'
        dark
        borderless
      )

      p(v-if="$store.state.user") Connected wallets: Scatter

    .wallet__graph
      .flex.column.justify-between.q-mr-sm
        span 24H range:
        span.wallet__graph__min {{ market.low_24 | humanFloat }}
      BaseLineChart.wallet__graph__item(
        :chartData='graphData'
      )
      .flex.items-center.q-ml-sm
        span.wallet__graph__max {{ market.hight_24 | humanFloat }}
    .wallet__table.items-center.content-center
      p.wallet__key 24H change:
      p.wallet__value
        //| {{ market.change_24_percent < 0 ? '-' : ''  }}
        | {{ market.change_24_percent }}
      p.wallet__key 24H high:
      p.wallet__value {{ market.hight_24 | humanFloat }}
      p.wallet__key 24H low
      p.wallet__value {{ market.low_24 | humanFloat }}
    .wallet__table.items-center.content-center
      p.wallet__key(v-if="$store.state.user") {{ baseToken.symbol }} available:
      p.wallet__value(v-if="$store.state.user") {{ baseBalance }}
      p.wallet__key(v-if="$store.state.user") {{ quoteToken.symbol }} available:
      p.wallet__value(v-if="$store.state.user") {{ quoteBalance }}
      p.wallet__key Last price:
      p.wallet__value {{ market.last_price | humanFloat }}
</template>

<script>
import BaseSection from 'src/components/BaseSection'
import BaseLineChart from 'src/components/BaseLineChart'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Wallet',

  components: {
    BaseSection,
    BaseLineChart
  },

  computed: {
    ...mapState({
      market: state => state.market.market
    }),

    ...mapGetters({
      baseToken: 'market/baseToken',
      quoteToken: 'market/quoteToken',
      baseBalance: 'baseBalance',
      quoteBalance: 'quoteBalance'
    }),

    wallets () {
      let result = this.$store.state.market.markets.map(m => {
        return {
          label: `${m.quote} / ${m.base}`,
          value: `${m.quote}`
        }
      })

      return result
    }
  },

  watch: {
    'wallets' () {
      if (this.wallets.length > 0) {
        this.wallet = this.wallets[0]
      }
    },

    'wallet' () {
      if (this.wallet.value) {
        this.$store.dispatch('market/setMarket', this.wallet.value)
      }
    }
  },

  data () {
    return {
      wallet: '',
      graphData: {
        // labels: ['Hui', 'February'],
        datasets: [
          {
            backgroundColor: '#00F7A9',
            data: [20, 30, 10, 45, 110]
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss">
.wallet {
  display: flex;
  // align-items: center;
  justify-content: space-between;
  &__select {
    font-size: 35px;
  }
  &__table {
    display: grid;
    // align-content: flex-start;
    grid-template-columns: auto auto;
    gap: $gap/2;
  }
  &__key {
    margin: 0;
  }
  &__value {
    margin: 0;
    font-weight: 700;
  }
  &__graph {
    display: flex;
    &__min {
      color: $accent-2;
      font-weight: bold;
    }
    &__max {
      color: $accent-1;
      font-weight: bold;
      display: inline-block;
    }
    &__item {
      width: 100px;
    }
  }
}
</style>
