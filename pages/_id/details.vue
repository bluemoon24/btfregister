<template>
    <div>
      <tb-list
        title='Members'
        add_icon='person_add'
        :list="list"
        :actions="[{ id: 'submit', label: 'submit', close: true }, { id: 'cancel', label: 'cancel', close: true }]"
        v-on:tblistevent="handleListEvents"
        >
        <person-form
          slot-scope="props"
          :person.sync="members[props.index].person"
          :role="$store.state.udata.role"
          v-on:managerChanged="managerChanged"
          />
       </tb-list>
       <v-snackbar
        color="red"
        :timeout="0"
        v-model="showNoManager"
        >
        Cannot delete manager.<br>Choose another member as manager and try again.
        <v-btn  flat @click.native="showNoManager = false">Ok</v-btn>
      </v-snackbar>
  </div>
</template>

<script>
  import { Person } from '~/components/Classes.js'
  import TbList from '~/components/TbList.vue'
  import PersonForm from '~/components/PersonForm.vue'
  export default {
    components: {
      TbList, PersonForm
    },
    data: () => {
      return {
        showNoManager: false,
        selectedIndex: -1,
        valid: false,
        managerSelected: '',
        previousManager: null,
        members: [{
          selected: false,
          person: new Person()
        }],
        rules: {
          required: (value) => !!value || 'Required.',
          phone: (value) => {
            return /^\d?(\d+\s?)*$/.test(value) || 'Invalid number'
          }
        }
      }
    },
    async fetch ({ store, params, redirect }) {
      if (store.state.uid === '0') redirect('/' + params.id)
      await store.dispatch('getUserData', store.state.uid || params.id)
      // await store.dispatch('getMembers', store.state.uid)
    },
    watch: {
      '$store.state.uid': 'update'
    },
    computed: {
      list: function () {
        return this.members.map((m) => ({ item: m, header: m.person.name, icon: m.person.isManager ? 'star' : null }))
      }
    },
    created: function () {
      this.update()
    },
    methods: {
      update: function () {
        console.log('details.update: uid', this.$store.state.uid ? 'is true' : 'is false')
        if (!this.$store.state.uid) return this.$router.push('/' + this.$route.params.id)
        this.members = Array.from(this.$store.state.udata.members, (m) => {
          let thisperson = new Person(m)
          thisperson.isManager = thisperson.isManager || this.$store.state.udata.managedby.id === thisperson.id
          return { manager: false, selected: false, person: thisperson }
        })
      },
      validationRule: function (k) {
        switch (k) {
          case 'name': return [this.rules.required]
          case 'mobile': return [this.rules.phone]
          default: return []
        }
      },
      managerChanged: function (newid, newval) {
        // this.selectIndex()
        this.previousManager = null
        for (var i = 0; i < this.members.length; i++) {
          let person = this.members[i].person
          console.log('managerChanged', newid, newval, person.id, person.isManager)
          person.isManager = false
          if (person.id === newid) person.isManager = newval
        }
        console.log(' manager changed', this.members[this.selectedIndex].person, newid, newval)
      },
      handleListEvents: function (e) {
        switch (e.type) {
          case 'add':
            this.addMember()
            break
          case 'delete':
            this.deleteMember()
            break
          case 'selected':
            this.selectedIndex = e.payload
            if (this.selectedIndex >= 0) console.log('details:selected', this.members[this.selectedIndex].person.isManager)
            break
          case 'action':
            if (e.payload.action === 'submit') {
              this.submit(e.payload.item)
            }
            break
        }
      },
      // expansionChanged: function () {
      //   console.log('expansionChanged')
      // },
      // selectIndex: function () {
      //   this.selectedIndex = this.members.findIndex((e) => (e.selected))
      // },
      deleteMember: function () {
        console.log('deleteMember', this.members[this.selectedIndex])
        if (this.members[this.selectedIndex].person.isManager) {
          this.showNoManager = true
          return
        }
        // this.members.splice(this.selectedIndex, 1)
        this.$store.dispatch('deleteMember', [this.members[this.selectedIndex].person.id, this.$store.state.uid])
        console.log('selectedIndex', this.selectedIndex)
      },
      addMember: function () {
        if (this.selectedIndex >= 0) this.members[this.selectedIndex].selected = false
        if (!this.members) this.members = []
        let p = new Person()
        p.isManager = false
        this.selectedIndex = this.members.push({
          selected: true,
          person: p
        }) - 1
        console.log('details:addMember', this.members, this.selectedIndex)
      },
      submit: function (item) {
        // if there is a previous manager, remove this group from his manager list
        // add this group to the managerlist of the new manager
        // then submit both persons
        console.log('details:submit', item)
        this.$store.dispatch('updatePerson', [item.person, this.$store.state.uid])

        // let groupid = this.$store.state.uid
        // let previous = this.previousManager
        // if (previous) {
        //   // console.log('previous', previous)
        //   let mgridx = previous.managerof.findIndex((e) => (e === groupid))
        //   if (mgridx >= 0) previous.managerof.splice(mgridx, 1)
        //   console.log('managed groupid found on', mgridx, previous)
        // }
        //
        // let person = new Person(item.person) // note: constructor removes the local isManager field
        // if (item.person.isManager) {
        //   let mbridx = person.memberof.findIndex((g) => (g === groupid))
        //   if (mbridx < 0) person.memberof.push(groupid) // make sure new manager is also member
        //   let mgridx = person.managerof.findIndex((g) => (g === groupid)) // already manager?
        //   console.log('new group found', mgridx)
        //   if (mgridx < 0) person.managerof.push(groupid)
        // }
        // console.log('new', person)
        // console.log('group', this.$store.state.uid)
        // this.$store.dispatch('updatePerson', [person, this.$store.state.uid])
        // if (previous) this.$store.dispatch('uploadPersonData', previous)

        this.previousManager = null
      }
    }
  }
</script>

<style scoped>

</style>
