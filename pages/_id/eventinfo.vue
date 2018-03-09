<template>
  <div>
    <tb-list
      title='Event information'
      add_icon='playlist_add'
      :list="list"
      :actions="$privileged ? [{ id: 'submit', label: 'submit', close: true }, { id: 'cancel', label: 'cancel', close: true }] : ''"
      v-on:tblistevent="handleListEvents"
      >
      <eventinfo-form
        :eventinfo.sync="selected"
        :type.sync="type"
        :locations="$store.state.locationData"
        slot-scope='props'
      />
    </tb-list>
  </div>
</template>

<script>
  import TbList from '~/components/TbList.vue'
  import { Eventinfo } from '~/components/Classes.js'
  import EventinfoForm from '~/components/EventinfoForm.vue'

  export default {
    components: {
      TbList, EventinfoForm
    },

    async fetch ({ store, params, redirect }) {
      if (store.state.uid === '0' && !store.state.privileged) return redirect('/')
      await store.dispatch('getUserData', store.state.uid || params.id)
      await store.dispatch('getLocationData')
      await store.dispatch('getEventinfoData')
      console.log('async fetch eventinfo', store.state.eventinfoData)
    },
    created: function () {
      this.eventinfoList = this.$store.state.eventinfoData // Array.from(this.$store.state.eventinfoData, (evt) => (new Eventinfo(evt)))
      console.log('created eventinfo', this.$store.state.eventinfoData) // TODO store is wrong
      console.log('created eventinfo (2)', this.eventinfoList)
    },
    computed: {
      list: function () {
        console.log('compute list from', this.eventinfoList)
        return this.eventinfoList.map((evt) => ({
          item: evt,
          header: evt.starts.replace('T', ' ') + ' - ' + evt.type + ': ' + evt.name
        }))
      }
    },
    data: () => {
      return {
        selectedIndex: -1,
        selected: new Eventinfo(),
        type: 'workshop',
        eventinfoList: []
      }
    },
    methods: {
      handleListEvents: function (e) {
        console.log('listevent', e)
        switch (e.type) {
          case 'selected':
            this.selectedIndex = e.payload
            if (this.selectedIndex >= 0) this.selected = this.eventinfoList[this.selectedIndex]
            break
          case 'add':
            this.eventinfoList = this.eventinfoList || []
            this.eventinfoList.push(new Eventinfo())
            break
          case 'action':
            if (e.payload.action === 'submit') {
              let ev = new Eventinfo(e.payload.item)
              try {
                ev.involved = JSON.stringify(e.payload.item.involved)
                this.$store.dispatch('uploadEventinfoData', ev)
              } catch (e) {
                console.log('uploadEventinfoData', e)
              }
              // console.log('submitevent', this.selected)
            }
            break
        }
      }
    }
  }
</script>

<style scoped>

</style>
