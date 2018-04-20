<template>
  <div>
    <v-layout row wrap>
      <!-- <v-flex xs12> -->
      <v-flex >
        <v-flex >
          <v-text-field
          v-model="name"
          @input="changeName"
          label="Name"
          />
        </v-flex>

        <!-- <v-container fluid> -->
        <v-flex >
          <v-select
          :items="[
          {text: 'Milonga', value: 'milonga'},
          {text: 'Workshop', value: 'workshop'},
          {text: 'Performance (Show, Concert)', value: 'performance'},
          {text: 'Soundcheck', value: 'soundcheck'},
          {text: 'Construction', value: 'construction'},
          {text: 'Travel and Transport', value: 'tnt'},
          {text: 'Other', value: 'other'}]"
          @input="changeType"
          v-model="selectedType"
          label="Event type"
          ></v-select>
        </v-flex>

        <v-flex>
          <v-select v-if="selectedType === 'workshop'"
          :items="[
          {text: 'Beginner', value: 'beginner'},
          {text: 'Medium', value: 'medium'},
          {text: 'Advanced', value: 'advanced'},
          {text: 'Very Advanced', value: 'veryadvanced'}]"
          @input="changeLevel"
          v-model="level"
          label="Level"
          ></v-select>
        </v-flex>

      <v-flex >
        <v-select
        :items="locations"
        @input="changeLocation"
        v-model="selectedLocId"
        item-text="name"
        item-value="id"
        :label="selectedType === 'tnt' ? 'Pickup location' : 'Target location'"
        ></v-select>
        <v-select v-if="selectedType === 'tnt'"
        :items="locations"
        @input="changeTargetLoc"
        v-model="selectedLocId2"
        item-text="name"
        item-value="id"
        label="Select target location"
        ></v-select>
        <!-- <v-btn flat small color="primary" >New</v-btn> -->
      </v-flex>
    </v-flex>
    <!-- </v-container> -->
    <v-flex xs12 sm6 class="mt-0">
      <v-card height="100%">
        <!-- <v-card-title><h2></h2></v-card-title> -->
        <v-card-text >
          Event description
          <v-text-field
          height="100%"
          class="mt-0"
          hide-details
          editable
          textarea
          @change="changeDescription"
          v-model="evtdescription">
          </v-text-field>
        </v-card-text>
      </v-card>
    </v-flex>
    <!-- </v-flex> -->
  </v-layout>

  <v-divider />

  <v-layout row wrap>
    <v-flex d-flex  xs12 sm6>
      <v-layout column>
        <v-container>
          <v-layout row wrap>

            <v-text-field
            v-model="start_datime"
            @change="changeStartime"
            label="Start"
            :prepend-icon-cb="openStartDialog"
            prepend-icon="event"
            :rules="[datimerule]"
            />
            <!-- <v-text-field
            v-model="start_time"
            @blur="changeName"
            :prepend-icon-cb="openStartDialog"
            prepend-icon="schedule"
            :rules="[timerule]"
            /> -->

            <v-dialog v-model="showStartPicker" max-width='350px'>
              <date-time-picker :date="psdate" :time="pstime" v-on:datime="startDateEvent"/>
            </v-dialog>

          </v-layout>
        </v-container>
      </v-layout>
    </v-flex>

    <v-flex d-flex xs12 sm6>
      <v-layout column>
        <v-container>
          <v-layout row wrap>

            <v-text-field
            v-model="end_datime"
            @change="changeEndtime"
            label="End"
            :prepend-icon-cb="openEndDialog"
            prepend-icon="event"
            :rules="[datimerule]"
            />
            <!-- <v-text-field
            v-model="end_time"
            :prepend-icon-cb="openEndDialog"
            prepend-icon="schedule"
            :rules="[timerule]"
            /> -->

            <v-dialog v-model="showEndPicker" max-width='350px'>
              <date-time-picker :date="pedate" :time="petime" v-on:datime="endDateEvent"/>
            </v-dialog>

          </v-layout>
        </v-container>
      </v-layout>
    </v-flex>

    <v-flex xs12 sm6>
      <v-select
      label="Involved"
      multiple
      :items="parties"
      v-model="involved"
      @input="changeInvolved"
      ></v-select>
    </v-flex>

  </v-layout>
