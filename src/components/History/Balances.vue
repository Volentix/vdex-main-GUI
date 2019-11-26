<template lang="pug">
  BaseTable( :data='balances' head-class='balances-head').balances-rows
    template( #head-other='{ head }' )
    template( #other='{ row }' )
      div(v-if="pegged.includes(row)")
        q-btn.text-bold(
          class='q-btn-border-accent-1'
          label='Deposit'
          outline
          no-caps
          unelevated
          rounded
          size='sm'
          @click='deposit(row)'
        )
        q-btn.text-bold.q-ml-sm(
          class='q-btn-border-accent-2'
          label='Withdraw'
          outline
          no-caps
          unelevated
          rounded
          size='sm'
          @click='withdraw(row)'
        )
</template>

<script>
import BaseTable from 'src/components/BaseTable'
import config from '../../config'

export default {
  name: 'Balances',

  data () {
    return {
      pegged: config.PEGGED_ASSETS
    }
  },

  components: {
    BaseTable
  },

  computed: {
    balances () {
      let balances = {
        'Asset': [
        ],
        'Name': [
        ],
        'Total Balance': [
        ],
        'Available Balance': [
        ],
        'Other': [
        ]
      }

      if (this.$store.state.user === null || !this.$store.state.user.balances) {
        return balances
      }

      for (let key of Object.keys(this.$store.state.user.balances)) {
        let b = this.$store.state.user.balances[key]
        balances.Asset.push(b.currency)
        balances.Name.push(b.id)
        balances['Total Balance'].push(b.amount)
        balances['Available Balance'].push(b.amount)
        balances.Other.push(b.currency)
      }

      return balances
    }
  },

  methods: {
    deposit (row) {
      this.$modal.show('deposit', { currency: row })
    },

    withdraw (row) {
      this.$modal.show('withdraw', { currency: row })
    }
  }
}
</script>

<style lang="scss">
.balances-rows .base-table-row {
  min-height: 30px;
}

.balances {
  &-head {
    color: $neutral;
    border-bottom: 1px solid $neutral;
    padding-bottom: $gap / 2;
  }

}
</style>
