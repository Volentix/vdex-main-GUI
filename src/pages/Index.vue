<template lang='pug'>
  main.main
    .main__col__1
      Wallet
      .main__sub
        .main__sub__col
          Vogue
          LiveTrade
        .main__sub__col
          Graph
          History
    .main__col__2
      Orders
      Trade
</template>

<script>
import BaseSection from 'src/components/BaseSection'
import Wallet from 'src/components/Wallet'
import Orders from 'src/components/Orders'
import Vogue from 'src/components/Vogue/index'
import Graph from 'src/components/Graph'
import Trade from 'src/components/Trade/index.vue'
import History from 'src/components/History/index.vue'
import LiveTrade from 'src/components/LiveTrade'

export default {
  name: 'PageIndex',
  components: {
    Wallet,
    Orders,
    Vogue,
    Graph,
    Trade,
    History,
    BaseSection,
    LiveTrade
  }
}
</script>

<style lang="scss">
.main {
    display: grid;
    grid-gap: $gap;
    grid-template-columns: 3fr 1fr;
  &__col__2 {
    & > *:not(:last-child) {
      margin-bottom: $gap;
    }
  }
  &__sub {
    display: flex;
    flex-wrap: wrap;
    margin-top: $gap;
    &__col {
      &:first-child {
        flex-shrink: 1;
        flex-basis: 35%;
      }
      &:last-child {
        flex-grow: 1;
      }
      // flex-grow: 1;
      & > *:not(:last-child) {
        margin-bottom: $gap;
      }
    }
    & > *:not(:last-child) {
      margin-right: $gap;
    }
  }
}
</style>
