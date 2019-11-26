<template lang='pug'>
  div
    ModalDeposit( :on='on' )
    ModalWithdraw( :on='on' )
</template>

<script>
import ModalDeposit from './ModalDeposit'
import ModalWithdraw from './ModalWithdraw'

export default {
  name: 'BaseModals',
  computed: {
    on () {
      return {
        'before-open': this.beforeOpen,
        'before-close': this.beforeClose
      }
    }
  },
  methods: {
    beforeOpen (props) {
      this.$root.$emit('modal-show')
    },
    beforeClose () {
      this.$root.$emit('modal-hide')
    }
  },
  components: {
    ModalDeposit,
    ModalWithdraw
  }
}
</script>

<style lang="scss">
.v--modal {
  border-radius: 0;
}
</style>
