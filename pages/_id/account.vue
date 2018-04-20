<template>
  <div>
    <account-form :vip="vip" :showActions="true"></account-form>
</div>
</template>

<script>
// import { Group, Util } from '~/components/Classes.js'
import AccountForm from '~/components/AccountForm.vue'

export default {
  components: {
    AccountForm
  },

  data: () => ({
  }),

  async fetch ({ store, params, redirect }) {
    // note: mixins not yet available
    console.log('account.vue', store.state.privileged)
    if (!store.state.uids.some(e => e.id === params.id)) return redirect('/')
    await store.dispatch('getUserData', params.id)
  },
  computed: {
    vip: function () {
      return Object.assign({}, this.$store.state.udata)
    }
  },
  methods: {
    // submit: function () {
    //   console.log('submit form')
    //   let data = {}
    //   for (let k in this.group) {
    //     data[k] = this.group[k].text
    //   }
    //   let group = new Group(data)
    //   // for (var k in this.group) {
    //   //   obj[k] = this.group[k].text
    //   // }
    //   group['role'] = this.role.text
    //   group['id'] = this.$store.state.uid !== '0' ? this.$store.state.uid : Util.createUid(this.$store.state.uids)
    //   // if (!group.members) group.members = '[]'
    //   console.log('submit form', group)
    //   this.$store.dispatch('updateGroup', group)
    // }
  }
}
</script>

<style lang="stylus" scoped>
</style>
