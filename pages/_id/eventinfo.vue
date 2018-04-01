<template>
  <div>
    <v-toolbar height="100em">
      <v-flex xs6 class="pr-3">
      <v-text-field
        label="Filter"
        solo dark
        flat lazy
        v-model="filter"
        >
      </v-text-field>
      </v-flex>
        <v-spacer />
      <v-flex xs2 class="pr-6">
        <v-switch label="All" v-model="alluids" v-if="$privileged"></v-switch>
      </v-flex>
    </v-toolbar>
    <v-toolbar>
      <v-flex xs12>
         <v-select
           label="Select"
           :items="[
            {text: 'Thursday', value: '2018-04-26'},
            {text: 'Friday', value: '2018-04-27'},
            {text: 'Saturday', value: '2018-04-28'},
            {text: 'Sunday', value: '2018-04-29'},
            {text: 'Monday', value: '2018-04-30'},
            {text: 'Tuesday', value: '2018-05-01'},
            {text: 'Wednesday', value: '2018-04-26'}
            ]"
           v-model="filteredDays"
           multiple
           hint="What are the target regions"
           persistent-hint
         ></v-select>
       </v-flex>
      <!-- <v-checkbox label="Thu" value='2018-04-26' v-model="filteredDays"></v-checkbox>
      <v-checkbox label="Fri" value='2018-04-27' v-model="filteredDays"></v-checkbox>
      <v-checkbox label="Sat" value='2018-04-28' v-model="filteredDays"></v-checkbox>
      <v-checkbox label="Sun" value='2018-04-29' v-model="filteredDays"></v-checkbox>
      <v-checkbox label="Mon" value='2018-04-30' v-model="filteredDays"></v-checkbox>
      <v-checkbox label="Tue" value='2018-05-01' v-model="filteredDays"></v-checkbox>
      <v-checkbox label="Wed" value='2018-05-02' v-model="filteredDays"></v-checkbox> -->
  </v-toolbar>

    <tb-list
      title='Events'
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

    watch: {
      '$store.state.eventinfoData': 'update'
    },

    async fetch ({ store, params, redirect }) {
      if (!store.state.uids.some(e => e.id === params.id)) return redirect('/')
      await store.dispatch('getUserData', store.state.uid || params.id)
      await store.dispatch('getLocationData')
      await store.dispatch('getEventinfoData')
      console.log('async fetch eventinfo', store.state.eventinfoData)
    },
    created: function () {
      this.update()
    },
    computed: {
      list: function () {
        console.log('compute list from', this.eventinfoList)
        console.log('filteredDays', this.filteredDays.join(), '|', this.filteredDays.length, '|', this.$store.state.realUid)

        return this.eventinfoList.filter((e) => (
          e.toSearch().search(this.filter.toLowerCase()) >= 0 &&
          (this.alluids || e.involvedUids().indexOf(this.$store.state.uid) >= 0) &&
          (this.filteredDays.join().search(e.starts.split('T')[0]) >= 0 || this.filteredDays.length <= 0)
        )
        ).map((evt) => ({
          item: evt,
          header: evt.starts.replace('T', ' ') + ' - ' + evt.key + ' - ' + evt.type + ': ' + evt.name
        }))
      }
    },
    data: () => {
      return {
        selectedIndex: -1,
        selected: new Eventinfo(),
        type: 'workshop',
        filter: '',
        filterMe: '',
        todayOnly: false,
        futureOnly: false,
        alluids: false,
        eventinfoList: [],
        filteredDays: []
      }
    },
    methods: {
      update: function () {
        this.eventinfoList = Array.from(this.$store.state.eventinfoData, (evt) => (new Eventinfo(evt)))
      },
      handleListEvents: function (e) {
        console.log('listevent', e)
        switch (e.type) {
          case 'selected':
            this.selectedIndex = e.payload
            if (this.selectedIndex >= 0) {
              this.selected = this.eventinfoList.find(e => e.id === this.list[this.selectedIndex].item.id)
              // console.log('eventinfo:update', e.payload, this.list[this.selectedIndex].item, 'id=', this.list[this.selectedIndex].item.id, this.selected)
            }
            break
          case 'add':
            this.eventinfoList = this.eventinfoList || []
            this.eventinfoList.push(new Eventinfo())
            break
          case 'delete':
            this.$store.dispatch('deleteEventinfoData', this.selected.id)
            break
          case 'action':
            if (e.payload.action === 'submit') {
              // let ev = new Eventinfo(this.selected)
              // ev.involved = JSON.stringify(e.payload.item.involved)
              console.log('updateEventinfoData:submit', this.selected)
              this.$store.dispatch('updateEventinfoData', this.selected)
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
