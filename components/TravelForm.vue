<template>
  <div>
    <v-flex xs12 md6>
      <v-radio-group v-model="travelby" label="Travel by" row @change="changeTravelBy">
        <v-radio label="Car" value='car' />
        <v-radio label="Plane@CGN" value='plane'/>
        <v-radio label="Train" value='train'/>
      </v-radio-group>
    </v-flex>

    <v-flex xs12 md6>
      <v-radio-group v-model="arrivalat" label="Arrive at" v-if="travelby === 'train'">
        <v-radio label="Bonn Main Train Station" value='bn' />
        <v-radio label="Siegburg Main Train Station (ICE)" value='su' />
        <v-radio label="Cologne Main Train Station" value='k' />
      </v-radio-group>
    </v-flex>

    <v-flex xs12 md6>
      <v-radio-group v-model="arrivalat" label="Arrive at" v-if="travelby === 'car'">
        <v-radio label="Accomodation place" value='accomodation' />
      </v-radio-group>
    </v-flex>

    <v-flex xs6 md3>
    <v-text-field v-if="travelby !== 'car'"
      :label="travelby === 'plane' ? 'Flight number' : (travelby === 'train' ? 'Train number' : null)"
      v-model="travelid"
    />
  </v-flex>

    <v-divider />

    <v-layout row wrap>
      <v-flex d-flex>
        <v-container>
          <v-layout column>
            <v-dialog
                 ref="dialog"
                 persistent
                 v-model="arrivalPicker"
                 lazy
                 full-width
                 width="290px"
                 :return-value.sync="arrival"
               >
            <v-text-field
              label="Arrival date"
              v-model="arrival"
              prepend-icon="event"
              :prepend-icon-cb="() => {departurePicker=false; arrivalPicker=!arrivalPicker}"
              :rules="[datimerule]"
              >
            </v-text-field>
              <v-date-picker v-model="arrival" scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="arrivalPicker = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dialog.save(arrival)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
