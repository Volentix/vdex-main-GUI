<template lang="pug">
  .buy
    .buy__head
      q-tabs( v-model='tab' indicator-color='accent-2' )
        q-tab(
          v-for='tab in tabs'
          :key='tab'
          :name='tab',
          :label='tab'
          no-caps
        )
      br
      p.wallet__key(v-if="$store.state.user") {{ baseToken.symbol }} available: {{ baseBalance }}
    component( :is='tab' )
</template>

<script>
import Limit from 'src/components/Trade/Buy/Limit'
import Market from 'src/components/Trade/Buy/Market'
import { mapGetters } from 'vuex'

export default {
  name: 'Buy',

  data () {
    return {
      tabs: ['Limit', 'Market'],
      tab: ''
    }
  },

  mounted () {
    this.tab = this.tabs[0]
  },

  computed: {
    ...mapGetters({
      baseToken: 'market/baseToken',
      quoteToken: 'market/quoteToken',
      baseBalance: 'baseBalance',
      quoteBalance: 'quoteBalance'
    })
  },

  components: {
    Limit,
    Market
  }
}
</script>

<style lang="scss">
.balance {
  margin-bottom: 5px;
}

.buy {
  &__head {
    padding: 0 $gap * 2;
    margin-bottom: $gap * 2;
  }
}
</style>
