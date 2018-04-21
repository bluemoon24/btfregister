<template>
  <div>
    <v-toolbar height="100em">
      <v-flex xs12 class="pr-3">
      <v-text-field
        label="Search"
        solo
        flat lazy
        v-model="filter"
        >
      </v-text-field>
      </v-flex>
        <v-spacer />
      <v-flex xs12 class="pr-3">
         <v-select
           label="Weekday"
           :items="[
            {text: 'Thursday', value: '2018-04-26'},
            {text: 'Friday', value: '2018-04-27'},
            {text: 'Saturday', value: '2018-04-28'},
            {text: 'Sunday', value: '2018-04-29'},
            {text: 'Monday', value: '2018-04-30'},
            {text: 'Tuesday', value: '2018-05-01'},
            {text: 'Wednesday', value: '2018-05-02'}
            ]"
           v-model="filteredDays"
           multiple
           hint="Filter a weekday"
           persistent-hint
         ></v-select>
       </v-flex>
       <v-flex xs4>
         <v-checkbox label="all" v-model="alluids"></v-checkbox>
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
      title='Festival Timeline'
      :list="list"
      v-on:tblistevent="handleListEvents"
      >
      <eventinfo-card
        :eventinfo="selected"
        :type="type"
        :locations="$store.state.locationData"
        slot-scope='props'
      />
    </tb-list>
  </div>
</template>

<script>
  import TbList from '~/components/TbList.vue'
  import { Eventinfo } from '~/components/Classes.js'
  // import EventinfoForm from '~/components/EventinfoForm.vue'
  import EventinfoCard from '~/components/EventinfoCard.vue'

  export default {
    components: {
      TbList, EventinfoCard
    },

    // watch: {
    //   '$store.state.eventinfoData': 'update'
    // },
    //
    async fetch ({ store, params, redirect }) {
      if (!store.state.uids.some(e => e.id === params.id)) return redirect('/')
      await store.dispatch('getUserData', params.id)
      await store.dispatch('setRealUser', params.id)
      await store.dispatch('getLocationData')
      await store.dispatch('getEventinfoData')
      console.log('async fetch eventinfo', store.state.eventinfoData)
    },
    created: function () {
      this.eventinfoList = Array.from(this.$store.state.eventinfoData, (evt) => (new Eventinfo(evt)))
      this.alluids = this.$privileged
      console.log('eventinfolist', this.eventinfoList, this.$store.state.eventinfoData)
    },
    computed: {
      list: function () {
        console.log('compute list from', this.eventinfoList)
        console.log('filteredDays', this.filteredDays.join(), '|', this.filteredDays.length, '|', this.$store.state.realUid)
        return this.eventinfoList.filter((e) => (
          e.toSearch().search(this.filter.toLowerCase()) >= 0 &&
          (this.alluids || e.involvedUids().indexOf(this.$store.state.uid) >= 0) &&
          (this.filteredDays.join().search(e.starts.split(' ')[0]) >= 0 || this.filteredDays.length <= 0)
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
        // this.eventinfoList = Array.from(this.$store.state.eventinfoData, (evt) => (new Eventinfo(evt)))
      },
      handleListEvents: function (e) {
        console.log('listevent', e)
        switch (e.type) {
          case 'selected':
            this.selectedIndex = e.payload
            if (this.selectedIndex >= 0) {
              this.selected = this.eventinfoList.find(e => e.id === this.list[this.selectedIndex].item.id)
            }
            break
        }
      }
    }
  }
</script>

<style scoped>

</style>
