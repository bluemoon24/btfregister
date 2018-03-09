<template>
  <div>
    <tb-list
      title="Location Editor"
      :list="list"
      add_icon='add_location'
      :actions="[{ id: 'submit', label: 'submit', close: true },
                { id: 'show', label: 'show on map', close: false }]"
      v-on:tblistevent="handleListEvents"
      >
      <location-form
        slot-scope="props"
        :showMap="showMap"
        :location.sync="selected"
        v-on:mapclosed="showMap = false"
      />
  </tb-list>
</div>
</template>

<script>
  import { Location } from '~/components/Classes.js'
  import TbList from '~/components/TbList.vue'
  import MapDialog from '~/components/MapDialog.vue'
  import LocationForm from '~/components/LocationForm.vue'
  // import axios from 'axios'

  export default {
    components: {
      TbList, MapDialog, LocationForm
    },

    async fetch ({ store, params, redirect }) {
      await store.dispatch('getUserData', store.state.uid || params.id)
      if (!store.state.privileged) {
        return redirect('/' + store.state.uid)
      }
      if (store.state.locationData.length <= 0) await store.dispatch('getLocationData')
    },

    computed: {
      list: function () {
        return this.locations.map((loc) => ({ item: loc, header: loc.name }))
      }
    },

    created: function () {
      this.locations = Array.from(this.$store.state.locationData, (loc) => (new Location(loc)))
    },

    methods: {
      handleListEvents: function (e) {
        console.log('listevent', e)
        switch (e.type) {
          case 'selected':
            this.selectedIndex = e.payload
            if (this.selectedIndex >= 0) this.selected = this.locations[this.selectedIndex]
            break
          case 'add':
            this.locations = this.locations || []
            this.locations.push(new Location())
            break
          case 'action':
            if (e.payload.action === 'submit') {
              let loc = new Location(e.payload.item)
              this.$store.dispatch('uploadLocationData', loc)
            } else if (e.payload.action === 'show') {
              this.showMap = true
            }
        }
      }
    },

    data: () => {
      return {
        locations: [],
        selectedIndex: -1,
        showMap: false,
        mapsUrl: '',
        selected: new Location()
      }
    }
  }
</script>

<style scoped>

</style>
