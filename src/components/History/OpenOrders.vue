<template lang="pug">
  BaseTable( :data='orders' head-class='balances-head').balances-rows
    template( #head-other='{ head }' )

    template( #price='{ row }' )
      span {{ row | humanFloat }}

    template( #time='{ row }' )
      span {{ row | moment("DD/MM hh:mm:ss") }}

    template( #other='{ row }' )
      q-btn.text-bold.q-ml-sm(
        class='q-btn-border-accent-2'
        label='Cancel'
        outline
        no-caps
        unelevated
        rounded
        size='sm'
        @click='cancel(row)'
      )
</template>

<script>
import BaseTable from 'src/components/BaseTable'
import { mapState } from 'vuex'
import { cancelorder } from 'src/store/auth'

export default {
  name: 'OpenOrders',

  components: {
    BaseTable
  },

  computed: {
    ...mapState({
      bids: state => state.market.bids,
      asks: state => state.market.asks
    }),

    orders() {
      let orders = {
        'Type': [],
        'Price': [],
        'Time': [],
        'Sell': [],
        'Buy': [],
        'Other': []
      }

      if (!this.$store.state.user) {
        return orders
      }

      Array.from([...this.bids, ...this.asks])
        .filter(o => o.account === this.$store.state.user.name)
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(o => {
          o.type = o.bid.symbol.symbol === this.$store.state.market.baseToken ? 'Buy' : 'Sell'
          orders.Type.push(o.type)
          orders.Price.push(o.unit_price)
          orders.Time.push(o.timestamp)
          orders.Sell.push(o.bid.quantity)
          orders.Buy.push(o.ask.quantity)
          orders.Other.push(o)
        })

      return orders
    }
  },

  methods: {
    async cancel(order) {
      //const loading = this.$loading({ lock: true, text: 'Wait for Scatter' })

      try {
        await cancelorder(
          this.$store.getters['market/contract'],
          this.$store.state.user.name,
          this.$store.state.market.market.market_id,
          order.type.toLowerCase(),
          order.id
        )

        this.$q.notify(`Order canceled ${order.id}`)
        this.$store.dispatch('market/fetchMarket')
      } catch (e) {
        this.$q.notify(e.message)
        console.log(e)
      } finally {
        //loading.close()
      }
    }
  }
}
</script>

<style lang="scss">

</style>
