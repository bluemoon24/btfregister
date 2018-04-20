store.state.uidthis.$store.state.uid<template>
  <v-app light>
    <v-navigation-drawer
      :mini-variant.sync="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      fixed
      app
    >
    <!-- Uid {{ $store.state.uid }}, realUid {{ $store.state.realUid }}, privileged {{ $privileged }} -->
    <v-toolbar>
      <v-toolbar-title>{{ $store.state.udata.name
        + ($privileged ? ' (admin)' : '')}}</v-toolbar-title>
      <v-spacer></v-spacer>

    <v-btn
      icon
      @click.stop="miniVariant = !miniVariant"
    >
      <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
    </v-btn>
    </v-toolbar>
    <!-- Params {{ $route.params.id }} -->
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <!-- <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>remove</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <div v-if="$privileged"> -->
      <span>{{ $store.state.udata.name }}</span>
      <!-- <v-menu :nudge-width="300">
          <v-toolbar-side-icon slot="activator">
          <v-icon color="red">account_box</v-icon>
        </v-toolbar-side-icon>

        <v-list>
          <template v-for="item in [{id: '0', name: '<create new>'}, {id: '-1', name: '<delete current>'}].concat($store.state.uids)" >
          <v-list-tile @click="switchToUid(item.id)" :key="item.id">
            <v-list-tile-title v-text="item.name" ></v-list-tile-title>
          </v-list-tile>
        </template>
        </v-list>
      </v-menu> -->
    <!-- </div> -->
      <!-- <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
      </v-btn> -->
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; Tangofestival Bonn 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        // name: 'New',
        clipped: false,
        drawer: true,
        fixed: false,
        items: [],
        miniVariant: false,
        title: 'Tango Festival Bonn Artist Registration 2018'
      }
    },
    // async fetch ({ store, params, redirect }) {
    //   console.log('default', params.id)
    //   if (params.id === '0' && !store.state.privileged) return redirect('/')
    //   await store.dispatch('getUserData', params.id)
    // },
    watch: {
      '$store.state.uid': 'update',
      '$store.state.privileged': 'update'
    },
    computed: {
      // name () {
      //   console.log('****user', this.user)
      //   return this.user.name || 'New ..'
      // }
    },
    created: function () {
      console.log('created in default.vue')
      this.update()
    },
    methods: {
      // switchToUid: function (uid) {
      //   console.log('switch to', uid, this.$route.params.id)
      //   this.$store.dispatch('setRealUser', this.$route.params.id)
      //   if (uid < 0) {
      //     console.log('delete current account', this.$store.state.uid)
      //     this.$store.dispatch('deleteGroup', this.$store.state.uid)
      //   } else if (uid === '0' || !uid) {
      //     console.log('switch to, uid is 0, route:/' + this.$route.params.id + '/account')
      //     this.$router.push({path: '/' + this.$route.params.id + '/account'})
      //     this.$store.dispatch('getUserData', 0)
      //   } else {
      //     this.$store.dispatch('getUserData', uid)
      //   }
      // },
      update: function () {
        this.$store.dispatch('getUserData', this.$store.state.uid)
        console.log('mixins', this.$privileged, this.$canedit, this.$validuser, this.$route.params.id)
        console.log('default:update uid:', this.$store.state.uid, 'params.id', this.$route.params.id)
        // let uid = this.$store.state.uid || this.$route.params.id
        // if (this.$route.params.id) this.$router.push({path: '/'})
        // console.log('***update ', uid, this.$store.state.uids.find((e) => (e.id === uid)))
        // this.user = this.$store.state.uids.find((e) => (e.id === uid))
        this.items = [ { icon: 'apps', title: 'Welcome', to: '/' + this.$store.state.uid } ]
        this.name = (this.$store.state.uid ? this.$store.state.udata.name : 'New')
        if (this.$store.state.uid || this.$privileged) {
          this.items.push({ icon: 'account_circle', title: 'Account', to: '/' + this.$store.state.uid + '/account' })
          this.items.push({ icon: 'details', title: 'Details', to: '/' + this.$store.state.uid + '/details' })
          // this.items.push({ icon: 'card_travel', title: 'Travel', to: '/' + this.$store.state.uid + '/travel' })
          this.items.push({ icon: 'info', title: 'Timeline', to: '/' + this.$store.state.uid + '/eventinfo' })
        }
        if (this.$privileged) {
          this.items.push({ icon: 'edit', title: 'Edit Events', to: '/' + this.$store.state.uid + '/eventeditor' })
          this.items.push({ icon: 'location_searching', title: 'Edit Locations', to: '/' + this.$store.state.uid + '/locations' })
          this.items.push({ icon: 'account_box', title: 'Admin', to: '/' + this.$store.state.uid + '/admin' })
        }
        // console.log('layout updated', this.$store.state.uids, this.$store.state.privileged)
      }
    }
  }
</script>
<style lang='stylus'>

</style>
