<template lang='pug'>
  BaseSection
    template( #head )
      .flex.no-wrap
        q-btn(
          v-for='(name, tab) in tabs',
          :key='tab'
          :label='name'
          :class='{ "q-btn-dark": !isActiveTab(tab) }'
          @click='setTab(tab)'
          unelevated
          no-caps
          size='lg'
          class='full-width'
        )
    keep-alive
      component( :is='activeTab' )
</template>

<script>
import BaseSection from 'src/components/BaseSection'
import Balances from 'src/components/History/Balances'
import OpenOrders from 'src/components/History/OpenOrders'
import Order from 'src/components/History/Order'
import Trade from 'src/components/History/Trade'

export default {
  name: 'History',
  data () {
    return {
      tabs: {
        // Component: label
        'OpenOrders': 'Open Orders',
        'Order': 'Order History',
        //'Trade': 'Trade',
        'Balances': 'Balances'
      },
      // Component, example: OpenOrders
      activeTab: ''
    }
  },
  mounted () {
    const [lastTab] = Object.keys(this.tabs).slice(-1)
    this.setTab(lastTab)
  },
  methods: {
    isActiveTab (tab) {
      return this.activeTab === tab
    },
    setTab (tab) {
      this.activeTab = tab
    }
  },
  components: {
    BaseSection,
    Balances,
    OpenOrders,
    Order,
    Trade
  }
}
</script>

<style lang="scss">

</style>
