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

        //q-field(
          dark
          dense
          outlined
          rounded
          color='neutral'
          )
          vue-numeric-input(
            v-model="amount"
            :min="0.01"
            :controls="false"
            autofocus
            :step="0.01"
            :precision="2"
            class="q-field__native q-placeholder"
            @change="amountChange()"
            )
          .q-field__suffix.no-pointer-events.row.items-center {{ quoteToken.symbol }}


          //vue-numeric(:min="0.01" :minus="false" empty-value="0.01" :precision="8" :value="13").q-field__native.q-placeholder
          //.q-field__suffix.no-pointer-events.row.items-center {{ quoteToken.symbol }}
        //label.q-field.row.no-wrap.items-start.q-input.q-field--outlined.q-field--rounded.q-field--float.q-field--dense.q-field--dark
          .q-field__inner.relative-position.col.self-stretch.column.justify-center
            .q-field__control.relative-position.row.no-wrap.text-neutral
              .q-field__control-container.col.relative-position.row.no-wrap.q-anchor--skip
                vue-numeric(:min v-model="amount").q-field__native.q-placeholder

                //vue-numeric-input(
                  :class="asdf"
                  v-model='amount',
                  :suffix="quoteToken.symbol"
                  :controls="false"
                  :min="0.01"
                  :precision="2"
                  @change="amountChange()").q-field__native.q-placeholder
              .q-field__suffix.no-pointer-events.row.items-center {{ quoteToken.symbol }}

        //v-model='amount_',
        q-input(
          v-model='amount',
          dark
          dense
          outlined
          rounded
          color='neutral'
          :suffix="quoteToken.symbol"
          @focusout="amountChange()"
          )
          //@input="amountInput"
          //@change="amountChange()"

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
import { tradeMixin, tradeChangeEvents } from '../../../mixins'
import config from 'src/config.js'

export default {
  name: 'Limit',
  mixins: [tradeMixin, tradeChangeEvents],

  data () {
    return {
      price: '0.' + '0'.repeat(config.PRICE_DIGITS),
      amount: 0,
      amount_: 0,
      total: 0,
      amountRadio: 25
    }
  },

  mounted() {
    //this.amount = '0.' + '0'.repeat(this.quoteToken.precision)

    //let div = document.getElementsByClassName('vue-numeric-input')[0]
    //let input = div.children[0]

    //div.setAttribute('class', '')
    //div.setAttribute('style', 'width: 100%;')
    //input.setAttribute('class', 'q-field__native q-placeholder')
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

      let balance = this.$store.state.user.balances[this.baseToken.symbol]

      if (!balance) return
      balance = parseFloat(balance.amount)

      this.amountRadio = parseInt(this.amountRadio)

      if (this.amountRadio === 100) {
        this.total = balance
        this.totalChange(true)
      } else {
        this.total = balance / 100 * this.amountRadio
        this.totalChange()
      }
    }
  },

  methods: {
    buy () {
      transfer(
        this.baseToken.contract,
        this.$store.state.user.name,
        this.$store.getters['market/contract'],
        `${this.total} ${this.baseToken.symbol}`,
        `${this.amount} ${this.quoteToken.symbol}@${this.quoteToken.contract}`
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