<!--
            <v-date-picker v-if="arrivalPicker"
              v-model="arrival"
              no-title
              :allowedDates="allowedDates"

              actions>
              <template slot-scope="{ save, cancel }">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="cancel">Reset</v-btn>
                  <v-btn flat color="primary" @click="arrivalPicker=false">Submit</v-btn>
                </v-card-actions>
              </template>
            </v-date-picker> -->
          </v-layout>
        </v-container>
      </v-flex>

      <v-flex d-flex>
        <v-container>
          <v-layout column>
            <v-text-field
              slot="activator"
              label="Departure date"
              v-model="departure"
              prepend-icon="event"
              :prepend-icon-cb="() => {arrivalPicker=false; departurePicker=!departurePicker}"
              :rules="[datimerule]"
                >
            </v-text-field>
            <v-date-picker v-if="departurePicker"
              v-model="departure"
              no-title
              :allowedDates="allowedDates"
              actions>
              <template slot-scope="{ save, cancel }">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="departurePicker=false">Reset</v-btn>
                  <v-btn flat color="primary" @click="departurePicker=false">Close</v-btn>
                </v-card-actions>
              </template>
            </v-date-picker>
          </v-layout>
        </v-container>
      </v-flex>

      <v-divider />

      <v-flex xs12 md6>
      <v-select v-if="travelby === 'car'"
         :items="$store.state.locationData.filter(e => e.type === 'accomodation')"
         v-model="selected"
         item-text="name"
         item-value="id"
         label="Select location"
         single-line
         bottom
       ></v-select>
     </v-flex>

      <v-dialog v-model="showMap">
        <map-dialog :location="selectedLoc" :show="showMap" v-on:mapclosed="showMap=false"/>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  import MapDialog from '~/components/MapDialog.vue'
  import { Util } from '~/components/Classes.js'

  export default {
    name: 'travel-form',
    components: {
      MapDialog
    },
    // props: ['members'],
    // Garten Hotel
    // Siegburger Str. 207a
    // 53229 Bonn
    // google maps javascript api key: AIzaSyC5koryrIZY83R6fJ9CKMVSiB1QGa-kjFg
    // https://maps.googleapis.com/maps/api/geocode/json?address=107a+Siegbuerger+Str.,+53229,+Bonn,+DE&key=AIzaSyC5koryrIZY83R6fJ9CKMVSiB1QGa-kjFg
    // https://de.flightaware.com/live/flight/EWE6831
    // async fetch ({ store, params, redirect }) {
    //   if (params.id === '0' && !store.state.privileged) return redirect('/')
    //   await store.dispatch('getUserData', params.id)
    // },
    // computed: {
    //   list: function () {
    //     return this.exceptionList.map((m) => ({ item: m.name, header: m.header }))
    //   // },
    //   // options: function () {
    //   //   return this.members.map((m) => (m.name))
    //   }
    // },
    created: function () {
      this.departure = this.earliestDeparture()
      this.selectedLoc = this.$store.state.locationData[0]
      console.log('travelForm:location Data', this.$store.state.locationData)
    },
    data: () => {
      return {
        expandLocation: false,
        showMap: false,
        selected: '',
        selectedLoc: {},
        mapsUrl: '',
        address: '',
        travelid: '',
        travelby: 'plane',
        arrivalPicker: false,
        departurePicker: false,
        // as_group: 'group',
        arrival: new Date('2018-04-26').toISOString().substr(0, 10),
        departure: null,
        arrivalat: null,
        departureat: '',
        allowedDts: [
          new Date('2018-04-26').toISOString().substr(0, 10),
          new Date('2018-04-27').toISOString().substr(0, 10),
          new Date('2018-04-28').toISOString().substr(0, 10),
          new Date('2018-04-29').toISOString().substr(0, 10),
          new Date('2018-04-30').toISOString().substr(0, 10),
          new Date('2018-05-01').toISOString().substr(0, 10)
        ]
      }
    },
    computed: {
      locations: function () {
        return this.$store.state.locationData.map((loc) => ({ text: loc.name, value: loc.id }))
      },
      allowedDates: val => (val) => (val >= new Date('2018-04-26').toISOString().substr(0, 10) || val <= new Date('2018-05-01').toISOString().substr(0, 10)),
      selectedAddress: function () {
        const mapbaseURL = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDvzFijrwdV5DqXYAp1mspYWjN4vK5Z4AI&q='
        if (!this.selected) return ''
        let locind = this.$store.state.locationData.findIndex((e) => (e.id === this.selected))
        if (locind < 0) return ''
        this.selectedLoc = this.$store.state.locationData[locind]
        if (this.selectedLoc.placeid) this.mapsUrl = mapbaseURL + 'place_id:' + this.selectedLoc.placeid
        else this.mapsUrl = mapbaseURL + this.selectedLoc.address.split(/\s/m).join('+')
        return this.selectedLoc.address
      }
    },
    methods: {
      // updateMapsUrl: function () {
      //   this.mapsUrl = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDvzFijrwdV5DqXYAp1mspYWjN4vK5Z4AI&q=' +
      //   this.address.split(/\s/m).join('+')
      // },
      changeTravelBy: function (val) {
        switch (val) {
          case 'plane':
            this.arrivalat = 'cgn'
            // this.selected = this.$store.state.locationData.find(e => e.id === '9')
            break
          case 'car':
            this.arrivalat = 'accomodation'
            break
          case 'train':
            if (!['su', 'k', 'bn'].some(e => (e === this.arrivalat))) this.arrivalat = 'bn'
        }
      },
      handleListEvents: function (e) {
        console.log('listevent')
        // switch (e.type) {
        //   case 'add':
        //     this.exceptionList = this.exceptionList || []
        //     this.exceptionList.push({name: 'Select a name', header: ''})
        //     break
        // }
      },
      earliestDeparture: function () {
        var d = new Date(this.arrival)
        d.setDate(d.getDate() + 1)
        return d.toISOString().substr(0, 10)
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
      }
    }
  }
</script>

<style scoped>

</style>
