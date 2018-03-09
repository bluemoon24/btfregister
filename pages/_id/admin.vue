<template>
  <div>
    Work as ...
    <v-layout row wrap>
      <v-flex xs6 md6>
        <v-select
          :items="$store.state.uids"
          item-text="name"
          item-value="id"
          v-model="selectedVip"
          label="Select VIP"
          autocomplete
        />
      </v-flex>
      <v-flex xs6 md6>
          <v-btn class="ml-5 mt-4" flat small nuxt outline to="/0/account">New...</v-btn>
      </v-flex>
    </v-layout>
    <v-btn flat outline nuxt :to="'/' + selectedVip + '/account'">Edit Account</v-btn>
    <!-- Work as {{ $store.state.uids.find(uid => (uid.id === selectedVip)).name || '' }}, Mail to , News, Message -->
  </div>
</template>

<script>
  export default {
    data: () => {
      return {
        selectedVip: '',
        options: ['Work as..', 'Mail to..', 'News for', 'Message to']
      }
    },
    async fetch ({ store, params, redirect }) {
      await store.dispatch('getUserData', params.id)
      if (!store.state.privileged) {
        return redirect('/')
      } else {
        store.dispatch('setRealUser', params.id)
      }
    },
    mounted: function () {
      this.selectedVip = this.$store.state.uid
      // console.log('realUid', this.$store.state.realUid)
    //   this.vipList = this.$store.state.uids.map(v => (v))
    //   this.vipList.push({id: '', name: 'New ...'})
    }
  }
</script>

<style scoped>

</style>
