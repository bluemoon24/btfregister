<template>
  <div>
    <tb-list
    title="VIP Editor"
    :list="list"
    add_icon='person_add'
    :actions="[{ id: 'submit', label: 'submit', close: true }, { id: 'cancel', label: 'cancel', close: true }]"
    v-on:tblistevent="selectAction"
      ></tb-list>
  </div>
</template>

<script>
  import TbList from '~/components/TbList.vue'
  export default {
    components: {
      TbList
    },
    data: () => {
      return {
        selectedAction: '',
        actions: [
          { label: 'Mail to..', id: 'mail', icon: 'mail' },
          { label: 'News for', id: 'news', icon: 'message' },
          { label: 'Delete', id: 'delete', icon: 'delete' },
          { label: 'Work as..', id: 'switch', icon: 'remove_red_eye' }
        ]
      }
    },
    async fetch ({ store, params, redirect, app }) {
      await store.dispatch('getUserData', params.id)
      if (!store.state.privileged) {
        return redirect('/' + params.id)
      } else {
        store.dispatch('setRealUser', params.id)
      }
    },
    computed: {
      list: function () {
        return this.$store.state.uids.map((m) => ({ item: m, header: m.name, icon: null }))
      }
    },
    mounted: function () {
      console.log('mixins mounted', this.$validuser)
      this.selectedAction = this.$store.state.uid
      // console.log('realUid', this.$store.state.realUid)
    //   this.vipList = this.$store.state.uids.map(v => (v))
    //   this.vipList.push({id: '', name: 'New ...'})
    },
    methods: {
      selectAction: function (action) {
        console.log('Admin:selectedAction', action)
        // this.$store.dispatch('getUserData', this.selectedAction)
        // this.$store.dispatch('setRealUser', this.selectedAction)
      }
    }
  }
</script>

<style scoped>

</style>
