<template lang='pug'>
q-layout
  Modals
  div( :class='{ "modal-show": modalShow }' )
    TheHeader
    .container
      router-view
</template>

<script>
import TheHeader from 'src/components/TheHeader'
import Modals from 'src/components/Modals/index.vue'

export default {
  name: 'MyLayout',
  components: {
    TheHeader,
    Modals
  },
  data () {
    return {
      modalShow: false
    }
  },
  mounted () {
    this.$root.$on('modal-show', this.showModal)
    this.$root.$on('modal-hide', this.hideModal)
  },
  beforeDestroy () {
    this.$root.$off('modal-show', this.showModal)
    this.$root.$off('modal-hide', this.hideModal)
  },
  methods: {
    showModal () {
      this.modalShow = true
    },
    hideModal () {
      this.modalShow = false
    }
  }
}
</script>
