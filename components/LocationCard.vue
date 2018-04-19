<template>
  <div>
    <!-- <v-container> -->
      <v-layout column class="mx-0 px-0">
        <v-flex>
          <v-card>
            <!-- <v-card-title>{{location.name}}</v-card-title> -->
              <v-dialog :showMap="mapShown" v-model="mapShown" lazy max-width="650px">
                <map-dialog :location="location" v-on:mapclosed="mapShown = false"/>
              </v-dialog>
              <v-card-text>
                <h4>Address
                  <v-btn flat small icon @click="mapShown = true">
                    <v-icon>map</v-icon>
                  </v-btn>
                </h4>
                  {{location.address ? location.address.split('\n')[0] : '' }}<br/>
                  {{location.address && location.address.length > 1 ? location.address.split('\n')[1] : '' }}
                  <br/>
                Phone: {{ location.phone || 'none'}}
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      <!-- </v-container> -->
    </div>
</template>

<script>
  // import { Location } from '~/components/Classes.js'
  import MapDialog from '~/components/MapDialog.vue'
  import axios from 'axios'

  export default {
    name: 'location-form',
    components: {
      MapDialog
    },
    props: {
      location: {
        type: Object
      },
      showMap: {
        type: Boolean
      }
    },
    watch: {
      'showMap': {
        handler: function () {
          this.mapShown = this.showMap
        }
      },
      'mapShown': {
        handler: function (value) {
          if (!value) this.$emit('mapclosed')
        }
      }
    },
    mounted: function () {
      // this.update()
    },
    data: () => {
      return {
        // location: ,
        selected: 0,
        mapShown: false,
        mapsUrl: '',
        showProgress: false
        // location: new Location()
      }
    },
    computed: {
      // address: function () { return this.location.address )},
      hasaddress: function () { return this.location.address.length > 1 },
      showtheMap: {
        get: () => (this.showMap),
        set: (value) => (this.mapShown = value)
      }
    },
    methods: {
      getaddresshtml: function (addr) {
        return addr.replace('\n', '<br />')
      },
      getPlaceId: function (url, obj) {
        // Festsaal der Rheinischen Landeskliniken
        // Kaiser-Karl-Ring 20
        // 53111 Bonn
        console.log(url)
        let that = this
        axios.get(url).then(function (response) {
          console.log(response)
          if (response.data.results.length !== 1) {
            console.log('Unexpected map result (not unique)')
            console.log('result is', response.data.results)
          }
          let data = response.data.results[0]
          obj.placeid = data.place_id
          that.showProgress = false
        }).catch(function (error) {
          console.log(error)
        })
      },
      getMaploc: function () {
        if (!this.hasaddress) return
        this.showProgress = true
        console.log('address lookup', this.location.address)
        const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=<address>&key=AIzaSyC5koryrIZY83R6fJ9CKMVSiB1QGa-kjFg'
        let tokens = this.location.address.split(/\s/m).join('+')
        let url = baseURL.replace('<address>', tokens)
        if (tokens.length > 0) this.getPlaceId(url, this.location)
      }
    }
  }
</script>

<style scoped>

</style>
