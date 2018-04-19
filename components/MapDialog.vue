<template>
  <div>
    <v-card>
      <v-card-title>
        <h3>{{ (location ? location.name : '') }} {{ (target ? ' to ' + target.name : '') }}</h3>
      </v-card-title>
      <v-card-text>
        <iframe
            width="600"
            height="450"
            frameborder="0" style="border:0"
            :src="mapsUrl" allowfullscreen>
          </iframe>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="$emit('mapclosed')">Close</v-btn>
      </v-card-actions>
    </v-card>
</div>
</template>

<script>
  export default {
    name: 'map-dialog',
    props: {
      location: {
        type: Object
      },
      target: {
        type: Object,
        default: null
      },
      show: {
        type: Boolean
      }
    },
    data: () => {
      return {
        showMap: true
      }
    },
    computed: {
      mapsUrl: function () {
        console.log('mapsdialog', this.location, this.target)
        if (!this.location) return
        let baseURL = ''
        if (this.target) {
          baseURL = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyDvzFijrwdV5DqXYAp1mspYWjN4vK5Z4AI' +
          '&origin=place_id:' + this.location.placeid +
          '&destination=place_id:' + this.target.placeid
        } else {
          baseURL = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDvzFijrwdV5DqXYAp1mspYWjN4vK5Z4AI&q='
          // this.loc = this.$store.state.locationData.find((e) => (e.id === this.locid))
          if (this.location.placeid) baseURL = baseURL + 'place_id:' + this.location.placeid
          else baseURL = baseURL + this.location.address.split(/\s/m).join('+')
        }
        console.log('map baseurl', baseURL)
        return baseURL
      }
    }
  }
</script>

<style scoped>

</style>
