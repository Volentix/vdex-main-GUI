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
          size='xl'
          class='full-width'
        )
    keep-alive
      .vtx
        .flex.no-wrap.justify-between
          q-input.col-shrink.q-mr-sm(
            label='Search the pair'
            dark
            dense
            outlined
            rounded
            size='sm'
            v-model='pair'
            color='neutral'
          )
            template( #prepend )
              q-icon(name='search')
          //q-radio.q-mr-sm(
            v-model='pairType',
            val='change',
            label='Change'
            color='white'
            dark
            dense)

          //q-radio(
            v-model='pairType',
            val='volume',
            label='Volume'
            color='white'
            dark
            dense)
        BaseTable.q-mt-lg( :data='pairs' head-class='text-neutral' )
          template( #change='{ row }' )
            span( :class='determineColor(row)' ) {{ row | sign }} %
        //.base-table.q-mt-lg
          //span( :class='determineColor(row)' ) {{ row | sign }} %

</template>

<script>
import BaseSection from 'src/components/BaseSection'
import BaseTable from 'src/components/BaseTable'

export default {
  name: 'Orders',

  data () {
    return {
      tabs: [ 'VTX', 'EOS', 'BTC' ],
      activeTab: '',

      pair: '',
      pairType: 'change'
    }
  },

  async mounted () {
    this.setTab(this.$store.state.market.baseToken)
  },

  computed: {
    pairs () {
      let result = {
        Pair: [],
        Price: [],
        Change: []
      }

      this.$store.state.market.markets
        .filter(m => m.quote.includes(this.pair))
        .map(m => {
          result.Pair.push(`${m.quote} / ${this.activeTab}`)
          result.Price.push(this.$options.filters.humanFloat(m.last_price))
          result.Change.push(m.change_24_percent)
        })

      return result
    }
  },

  methods: {
    setTab (tab) {
      this.activeTab = tab
      this.$store.dispatch('market/setBaseToken', tab)
    },

    isActiveTab (tab) {
      return this.activeTab.toLowerCase() === tab.toLowerCase()
    },

    determineColor (change) {
      return {
        'text-accent-1': change > 0,
        'text-accent-2': change < 0
      }
    }
  },
  components: {
    BaseSection,
    BaseTable
  }
}
</script>

<style lang="scss">

</style>
