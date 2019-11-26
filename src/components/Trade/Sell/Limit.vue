<template lang="pug">
  .limit
    //| {{ market }}
    .body
      span Price
      q-input(
        v-model='price',
        dark
        type="number"
        dense
        outlined
        rounded
        color='neutral'
        :suffix='baseToken.symbol'
        @change="priceChange()"
      )
      span Amount
      div
        //vue-numeric(currency="$" separator="," v-model="amount")

        //q-input(
          v-model='amount',
          dark
          dense
          outlined
          rounded
          color='neutral'
          :suffix="quoteToken.symbol"
          @change="amountChange()")

        .amount-radio
          CustomRadio(
            v-model='amountRadio'
            val='25'
            dark
            label='25%'
          )
          CustomRadio(
            v-model='amountRadio'
            val='50'
            dark
            label='50%'
          )
          CustomRadio(
            v-model='amountRadio'
            val='75'
            dark
            label='75%'
          )
          CustomRadio(
            v-model='amountRadio'
            val='100'
            dark
            label='100%'
          )
      span Total
      q-input(
        v-model='total',
        dark
        dense
        outlined
        rounded
        color='neutral'
        :suffix='baseToken.symbol'
        @change="totalChange()"
      )
        //- | {{ amountRadio }}
    // TODO p.q-mb-xl Fee
    q-btn.text-bold(
      class='q-btn-border-accent-2'
      label='Sell'
      class='full-width'
      outline
      no-caps
      unelevated
      rounded
      size='lg'
      @click="buy"
    )
</template>

<script>
import CustomRadio from 'src/components/CustomRadio'
import { mapState, mapGetters } from 'vuex'
import { transfer } from '../../../store/auth'
import { tradeMixin, tradeChangeEvents } from '../../../mixins'
import config from 'src/config.js'

export default {
  name: 'Limit',
  mixins: [tradeMixin, tradeChangeEvents],

  data () {
    return {
      price: '0.' + '0'.repeat(config.PRICE_DIGITS),
      amount: 0,
      total: 0,
      amountRadio: 25
    }
  },

  computed: {
    ...mapState({
      market: state => state.market.market
    }),

    ...mapGetters({
      baseToken: 'market/baseToken',
      quoteToken: 'market/quoteToken'
    })
  },

  components: {
    CustomRadio
  },

  watch: {
    amountRadio () {
      if (parseFloat(this.price) === 0.0) return
      let balance = this.$store.state.user.balances[this.quoteToken.symbol]

      if (!balance) return
      balance = parseFloat(balance.amount)
      this.amountRadio = parseInt(this.amountRadio)

      if (this.amountRadio === 100) {
        this.amount = balance
        this.amountChange(true)
      } else {
        this.amount = balance / 100 * this.amountRadio
        this.amountChange()
      }
    }
  },

  methods: {
    buy () {
      transfer(
        this.quoteToken.contract,
        this.$store.state.user.name,
        this.$store.getters['market/contract'],
        `${this.amount} ${this.quoteToken.symbol}`,
        `${this.total} ${this.baseToken.symbol}@${this.baseToken.contract}`
      ).then(r => {
        this.$q.notify('Order placed')
        this.$store.dispatch('market/fetchMarket')
      }).catch(e => {
        this.$q.notify(e.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.limit {
  .body {
    display: grid;
    align-items: flex-end;
    row-gap: $gap;
    grid-template-columns: .7fr 1fr;
    border-bottom: 1px solid $neutral;
    padding-bottom: $gap;
    margin-bottom: $gap;
  }
}
.amount-radio {
  display: flex;
  font-size: .7em;
  margin-top: $gap / 1.2;
  & > *:not(:last-child) {
    margin-right: 4px;
  }
}
</style>
