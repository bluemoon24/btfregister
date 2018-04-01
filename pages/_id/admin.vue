<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 md12>
        <!-- <v-toolbar dark dense flat v-for="item in $store.state.uids" :key="item.id">
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title>{{ item.name }} </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn flat small>Link One</v-btn>
            <v-btn flat small>Link Two</v-btn>
            <v-btn flat small>Link Three</v-btn>
          </v-toolbar-items>
        </v-toolbar> -->
        <!-- <v-btn v-for="action in actions" :key="action.id" class="ml-1 mt-4" flat big nuxt @click="selectAction(action.id)">
        {{ action.label }}
        </v-btn> -->

        <v-list dark flat>
          <v-list-tile v-for="item in $store.state.uids" :key="item.id">
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            <v-spacer />
            <v-btn v-for="action in actions" :key="action.id" class="ml-1 mt-4" flat icon small dense nuxt @click="selectAction(item.id, action.id)">
              <v-icon >{{ action.icon }}</v-icon>
            </v-btn>

            <!-- <v-menu open-on-hover top offset-y>
               <v-btn dark slot="activator">Action</v-btn>
               <v-list>
                 <v-list-tile v-for="item in options" :key="item" @click="">
                   <v-list-tile-title>{{ item }}</v-list-tile-title>
                 </v-list-tile>
               </v-list>
             </v-menu> -->
           </v-list-tile>
        </v-list>

      </v-flex>
      </v-layout>

      <!-- <v-btn class="ml-5 mt-4" flat small nuxt @click="selectAction" :to="'/' + selectedAction + '/'">Switch to {{ selectedAction }}</v-btn> -->
      <!-- <v-flex xs6 md6>
          <v-btn class="ml-5 mt-4" flat small nuxt outline to="/0/account">New...</v-btn>
      </v-flex> -->
    <!-- Work as {{ $store.state.uids.find(uid => (uid.id === selectedAction)).name || '' }}, Mail to , News, Message -->
  </div>
</template>

<script>
  export default {
    data: () => {
      return {
        selectedAction: '',
        actions: [
          { label: 'Mail to..', id: 'mail', icon: 'mail' },
          { label: 'News for', id: 'news', icon: 'message' },
          { label: 'Delete', id: 'delete', icon: 'delete' },
          { label: 'Work as..', id: 'switch', icon: 'remove_re_eye' }
        ]
      }
    },
    async fetch ({ store, params, redirect, app }) {
      await store.dispatch('getUserData', params.id)
      if (!store.state.privileged) {
        return redirect('/' + params.id)
      } else {
        store.dispatch('setRealUser', params.id)
      }
    },
    computed: {
      list: function () {
        return this.$store.state.uids.map(el => ({uid: el, micon: 'mail', nicon: 'news', sicon: 'switch'}))
      }
    },
    mounted: function () {
      console.log('mixins mounted', this.$validuser)
      this.selectedAction = this.$store.state.uid
      // console.log('realUid', this.$store.state.realUid)
    //   this.vipList = this.$store.state.uids.map(v => (v))
    //   this.vipList.push({id: '', name: 'New ...'})
    },
    methods: {
      selectAction: function (action) {
        console.log('Admin:selectedAction', action)
        // this.$store.dispatch('getUserData', this.selectedAction)
        // this.$store.dispatch('setRealUser', this.selectedAction)
      }
    }
  }
</script>

<style scoped>

</style>
