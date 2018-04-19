<template>
  <div>
    <tb-list
        :title="`VIP Editor ${selected.name}` "
        :list="list"
        add_icon='person_add'
        :actions="[{ id: 'submit', label: 'submit', close: true }, { id: 'cancel', label: 'cancel', close: true }]"
        v-on:tblistevent="handleListEvents"
      >
        <account-form :vip="selected" slot-scope='props'></account-form>
    </tb-list>
  </div>
</template>

<script>
  import TbList from '~/components/TbList.vue'
  import AccountForm from '~/components/AccountForm.vue'
  import { Group, Util } from '~/components/Classes.js'

  export default {
    components: {
      TbList, AccountForm
    },
    data: () => {
      return {
        selected: '',
        newgroup: null,
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
        let st = this.$store.state.uids
        console.log('list function', st)
        if (this.newgroup) st = st.concat([this.newgroup])
        return st.map((m) => ({ item: m, header: m.name, icon: null }))
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
      handleListEvents: function (e) {
        console.log('listevent', e)
        switch (e.type) {
          case 'selected':
            this.selectedIndex = e.payload
            if (this.selectedIndex >= 0) {
              this.selected = Object.assign(this.selected, this.list[e.payload].item)
              console.log('handleListevent adminnew 1', this.selected.name, e.payload)
              this.$store.dispatch('getUserData', this.selected.id)
              // this.selected = Object.assign(this.selected, this.$store.state.udata)
              console.log('handleListevent adminnew 2', this.$store.state.uid)
            } else {
              console.log('handleListevent selectedIndex < 0')
              this.$store.dispatch('getUserData', 0)
            }
            break
          case 'add':
            this.newgroup = new Group()
            // this.eventinfoList = this.eventinfoList || []
            // this.eventinfoList.push(new Eventinfo())
            break
          case 'delete':
            // this.$store.dispatch('deleteEventinfoData', this.selected.id)
            break
          case 'action':
            if (e.payload.action === 'submit') {
              console.log('submit payload', e.payload)
              this.submit(e.payload.item)
              this.newgroup = null
              // let ev = new Eventinfo(this.selected)
              // ev.involved = JSON.stringify(e.payload.item.involved)
              // console.log('updateEventinfoData:submit', this.selected)
              // this.$store.dispatch('updateEventinfoData', this.selected)
            // console.log('submitevent', this.selected)
            }
            break
        }
      },
      submit: function (item) {
        console.log('submit form', item)
        // let data = {}
        // for (let k in this.group) {
        //   data[k] = this.group[k].text
        // }
        let group = new Group(item)
        // for (var k in this.group) {
        //   obj[k] = this.group[k].text
        // }
        // group['role'] = this.role.text
        group['id'] = item.uid !== '0' ? item.uid : Util.createUid(this.$store.state.uids)
        // if (!group.members) group.members = '[]'
        console.log('submit form (2)', group)
        // this.$store.dispatch('updateGroup', group)
      }

    }
  }
</script>

<style scoped>

</style>
