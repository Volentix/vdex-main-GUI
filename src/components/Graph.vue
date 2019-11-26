<template lang='pug'>
  BaseSection
    p Graph

    trading-vue(:data='chart' :width='width' :height='height'
        :color-back='colors.colorBack'
        color-grid='colors.colorGrid'
        :color-text='colors.colorText')

</template>

<script>
import BaseSection from 'src/components/BaseSection'
import TradingVue from 'trading-vue-js'
import { mapState } from 'vuex'

export default {
  name: 'Orders',
  components: {
    BaseSection,
    TradingVue
  },

  computed: {
    ...mapState({
      history: state => state.market.history
    }),

    chart () {
      return {
        ohlcv: this.history.map(h => {
          return [
            h[0],
            parseFloat(this.$options.filters.humanFloat(h[1])),
            parseFloat(this.$options.filters.humanFloat(h[2])),
            parseFloat(this.$options.filters.humanFloat(h[3])),
            parseFloat(this.$options.filters.humanFloat(h[4])),
            h[5]
          ]
        })
      }
    }
  },

  data () {
    return {
      width: 590,
      height: 300,
      colors: {
        colorBack: '#1f1f1f'
        // colorGrid: '#1F1F1F',
        // colorText: '#CECFD0'
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
