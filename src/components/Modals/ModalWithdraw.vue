<template lang="pug">
  modal( name='withdraw' height='auto' :scrollable='true' v-on='on' @before-open="beforeOpen" )
    BaseModal( name='withdraw' )
      template( #head ) Withdraw
      template( #default )
        form( @submit.prevent='submit' )
          .flex.items-baseline.justify-between
            //- span.modal-withdraw__title Recepient's {{ currency }} Adress:
            q-input.modal-withdraw__input(
              v-model='address'
              borderless
              dense
              dark
              color='neutral-light'
              :label='"Recepient\'s " + currency + " Adress:"'
            )
            span
          .modal-withdraw__separator
          div Please enter recepient's {{ currency }} Adress:
          .flex.items-baseline.justify-between.q-mt-lg
            q-input.modal-withdraw__input(
              v-model='amount'
              borderless
              dense
              dark
              color='neutral-light'
              label='Amount'
              @change="amountChange"
            )
            div
              span.modal-withdraw__accent Available Balance:
              span.modal-withdraw__value  {{ balance.amount }} {{ balance.currency }}
          .modal-withdraw__separator
          div Please enter an amount:
          .modal-withdraw__table
            div Minimum amount:
            div {{ min }}
            div Transaction fee:
            div {{ fee }}
            div You will get:
            div {{ willGet }}
          .flex.justify-end
            q-btn.q-px-xl(
              class='q-btn-border-accent-1'
              label='Submit'
              outline
              no-caps
              unelevated
              rounded
              type='submit'
              size='lg'
            )
              //- @click='submit'
</template>

<script>
import BaseModal from 'src/components/Modals/BaseModal'
import { mapState, mapGetters } from 'vuex'
import { transfer } from '../../store/auth'
import config from 'src/config.js'

export default {
  name: 'ModalDeposit',
  components: {
    BaseModal
  },
  props: {
    on: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      balance: {},
      amount: '',
      contract: '',
      address: '',
      currency: 'BTC',
      fee: 0.0001
    }
  },

  computed: {
    ...mapGetters({
      user: 'user'
    }),

    min() {
      return config.ASSETS[this.currency].min
    },

    willGet() {
      if (this.balance.decimals) {
        let amount = parseFloat(this.amount) || 0

        return Math.max((amount - this.fee), 0).toFixed(this.balance.decimals)
      }

      return 0
    }
  },

  methods: {
    amountChange (e) {
      let amount = parseFloat(e.target.value)

      if (amount < this.min) {
        this.amount = this.min.toFixed(parseInt(this.balance.decimals))
      } else {
        this.amount = amount.toFixed(parseInt(this.balance.decimals))
      }
    },

    beforeOpen (props) {
      this.currency = props.params.currency
      this.fee = config.ASSETS[this.currency].fee
      let balance = this.user.balances[props.params.currency]
      this.balance = balance
    },

    submit () {
      transfer(
        this.balance.contract,
        this.$store.state.user.name,
        config.ASSETS[this.currency].contract,
        `${this.amount} ${this.balance.currency}`,
        `${this.address}`
      ).then(r => {
        this.$modal.hide('withdraw')
        this.$q.notify('Your withdraw is in process..')
        this.$store.dispatch('market/fetchMarket')
      }).catch(e => {
        alert(e)
      })
    }
  }
}
</script>

<style lang="scss">
.modal-withdraw {
  &__title {
    display: block;
    font-size: 1.7rem;
    font-weight: bold;
    color: $neutral-light;
  }
  &__separator {
    height: 1px;
    border-top: 1px solid $neutral-light;
    width: 104%;
    transform: translateX(-2%);
    margin: $gap/2 0;
  }
  &__accent {
    color: $accent-1;
    font-weight: bold;
    font-size: 1.4rem;
  }
  &__value {
    font-size: 1.4rem;
    font-weight: bold;
  }
  &__table {
    margin-top: $gap*2;
    display: grid;
    grid-template-columns: minmax(50px, 150px) auto;
  }
  &__input {
    flex-grow: 1;
  }
}
</style>
