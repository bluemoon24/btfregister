<template>
<div>
  Welcome back, {{ name }}! (index.vue)
</div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  async fetch ({ store, params, redirect }) {
    store.dispatch('setRealUser', params.id)
    // console.log('index:fetch', store.state.privileged, store.state.uids, params.id)
    if (!store.state.uids.some((uids) => uids.id === params.id)) {
      return redirect('/')
    } else {
      let uid = store.state.uid || params.id
      await store.dispatch('getUserData', uid)
    }
  },
  computed: {
    ...mapState({
      name: state => (state.udata.name)
    })
    // ...mapGetters([
    //   'udata'
    // ])
  }
}
</script>


<style scoped>

</style>
