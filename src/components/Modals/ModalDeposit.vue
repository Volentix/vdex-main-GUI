<template lang="pug">
  modal( name='deposit' height='auto' :scrollable='true' v-on='on' @before-open="beforeOpen" )
    BaseModal( name='deposit' )
      template( #head ) Deposit
      template( #default )
        span.modal-deposit__title {{ currency }} Adress:
        .flex.justify-between.items-center
          .modal-deposit__address( @click='copy' ) {{ address }}
          q-btn.q-px-xl(
            class='q-btn-border-accent-1'
            label='Copy Adress'
            outline
            no-caps
            unelevated
            rounded
            size='lg'
            @click='copy'
          )
        .q-mt-xl
          span.modal-deposit__title Send only {{ currency }} to this deposit address.
          span Sending coin or token other than {{ currency }} to this address may result in the loss of your deposit.
</template>

<script>
import BaseModal from 'src/components/Modals/BaseModal'

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
      address: '',
      currency: ''
    }
  },

  methods: {
    beforeOpen (event) {
      console.log(123123123)
      this.currency = event.params.currency
      this.address = this.$store.state.user[`${this.currency.toLowerCase()}_address`]
      console.log(this.address)
    },

    copy () {
      navigator.clipboard.writeText(this.address)
    }
  }
}
</script>

<style lang="scss">
.modal-deposit {
  &__title {
    display: block;
    font-weight: bold;
    color: #fff;
    font-size: 1.7rem;
    margin-bottom: $gap/2;
  }
  &__address {
    color: $accent-1;
    cursor: pointer;
  }
}
</style>
