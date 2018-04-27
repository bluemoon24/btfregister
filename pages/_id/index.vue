<template>
  <v-container align-center>
    <v-layout column>
      <v-flex xs12 md11>
        <v-card raised>
          <v-card-title><h2>Welcome {{ name }}!</h2></v-card-title>
          <v-card-text style="font-size: 12pt;">
            <p>
              We are very happy having you with us!
            </p>
            <p>
              With this page, we, the organizers, want to make it easy for you to access all relevant information.
            </p>
            <p>
              Your personal ID is: <strong>{{$store.state.uid}}</strong>, which is part of the URL (http://vip-registration.tangofestival-bonn.de<strong>/{{$store.state.uid}}</strong>).
              It allows us to filter the relevant information for you.
            </p>
              NOte: This site has been built recently and may contain bugs or may be somewhat slow in some cases (small server behind it).
              If you need help with this or found a bug, just <a href="mailto: lothar@tangobuehne.de">drop us a note</a>.
              <v-dialog max-width="650px">
              <v-btn slot="activator" small flat >click for short introduction</v-btn>
                <v-card>
                  <v-card-text style="font-size: 12pt;">
                    <p>
                      You will see a navigation sidebar on the left side. If you are on a small screen this may have disappeared and can be called with the menu button on the
                      upper left corner.
                    </p>
                      Here is a short description:
                      <ul style="margin-left:2em">
                        <li>'account' - Group information. Please check and make changes to correct it.</li>
                        <li>'details' - Person information. Please check make changes to correct it, especially for food intolerances, allergies etc.</li>
                        <li>'timeline' - You will most likely use this in the most cases. All pickup times, events, etc. are listed here.
                        You can also look at all festival events (not just yours), by checking the 'all' checkbox in the upper right (be patient, it may take a while)</li>
                        <li>'maps and routes' - when you see a map symbol for locations, click on it and the location will be shown in google maps</li>
                      </ul><br/>
                      <p style="font-style:italic;">(click outside to dismiss)</p>
                    </v-card-text>
                      </v-card>
                    </v-dialog>
                    <p>
                    We hope you will find it useful and look forward to having a cool festival time altogether.
                  </p>
                <h4>Phone numbers</h4>
                Organizers:<br/>
                <ul style="margin-left:2em">
                  <li>Susanne: +49 152 21523315‬</li>
                  <li>Harald: ‭+49 176 53367264</li>
                  <li>Lothar: ‭+49 1590 1203117</li>
                  <li>Bernd (Saturday): +49 176 54540111‬</li>
                </ul>
                Other:<br/>
                <ul style="margin-left:2em">
                  <li>Taxi: +49 228 28284</li>
                  <li>Thomas (Stage Technician): ‭+49 151 19607346</li>
                </ul>

          </v-card-text>
          <v-dialog v-if="canshow" max-width="600px">
            <v-btn slot="activator" outline >My accomodation</v-btn>
            <location-card :location="this.accomodation" v-if="canshow"></location-card>
        </v-dialog>
        <v-btn outline :to="'/' + this.$store.state.uid + '/eventinfo'">My timeline</v-btn>
      </v-toolbar>
        </v-card>
      </v-flex>
    </v-layout>
    </v-container>
</template>

<script>

import { mapState } from 'vuex'
import LocationCard from '~/components/LocationCard.vue'

export default {
  async fetch ({ store, params, redirect }) {
    store.dispatch('setRealUser', params.id)
    // console.log('index:fetch', store.state.privileged, store.state.uids, params.id)
    // if (params.id === '0' && !store.state.privileged) return redirect('/')
    console.log('index.vue', store.state.privileged)
    if (!store.state.privileged && !store.state.uids.some((uids) => uids.id === params.id)) {
      return redirect('/')
    } else {
      let uid = store.state.uid || params.id
      console.log('fetching userdata etc')
      await store.dispatch('getUserData', uid)
      await store.dispatch('getEventinfoData')
      await store.dispatch('getLocationData')
    }
  },
  components: {
    LocationCard
  },
  created: function () {
    // console.log('getAccomodationData', this.$store.state.uid)
    // this.$store.dispatch('getAccomodationData', this.$store.state.uid)
  },
  computed: {
    ...mapState({
      name: state => (state.udata.name),
      accomodation: state => (state.udata.accomodation),
      members: state => (state.udata.members)
    }),
    // ...mapGetters([
    //   'udata'
    // ])
    personData: function () {
      this.$store.state.personData.map((p) => ({id: p.id, name: p.name, allergies: p.allergies, instrument: p.instrument, mobile: p.mobile}))
    },
    canshow: function () {
      return (this.accomodation && this.accomodation.address)
    }
  }
}
</script>


<style scoped>

</style>
