<template>
  <div>
      <v-layout column>
        <v-flex class="px-0 mx-0">
          <v-card>
            <v-card-title><h2>{{ eventstart }} - {{ eventTypes[eventinfo.type] }} </h2></v-card-title>
            <v-card-text><span><h4>Info</h4> {{eventinfo.evtdescription || 'none'}}</span>
              <h4>{{ eventinfo.type === 'tnt' ? 'From': 'Location' }}</h4>

              <v-flex xs12>
                <v-expansion-panel popout>
                  <v-expansion-panel-content>
                    <div slot="header">{{eventinfo.location.name}}</div>
                    <location-card :location="eventinfo.location"></location-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>

              <div v-if="eventinfo.type === 'tnt'">
                <h4>To:</h4>
                <v-flex xs12>
                  <v-expansion-panel popout >
                    <v-expansion-panel-content class="mx-0 px-0">
                      <div slot="header">{{eventinfo.targetloc.name}}</div>
                      <location-card :location="eventinfo.targetloc"></location-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-flex>
              </div>
              <v-flex>
                <h4>Involved</h4>
                {{ involved }}
              </v-flex>

              <div v-if="eventinfo.type !== 'tnt'">
                <h4>Ends</h4> {{eventend}}
              </div>

              <v-dialog :showMap="true" v-model="mapShown" lazy max-width="650px" v-if="eventinfo.type === 'tnt'">
                <v-btn v-if="eventinfo.type === 'tnt'" slot="activator" flat small>show route</v-btn>
                <map-dialog :location="eventinfo.location" :target="eventinfo.targetloc" v-on:mapclosed="mapShown = false"/>
              </v-dialog>

              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
</div>
</template>

<script>
  import MapDialog from '~/components/MapDialog.vue'
  import LocationCard from '~/components/LocationCard.vue'
  let moment = require('moment')
  moment.locale('en')

  export default {
    name: 'eventinfo-card',
    components: {
      MapDialog, LocationCard
    },
    props: {
      eventinfo: {
        type: Object
      },
      locations: {
        type: Array
      }
    },
    data: () => {
      return {
        eventTypes: {
          milonga: 'Milonga',
          workshop: 'Workshop',
          performance: 'Performance (Show, Concert)',
          soundcheck: 'Soundcheck',
          constraction: 'Construction',
          construction: 'Construction',
          tnt: 'Travel/Transport'
        },
        mapShown: false
      }
    },
    computed: {
      involved: function () { return this.eventinfo.involved.map(e => (e.name)).join(', ') },
      eventstart: function () {
        let d = moment(this.eventinfo.starts.split(/\s|T/).join(' '))
        console.log('fix 1', this.eventinfo.starts.split(/\s|T/).join(' '), d)
        return d.format('dddd, YYYY-MM-DD HH:mm')
      },
      eventend: function () { return this.eventinfo.ends.split(/\s|T/).join(' ') }
    }
  }
</script>

<style scoped>

</style>
