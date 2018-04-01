<template>
  <div>
    <v-flex xs12 md6>
      <v-radio-group v-model="travelset" label="Planned travelling" row>
        <v-radio label="as group" value='group' />
        <v-radio label="individually" value='individual'/>
      </v-radio-group>
    </v-flex>

  <v-divider/>

  <travel-form v-if="travelset === 'group'"></travel-form>

  <tb-list v-else
    title='Travel information (individually)'
    add_icon='playlist_add'
    :list="list"
    :actions="[{ id: 'submit', label: 'submit', close: true }, { id: 'cancel', label: 'cancel', close: true }]"
    v-on:tblistevent="handleListEvents"
    >
    <v-form slot-scope="props">
      <v-flex xs6>
         <v-select
           :items="members"
           item-text="name"
           v-model="selectedMembers"
           label="Select"
           single-line
           bottom
           tags
         ></v-select>
       </v-flex>
       <travel-form>
       </travel-form>
    </v-form>
  </tb-list>
  </div>
</template>

<script>
  import TbList from '~/components/TbList.vue'
  import TravelForm from '~/components/TravelForm.vue'
  export default {
    components: {
      TbList,
      TravelForm
    },
    // https://de.flightaware.com/live/flight/EWE6831
    async fetch ({ store, params, redirect }) {
      if (store.state.uid === '0' && !store.state.privileged) return redirect('/')
      await store.dispatch('getUserData', store.state.uid || params.id)
      await store.dispatch('getLocationData')
      await store.dispatch('getTravelData')
    },
    mounted: function () {
      this.members = this.$store.state.udata.members
    },
    computed: {
      list: function () {
        return this.exceptionList.map((m) => ({ item: m.members, header: m.members.map(e => (e.name)).join(', ') }))
      }
    },
    data: () => {
      return {
        selected: '',
        members: [],
        selectedMembers: [],
        exceptionList: [],
        travelset: 'group'
      }
    },
    methods: {
      handleListEvents: function (e) {
        console.log('listevent', e)
        switch (e.type) {
          case 'selected':
            this.selected = e.payload
            break
          case 'add':
            this.exceptionList = this.exceptionList || []
            console.log('addevent', this.selectedMembers)
            this.exceptionList.push({members: this.selectedMembers, header: ''})
            break
          case 'action':
            if (e.payload.action === 'submit') {
              console.log('submitevent', this.selectedMembers)
              this.exceptionList[this.selected].members = this.selectedMembers
            }
            break
        }
      }
    }
  }
</script>

<style scoped>

</style>
