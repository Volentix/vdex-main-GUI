<template lang="pug">
  header.header
    .header__logo
      img.header__logo__item( src='~/assets/logo.png' )
    .header__date
      span.header__date__item {{ new Date() | moment('DD/MM') }}
      span.header__date__item {{ new Date() | moment('hh:mm:ss') }}
    q-btn(label='Create wallet' flat no-caps)
    q-btn(v-if="$store.state.user" :label='$store.state.user.name' @click="$store.dispatch('auth/logout')" flat no-caps)

    q-btn(v-else label='Connect wallet' @click="$store.dispatch('auth/login')" flat no-caps)
    q-btn-dropdown(label='English' content-class='q-btn-dropdown--dark' flat no-caps)
      q-list
        q-item(clickable, v-close-popup, @click='')
          q-item-section
            q-item-label Russian
    q-btn(icon='more_horiz' flat)
    //- q-icon(name='more_horiz' size='sm')
    //- q-btn-dropdown(label='Button', color='primary')
    //-   q-list
    //-     q-item(clickable, v-close-popup, @click='onItemClick')
    //-       q-item-section
    //-         q-item-label Photos
</template>

<script>
export default {
  name: 'TheHeader',

  created () {
    console.log(this.$store.state)
  }

}
</script>

<style lang="scss">
.header {
  background-color: $primary-light;
  padding: $gap/2 $gap;
  display: flex;
  align-items: center;
  &__logo {
    flex-grow: .3;
    &__item {
      height: 100%;
    }
  }
  &__date {
    flex-grow: .7;
    &__item {
      &:not(:last-child) {
        margin-right: 5px;
      }
    }
  }
}
</style>
