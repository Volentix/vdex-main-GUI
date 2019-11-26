<template lang="pug">
.base-table(
  :style='{ "grid-template-columns": `repeat(${countOfCols}, auto)` }'
)

  .base-table-head(
    v-for='(col, label, i) in data'
    :key='`label-${i}`'
    :class='headClass'
  )
    slot(
      :head='label'
      :name='`head-${translate(label)}`'
      v-if='$scopedSlots[`head-${translate(label)}`]'
    )
    span( v-else ) {{ label }}

  .base-table-col(
    v-for='(col, colLabel, colIndex) in data'
    :key='colIndex'
    :class='bodyClass'
  )
    .base-table-row(
      v-for='(row, label, i) in col'
      :key='i'
    )
      slot(
        :name='translate(colLabel)'
        :row='row'
        v-if='$scopedSlots[translate(colLabel)]'
      )
      span( v-else ) {{ row }}
      //- | {{ colLabel }}
</template>

<script>
export default {
  name: 'BaseTable',
  props: {
    data: {
      type: Object,
      required: true
    },
    'head-class': {
      type: String,
      default: ''
    },
    'body-class': {
      type: String,
      default: ''
    }
  },
  computed: {
    countOfCols () {
      return Object.keys(this.data).length
    }
  },
  methods: {
    translate (slotName) {
      return slotName.toLowerCase().replace(/\s/g, '')
    }
  }
}
</script>

<style lang="scss">
.base-table {
  display: grid;
  &-head {
    margin-bottom: $gap/2;
  }
  &-row {
    margin: 2px;
  }
}
</style>
