<template lang="pug">
  BaseSection
    template( #head )
      .flex.no-wrap
        q-btn(
          v-for='tab in tabs',
          :key='tab'
          :label='tab'
          :class='{ "q-btn-dark": !isActiveTab(tab) }'
          @click='setTab(tab)'
          unelevated
          no-caps
          size='xl'
          class='full-width'
        )
    keep-alive
      component( :is='activeTab' )
</template>

<script>
import BaseSection from 'src/components/BaseSection'
import Buy from 'src/components/Trade/Buy/index'
import Sell from 'src/components/Trade/Sell/index'

export default {
  name: 'Trade',
  components: {
    BaseSection,
    Buy,
    Sell
  },
  data () {
    return {
      tabs: ['Buy', 'Sell'],
      activeTab: ''
    }
  },
  mounted () {
    this.activeTab = this.tabs[0]
  },
  methods: {
    setTab (tab) {
      this.activeTab = tab
    },
    isActiveTab (tab) {
      return this.activeTab === tab
    }
  }
}
</script>

<style lang="scss">

</style>
