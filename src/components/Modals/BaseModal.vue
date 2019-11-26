<template lang='pug'>
  .base-modal
    .base-modal__head
      span.base-modal__head__title
        slot( name='head' )
      span.base-modal__head__close( @click="hide" )
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 100 100" id="Layer_1" version="1.1" viewBox="0 0 100 100" xml:space="preserve"><polygon fill="#010101" points="77.6,21.1 49.6,49.2 21.5,21.1 19.6,23 47.6,51.1 19.6,79.2 21.5,81.1 49.6,53 77.6,81.1 79.6,79.2   51.5,51.1 79.6,23 "/></svg>
    .base-modal__body
      slot
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    hide () {
      this.$modal.hide(this.name)
    }
  }
}
</script>

<style lang='scss'>
.base-modal {
  background-color: $primary-light;
  &__body {
    padding: $gap $gap*2;
  }
  &__head {
    border-bottom: 1px solid darken($neutral, 20%);
    padding: $gap/2 $gap;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__title {
      font-size: 1.5rem;
    }
    &__close {
      width: 20px;
      cursor: pointer;
      stroke: white;
      fill: white
    }
  }
}
</style>
