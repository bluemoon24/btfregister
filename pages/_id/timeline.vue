<template>
  <div>
    {{personData}}
  </div>
</template>

<script>
  export default {
    computed: {
      personData: function () {
        this.$store.state.personData.map((p) => ({id: p.id, name: p.name, allergies: p.allergies, instrument: p.instrument, mobile: p.mobile}))
      }
    },

    async fetch ({ store, params, redirect }) {
      if (params.id === '0' && !store.state.privileged) return redirect('/')
      await store.dispatch('getUserData', params.id)
      await store.dispatch('getEventinfoData')
      await store.dispatch('getLocationData')
    },

    methods: {
      getUids: function (group = null) {
        if (!group) this.$store.dispatch('getUids')
        else this.$store.dispatch('getNeo', group)
      },

      migrateEventinfo: function () {
        let events = this.$store.state.eventinfoData.map((e) => (
          {id: e.id, name: e.name, type: e.type, starts: e.start, ends: e.end}
        ))
        console.log(events)
        for (var i = 0; i < events.length; i++) {
          // delete events[i].involved
          // delete events[i].location
          console.log('event', i, events[i])
          this.$store.dispatch('storeEventinfo', events[i])
        }
      },

      migrateLocations: function () {
        let locations = this.$store.state.locationData
        for (var i = 0; i < locations.length; i++) {
          this.$store.dispatch('storeLocation', locations[i])
        }
      },
      migratepersons: function () {
        let persons = this.$store.state.personData.map((p) => ({id: p.id, name: p.name, allergies: p.allergies, instrument: p.instrument, mobile: p.mobile}))
        for (var i = 0; i < persons.length; i++) {
          this.$store.dispatch('storePerson', persons[i])
        }
      },
      migrategroups: function () {
        let groups = this.$store.state.uids.map((p) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          role: p.role,
          url: p.url,
          privileged: p.privileged,
          postaladdress: p.postaladdress,
          comments: p.comments
        }))
        for (var i = 0; i < groups.length; i++) {
          this.$store.dispatch('storeGroup', groups[i])
        }
      },

      setEventRelations: function () {
        let events = this.$store.state.eventinfoData
        for (var i = 0; i < events.length; i++) {
          this.$store.dispatch('setEventLcoation', [events[i].id, events[i].location])
          if (!events[i].involved || events[i].involved.length <= 0) continue
          for (var j = 0; j < events[i].involved.length; j++) {
            this.$store.dispatch('setEventInvolved', [events[i].id, events[i].involved[j]])
          }
        }
      },

      setManagerRelations: function () {
        let persons = this.$store.state.personData.map((p) => ({id: p.id, name: p.name, managerof: p.managerof, memberof: p.memberof}))
        for (var i = 0; i < persons.length; i++) {
          for (var j = 0; j < persons[i].managerof.length; j++) {
            this.$store.dispatch('setManagerRelation', [persons[i].id, persons[i].managerof[j]])
            // this.$store.dispatch('setMemberRelation', [persons[i].id, persons[i].managerof[j]]) // manager must be member
          }
        }
      },

      setMemberRelations: function () {
        let persons = this.$store.state.personData.map((p) => ({id: p.id, name: p.name, managerof: p.managerof, memberof: p.memberof}))
        for (var i = 0; i < persons.length; i++) {
          for (var j = 0; j < persons[i].memberof.length; j++) {
            this.$store.dispatch('setMemberRelation', [persons[i].id, persons[i].memberof[j]]) // manager must be member
          }
        }
      }
    }

  }
</script>

<style scoped>

</style>
