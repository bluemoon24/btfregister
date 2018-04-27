<template>
  <div>
    <!-- <tinymce id="d1" v-model="myHTML"></tinymce> -->
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
      this.$store.dispatch('getEventinfoData')
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
        myHTML: 'Type here',
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
