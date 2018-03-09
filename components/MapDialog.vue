<template>
  <div>
    <v-card>
      <v-card-title>
        {{ (location ? location.name : '') }}
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
        console.log('mapsdialog', this.location)
        if (!this.location) return
        const baseURL = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDvzFijrwdV5DqXYAp1mspYWjN4vK5Z4AI&q='
        // this.loc = this.$store.state.locationData.find((e) => (e.id === this.locid))
        if (this.location.placeid) return baseURL + 'place_id:' + this.location.placeid
        else return baseURL + this.location.address.split(/\s/m).join('+')
      }
    }
  }
</script>

<style scoped>

</style>
