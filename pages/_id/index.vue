<template>
  <div>
    Welcome, {{ name }}!
    <!-- {{ members }} -->
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  async fetch ({ store, params, redirect }) {
    store.dispatch('setRealUser', params.id)
    // console.log('index:fetch', store.state.privileged, store.state.uids, params.id)
    // if (params.id === '0' && !store.state.privileged) return redirect('/')
    console.log('index.vue', store.state.privileged)
    if (!store.state.privileged && !store.state.uids.some((uids) => uids.id === params.id)) {
      return redirect('/')
    } else {
      let uid = store.state.uid || params.id
      await store.dispatch('getUserData', uid)
      await store.dispatch('getEventinfoData')
      await store.dispatch('getLocationData')
    }
  },
  computed: {
    ...mapState({
      name: state => (state.udata.name),
      members: state => (state.udata.members)
    }),
    // ...mapGetters([
    //   'udata'
    // ])
    personData: function () {
      this.$store.state.personData.map((p) => ({id: p.id, name: p.name, allergies: p.allergies, instrument: p.instrument, mobile: p.mobile}))
    }
  }
}
</script>


<style scoped>

</style>
