<script>
import { mergeData as merge } from 'vue-functional-data-merge'

export default {
  functional: true,
  props: {
    'bodyClass': {
      type: String,
      required: false
    }
  },

  render (createElement, { slots, data, props }) {
    const myAttrs = {
      class: {
        'base-section': true
      }
    }
    const bodyAttrs = {
      class: {
        'base-section__body': true,
        [`${props.bodyClass}`]: props.bodyClass
      }
    }

    return (
      <section { ...merge(data, myAttrs) }>
        { slots().head }
        <div { ...bodyAttrs }>
          { slots().default }
        </div>
      </section>
    )
  }
}
</script>

<style lang="scss">
.base-section {
  background-color: $primary-light;
  // min-width: 100%;
  &__body {
    padding: $gap $gap;
  }
  $root: &;
  // &--gap {
  //   #{$root}__body {
  //     padding: $gap/2 $gap;
  //   }
  // }
}
</style>
