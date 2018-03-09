<template>
  <div>
    accomodation: {{ person_string }}
    <!-- {{ person }} -->
    <!-- <location-form :showMap.sync="showMap" :location.sync="location" v-on:mapclosed="showMap = false"/>
    <v-btn @click="showMap=true">show on map</v-btn> -->
    <v-btn @click="handler">tostring</v-btn>

  </div>
</template>

<script>
  import LocationForm from '~/components/LocationForm.vue'
  // import axios from 'axios'
  import { DerivedClass } from '~/components/Classes.js'

  export default {

    // export const state = () => ({
    //   sidebar: false
    // })
    //
    // export const mutations = {
    //   toggleSidebar (state) {
    //     state.sidebar = !state.sidebar
    //   }
    // }
    //
    // export default {
    // function toneo(obj) {
    //   let result = []
    //   for (let k in obj) {
    //     result.push('' + k + ':"' + obj[k] + '"')
    //   }
    //   return '{' + result.join(',') + '}'
    // }
    components: {
      LocationForm
    },
    computed: {
      // personData: function () {
      //   this.$store.state.personData.map((p) => ({id: p.id, name: p.name, allergies: p.allergies, instrument: p.instrument, mobile: p.mobile}))
      // }
    },
    methods: {
      handler: function () {
        let persons = this.$store.state.personData.map((p) => ({id: p.id, name: p.name, managerof: p.managerof, memberof: p.memberof}))
        // let groups = this.$store.state.uids.map((p) => ({
        //   id: p.id,
        //   name: p.name,
        //   email: p.email,
        //   role: p.role,
        //   url: p.url,
        //   postaladdress: p.postaladdress,
        //   comments: p.comments
        // }))
        // console.log('persondata', groups)
        for (var i = 0; i < persons.length; i++) {
          for (var j = 0; j < persons[i].memberof.length; j++) {
            console.log(persons[i].id, ' is member of', persons[i].memberof[j])
            this.$store.dispatch('setMemberRelation', [persons[i].id, persons[i].memberof[j]])
          }
          // MATCH (p {id: '4'}), (g {id: '63021'}) CREATE(g)-[r:MANAGEDBY]->(p)
        }
      }
    },
    data: () => {
      return {
        // location: new Location({
        // }),
        person: new DerivedClass({
          id: 'id',
          name: 'name',
          mobile: 'mobile',
          instrument: 'bandoneon',
          // managerof: ['A', 'B'],
          // memberof: [ { m1: 'group', m2: 'member2' } ]
          allergies: 'allergies'
        }),
        person_string: '',
        showMap: false
      }
    }
  }
</script>

<style scoped>

</style>
