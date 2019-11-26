<template lang="pug">
  .limit
    //| {{ market }}
    .body
      span Price
      q-input(
        value="Buy at the best market price"
        dark
        dense
        :disable="true"
        outlined
        rounded
        color='neutral'
      )
      span Amount
      div
        q-input(
          v-model='amount',
          dark
          dense
          outlined
          type="number"
          rounded
          color='neutral'
          :suffix='baseToken.symbol'
          @change="amountChange"
        )
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
      //span Total
      //q-input(
        v-model='total',
        dark
        dense
        outlined
        rounded
        color='neutral'
        :suffix='baseToken.symbol')
        //- | {{ amountRadio }}
    // TODO p.q-mb-xl Fee
    q-btn.text-bold(
      class='q-btn-border-accent-1'
      label='Buy'
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

export default {
  name: 'Limit',

  data () {
    return {
      price: '0.00000000',
      amount: '0',
      total: '',
      amountRadio: 25
    }
  },

  computed: {
    ...mapState({
      market: state => state.market.market,
      user: state => state.user
    }),

    ...mapGetters({
      baseToken: 'market/baseToken',
      quoteToken: 'market/quoteToken',
      contract: 'market/contract'
    }),

    totalUpdateEvent () {
      return this.price * this.amount
    }
  },

  components: {
    CustomRadio
  },

  created () {
  },

  watch: {
    totalUpdateEvent () {
      this.total = (this.price * this.amount).toFixed(this.baseToken.precision)
    },

    amountRadio () {
      let balance = this.$store.state.user.balances[this.baseToken.symbol]

      if (!balance) return
      balance = parseFloat(balance.amount)

      if (this.amountRadio === 100) {
        this.amount = balance
      } else {
        this.amountChange({ target: { value: balance / 100 * this.amountRadio } })
      }
    }
  },

  methods: {
    amountChange (e) {
      this.amount = parseFloat(e.target.value).toFixed(this.baseToken.precision)
    },

    async buy () {
      if (!this.$store.state.user)
        await this.$store.dispatch('chain/login')

      try {
        const r = await transfer(
          this.baseToken.contract,
          this.$store.state.user.name,
          this.contract,
          `${this.amount} ${this.baseToken.symbol}`,
          `${(0).toFixed(this.quoteToken.precision)} ${this.quoteToken.symbol}@${this.quoteToken.contract}`
        )
        this.$q.notify('Order placed')
        this.$store.dispatch('market/fetchMarket')
      } catch (e) {
        this.$q.notify(e.message)
        console.log(e)
      }
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