</div>
</template>

<script>
  import MapDialog from '~/components/MapDialog.vue'
  import DateTimePicker from '~/components/DateTimePicker.vue'
  import { Util } from '~/components/Classes.js'

  export default {
    name: 'eventinfo-form',
    components: {
      MapDialog, DateTimePicker
    },
    props: {
      eventinfo: {
        type: Object
      },
      locations: {
        type: Array
      }
    },
    watch: {
      'eventinfo': {
        handler: 'update'
        // deep: true
      // },
      // 'eventinfo.location': {
      //   handler: 'update',
      //   deep: true
      }
    },

    async fetch ({ store }) {
      console.log('fetch eventlocation', this.eventinfo.id)
      // if (!Array.isArray(this.$store.state.locationData || this.$store.state.locationData.length <= 0)) this.$store.dispatch('getLocationData')
      // await store.dispatch('getEventLocation', this.eventinfo.id)
      console.log('**EventId', this.eventinfo)
    },

    mounted: function () {
      this.update()
    },
    data: () => {
      return {
        showStartPicker: false,
        showEndPicker: false,
        start_datime: '2018-04-26 12:00',
        start_date: '2018-04-26',
        start_time: '12:00',
        end_datime: '2018-05-01 02:00',
        end_date: '2018-05-01',
        end_time: '01:30',
        psdate: '2018-04-26',
        pstime: '12:00',
        pedate: '2018-05-01',
        petime: '01:30',
        name: '',
        selectedType: '',
        level: 'medium',
        selectedLocId: 0,
        selectedLocId2: 0,
        involved: [],
        involved1: ['a', 'b'],
        location: {},
        evtdescription: ''
      }
    },
    computed: {
      locs: function () {
        let locs = this.locations.map((loc) => ({ text: loc.name, value: loc.id }))
        return locs
      },
      parties: function () {
        let list = this.$store.state.uids
        return list.map((p) => ({ text: p.name, value: p.id }))
      }
    },

    methods: {
      changeType: function (newval) { this.eventinfo.type = newval },
      changeLevel: function (newval) { this.eventinfo.level = newval },
      changeDescription: function (newval) { this.eventinfo.evtdescription = newval },
      changeLocation: function (newval) { this.eventinfo.location = newval },
      changeTargetLoc: function (newval) { this.eventinfo.targetloc = newval },
      changeInvolved: function (newval) { this.eventinfo.involved = newval },
      changeStartime: function (newval) {
        console.log('changeStartime', newval)
        this.eventinfo.starts = newval
      },
      changeEndtime: function (newval) { this.eventinfo.ends = newval },
      changeName: function (newval) {
        // ev.starts = this.start_datime.replace(/\s/, 'T')
        // ev.ends = this.end_datime.replace(/\s/, 'T')
        this.eventinfo.name = newval
      },
      formatDateTime: function (date) {
        let [y, m, d, h, min] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]
        d = (d < 9 ? '0' : '') + d
        m = (m < 9 ? '0' : '') + m
        h = (h < 9 ? '0' : '') + h
        min = (min < 9 ? '0' : '') + min
        // let (h, min, s) = date.toLocaleTimeString().split(':')
        let result
        result.date = [y, m, d].join('-')
        result.time = [h, min].join(':')
        result.datetime = [result.date, result.time].join('T')
        return result
      },
      update: function () {
        console.log('EventinfoForm mounted/updated', this.eventinfo)
        // console.log('json of array', this.eventinfo.involved)
        // console.log('involved', this.eventinfo.involved, Array.isArray(this.eventinfo.involved), typeof this.eventinfo.involved)
        this.selectedLocId = this.eventinfo && this.eventinfo.location ? this.eventinfo.location.id : -1
        this.selectedLocId2 = this.eventinfo && this.eventinfo.targetloc ? this.eventinfo.targetloc.id : -1
        // console.log('locs', this.locs, '>', this.eventinfo.location, '>', this.selectedLocId)
        // this.selectedLoc = this.eventinfo ? this.eventinfo.location : this.selectedLoc
        this.selectedType = this.eventinfo ? this.eventinfo.type : this.selectedType
        this.name = this.eventinfo ? this.eventinfo.name : this.name
        this.evtdescription = this.eventinfo ? this.eventinfo.evtdescription : this.evtdescription
        this.level = this.eventinfo ? this.eventinfo.level : this.level
        this.start_datime = this.eventinfo ? this.eventinfo.starts : this.start_datime
        this.end_datime = this.eventinfo ? this.eventinfo.ends : this.end_datime
        this.start_datime = this.start_datime.replace('T', ' ')
        this.end_datime = this.end_datime.replace('T', ' ')
        let involved = this.eventinfo && Array.isArray(this.eventinfo.involved) ? this.eventinfo.involved : this.involved
        this.involved = involved.map((e) => (e.id || ''))
        // console.log('****  involved', involved)
        // console.log('****  involved 2', this.involved)
        // console.log('****  involved 3', this.eventinfo.involved)
        let ds = new Date(this.eventinfo ? this.eventinfo.starts : this.start_date)
        // console.log('ds is ', ds, this.eventinfo.starts)
        // let [d, m, y] = ds.toLocaleDateString().split('.')
        this.start_date = Util.formatDateTime(ds).date
        // this.start_date = ds.toISOString().split('T')[0]
        // console.log('start_date', this.start_date)
        this.start_time =
          (ds.getHours() > 9 ? '' : '0') + ds.getHours() +
          (ds.getMinutes() > 9 ? ':' : ':0') + ds.getMinutes()
        let de = new Date(this.eventinfo ? this.eventinfo.ends : this.end_date)
        this.end_date = Util.formatDateTime(de).date // de.toISOString().split('T')[0]
        // console.log('end_date', this.end_date)
        this.end_time =
          (de.getHours() > 9 ? '' : '0') + de.getHours() +
          (de.getMinutes() > 9 ? ':' : ':0') + de.getMinutes()
        this.psdate = this.start_date
        this.pstime = this.start_time
        this.pedate = this.end_date
        this.petime = this.end_time
      },
      timerule: (value) => (/^$|^([01]?[0-9]|2[0-3]):(00|15|30|45)$/.test(value) || 'Invalid time format (hh:00, hh:15, ...)'),
      daterule: (value) => {
        return Util.isValidDate(value) || 'Invalid date'
      },
      datimerule: (value) => {
        const pat = /^$|^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
        let [d, t] = value.split(/\s/)
        if (!t) t = ''
        return (Util.isValidDate(d) && pat.test(t)) || 'Invalid date or time'
      },
      startDateEvent: function (e) {
        console.log('startDateEvent', e)
        if (e.type === 'save') {
          this.start_date = e.payload.date
          this.start_time = e.payload.time
          this.start_datime = e.payload.datime
          this.changeStartime(this.start_datime.replace(/\s/, 'T'))
        }
        this.showStartPicker = false
      },
      endDateEvent: function (e) {
        console.log('endDateEvent', e)
        if (e.type === 'save') {
          this.end_date = e.payload.date
          this.end_time = e.payload.time
          this.end_datime = e.payload.datime
          this.changeEndtime(this.end_datime.replace(/\s/, 'T'))
        }
        this.showEndPicker = false
      },
      openStartDialog: function () {
        [this.psdate, this.pstime] = this.start_datime.split(/\s/)
        // console.log('openStartDialog', this.psdate, this.pstime)
        // this.pstime = this.start_time
        this.showStartPicker = true
      },
      openEndDialog: function () {
        [this.pedate, this.petime] = this.end_datime.split(/\s/)
        console.log('openEndDialog', this.pedate, this.petime)
        // this.petime = this.end_time
        this.showEndPicker = true
      }
    }
  }
</script>

<style scoped>

</style>
