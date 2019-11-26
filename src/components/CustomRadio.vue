<template lang="pug">
  div.radio( @click='$emit("input", $attrs.val)' tabindex='0' )
    q-radio.radio__default(
      v-model='model'
      v-bind='$attrs'
      v-on='$listeners'
    )
    .radio__custom( :class='{ "active": isActive }' )
      | {{ $attrs.label }}
</template>

<script>
export default {
  name: 'CustomRadio',
  props: ['value'],
  computed: {
    model: {
      get () { return this.value },
      set (value) { this.$emit('input', value) }
    },
    isActive () {
      return this.value === this.$attrs.val
    }
  }
}
</script>

<style lang="scss" scoped>
.radio {
  display: inline-block;
  cursor: pointer;
  &__default {
    display: none;
  }
  &__custom {
    padding: 1px $gap / 1.5;
    border-radius: 10px;
    border: 1px solid $neutral;
    &.active {
      background-color: $neutral;
    }
  }
}
</style>
